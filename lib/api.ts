// Server-only client for the BookMe+ (Spree storefront) API. API_URL / API_KEY / API_SECRET come from .env and
// are never sent to the browser. If a request fails the matching homepage section is simply left out.

type Json = any; // eslint-disable-line @typescript-eslint/no-explicit-any

const REVALIDATE_SECONDS = 300;
const TIMEOUT_MS = 8000;

// Kept on globalThis so dev hot reloads do not fetch a new token (a new token changes the fetch cache key and misses the cache)
const tokenStore = globalThis as typeof globalThis & { __bookmeToken?: { value: string; expiresAt: number } | null };

export const getAccessToken = async (): Promise<string> => {
    const cached = tokenStore.__bookmeToken;
    if (cached && cached.expiresAt > Date.now() + 30_000) return cached.value;
    // Read each variable directly (destructuring process.env is not reliable under Turbopack)
    const API_URL = process.env.API_URL;
    const API_KEY = process.env.API_KEY;
    const API_SECRET = process.env.API_SECRET;
    if (!API_URL || !API_KEY || !API_SECRET) throw new Error(`Missing env: ${[['API_URL', API_URL], ['API_KEY', API_KEY], ['API_SECRET', API_SECRET]].filter(([, v]) => !v).map(([k]) => k).join(', ')}`);

    const res = await fetch(`${API_URL}/spree_oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ grant_type: 'client_credentials', client_id: API_KEY, client_secret: API_SECRET }),
        cache: 'no-store',
        signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`Token request failed (${res.status})`);
    const { access_token, expires_in } = await res.json();
    tokenStore.__bookmeToken = { value: access_token, expiresAt: Date.now() + expires_in * 1000 };
    return access_token;
};

export const apiGet = async (path: string, params: Record<string, string>): Promise<Json> => {
    const url = `${process.env.API_URL}/api/v2/storefront/${path}?${new URLSearchParams(params)}`;
    const request = async (token: string) =>
        fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
            next: { revalidate: REVALIDATE_SECONDS },
            signal: AbortSignal.timeout(TIMEOUT_MS),
        });

    let res = await request(await getAccessToken());
    if (res.status === 401) {
        tokenStore.__bookmeToken = null; // expired or revoked: get a new token once
        res = await request(await getAccessToken());
    }
    if (!res.ok) throw new Error(`${path} failed (${res.status})`);
    return res.json();
};

export const included = (json: Json) => new Map<string, Json>((json.included ?? []).map((i: Json) => [`${i.type}:${i.id}`, i]));
export const assetUrl = (asset?: Json): string | undefined => asset?.attributes?.original_url ?? undefined;

// Events are the children of the root "Events" taxon (id 17).
const EVENTS_TAXON_ID = '17';
// Hotels are the products inside the "Accommodations" taxon.
const ACCOMMODATIONS_TAXON_ID = '136';
const THREE_YEARS_MS = 3 * 365 * 24 * 3600 * 1000;

type Card = { id: string; title: string; image?: string; date?: string; location: string; price: number; currency: string; href: string };

// Homepage rows show the newest few; the "See all" page loads up to ALL_LIMIT
export const HOME_LIMIT = 4;
const ALL_LIMIT = 200;

// An event's own min_price is usually empty on staging; its tickets are the products inside the event taxon.
const lowestTicketPrice = async (taxonId: string): Promise<{ price: number; currency: string } | null> => {
    const json = await apiGet('products', { per_page: '100', 'filter[taxons]': taxonId, 'fields[product]': 'price,currency,available' });
    const prices = (json.data as Json[]).filter((p) => p.attributes.available && Number(p.attributes.price) >= 0);
    if (prices.length === 0) return null;
    const cheapest = prices.reduce((min, p) => (Number(p.attributes.price) < Number(min.attributes.price) ? p : min));
    return { price: Number(cheapest.attributes.price), currency: cheapest.attributes.currency ?? 'USD' };
};

const fetchEvents = async (limit: number) => {
    const pages = await Promise.all([1, 2].map((page) =>
        apiGet('taxons', { per_page: '100', page: String(page), 'filter[parent_id]': EVENTS_TAXON_ID, include: 'home_banner,places' }),
    ));
    const now = Date.now();

    const candidates = pages
        .flatMap((json) => {
            const lookup = included(json);
            return (json.data as Json[]).map((t) => ({ t, lookup }));
        })
        .flatMap(({ t, lookup }) => {
            const a = t.attributes;
            const image = assetUrl(lookup.get(`asset:${t.relationships.home_banner?.data?.id}`));
            const start = a.from_date ? Date.parse(a.from_date) : NaN;
            const end = a.to_date ? Date.parse(a.to_date) : NaN;
            // Needs a banner and must be sellable on the web and not finished
            if (!image || !a.purchasable_on_web || (end && end < now)) return [];
            // Staging has many test events with placeholder dates decades away: only trust a date within the next 3 years
            const upcoming = start >= now && start <= now + THREE_YEARS_MS;
            const place = lookup.get(`place:${t.relationships.places?.data?.[0]?.id}`);
            return [{
                id: String(t.id),
                upcoming,
                start,
                updatedAt: Date.parse(a.updated_at) || 0,
                minPrice: a.min_price ? { price: Number(a.min_price), currency: (a.currency as string) ?? 'USD' } : null,
                item: {
                    id: `api-event-${t.id}`,
                    title: a.name as string,
                    image,
                    date: upcoming ? (a.from_date as string) : undefined,
                    location: (place?.attributes?.name as string | undefined) ?? '',
                    href: `/events/${String(a.permalink).replace(/^events\//, '')}`,
                },
            }];
        })
        // Newest first (a higher id was created later)
        .sort((x, y) => Number(y.id) - Number(x.id));

    // Price candidates in batches until enough have tickets on sale (no tickets, no card)
    const cards: Card[] = [];
    const batchSize = Math.max(limit * 2, 8);
    for (let i = 0; i < candidates.length && cards.length < limit; i += batchSize) {
        const batch = await Promise.all(
            candidates.slice(i, i + batchSize).map(async (c) => ({ c, price: c.minPrice ?? (await lowestTicketPrice(c.id).catch(() => null)) })),
        );
        cards.push(...batch.flatMap(({ c, price }) => (price ? [{ ...c.item, ...price }] : [])));
    }
    return cards.slice(0, limit);
};

const IMAGE_FIELDS = 'name,slug,price,currency,available,images';
const MAX_PAGES = 15;

// Products come 100 per page; read every page of a filtered listing (pages are fetched in parallel).
const fetchAllProducts = async (filter: Record<string, string>) => {
    const query = { per_page: '100', 'fields[product]': IMAGE_FIELDS, include: 'images', ...filter };
    const first = await apiGet('products', { ...query, page: '1' });
    const pages = Math.min(first.meta?.total_pages ?? 1, MAX_PAGES);
    const rest = await Promise.all(Array.from({ length: pages - 1 }, (_, n) => apiGet('products', { ...query, page: String(n + 2) })));
    return [first, ...rest].flatMap((json) => {
        const lookup = included(json);
        return (json.data as Json[]).map((p) => ({ p, lookup, image: assetUrl(lookup.get(`image:${p.relationships.images?.data?.[0]?.id}`)) }));
    });
};

// Departures of the same route / tour differ only by a time suffix: "Phnom Penh → Siem Reap (14:00)", "Sunset Tour - 16:30".
const withoutTime = (name: string) => name.replace(/\s*(\(\d{1,2}:\d{2}\)|-\s*\d{1,2}:\d{2}.*)\s*$/, '').trim();

// One card per distinct title: cheapest price, the first photo found; the newest products (highest id) come first.
const groupProducts = (rows: { p: Json; image?: string }[], href: (slug: string) => string, accept: (title: string) => boolean = () => true, limit = ALL_LIMIT): Card[] => {
    const groups = new Map<string, { newest: number; card: Card }>();
    for (const { p, image } of rows) {
        const a = p.attributes;
        const title = withoutTime(String(a.name));
        const price = Number(a.price);
        if (!a.available || !(price >= 0) || !accept(title)) continue;
        const key = title.toLowerCase();
        const existing = groups.get(key);
        if (!existing) {
            groups.set(key, { newest: Number(p.id), card: { id: `api-product-${p.id}`, title, image, location: '', price, currency: a.currency ?? 'USD', href: href(a.slug) } });
            continue;
        }
        existing.newest = Math.max(existing.newest, Number(p.id));
        if (image && !existing.card.image) existing.card.image = image;
        if (price > 0 && (existing.card.price === 0 || price < existing.card.price)) existing.card.price = price;
    }
    return [...groups.values()].sort((x, y) => y.newest - x.newest).slice(0, limit).map(({ card }) => card);
};

const notFerry = (t: string) => !/koh rong/i.test(t);
const notTour = (t: string) => !/tour/i.test(t);

// Hotels are the vendors that own accommodation products: one card per hotel, with its cheapest available room price.
const fetchHotels = async (limit: number): Promise<Card[]> => {
    const rows = await fetchAllProducts({
        'filter[taxons]': ACCOMMODATIONS_TAXON_ID,
        include: 'images,vendor',
        'fields[product]': `${IMAGE_FIELDS},vendor`,
        'fields[vendor]': 'name,slug',
    });
    const hotels = new Map<string, Card & { vendorId: number }>();
    for (const { p, lookup, image } of rows) {
        const vendorId = p.relationships.vendor?.data?.id;
        const vendor = lookup.get(`vendor:${vendorId}`)?.attributes;
        const price = Number(p.attributes.price);
        if (!vendor || !p.attributes.available || !(price >= 0)) continue;
        const existing = hotels.get(String(vendorId));
        if (!existing) {
            hotels.set(String(vendorId), { vendorId: Number(vendorId), id: `api-stay-${vendorId}`, title: vendor.name, image, location: '', price, currency: p.attributes.currency ?? 'USD', href: `/stays/${vendor.slug}` });
            continue;
        }
        if (image && !existing.image) existing.image = image;
        if (price > 0 && (existing.price === 0 || price < existing.price)) existing.price = price;
    }
    // Newest hotel first (a higher vendor id was created later)
    return [...hotels.values()].sort((x, y) => y.vendorId - x.vendorId).slice(0, limit).map((hotel) => {
        const { vendorId, ...card } = hotel;
        void vendorId;
        return card;
    });
};
// Tours and things to do are matched by product name (the API has no tour / activity category yet).
const fetchTours = async (limit: number) =>
    groupProducts(await fetchAllProducts({ 'filter[name]': 'Tour' }), (slug) => `/tours/${slug}`, undefined, limit);
const fetchThingsToDo = async (limit: number) =>
    groupProducts(await fetchAllProducts({ 'filter[name]': 'Hop-On' }), (slug) => `/things-to-do/${slug}`, undefined, limit);
const fetchFerries = async (limit: number) =>
    groupProducts(await fetchAllProducts({ 'filter[name]': 'Koh Rong' }), (slug) => `/ferry/${slug}`, undefined, limit);
// Bus routes are the "A → B" transit products; tours and island ferries have their own sections
const fetchBuses = async (limit: number) =>
    groupProducts(await fetchAllProducts({ 'filter[name]': '→' }), (slug) => `/bus/${slug}`, (t) => notTour(t) && notFerry(t), limit);

const sections = [
    { category: 'events', id: 'featured-events', title: 'Featured Events', load: fetchEvents },
    { category: 'hotel', id: 'hotels', title: 'Hotels', load: fetchHotels },
    { category: 'bus', id: 'bus', title: 'Bus Tickets', load: fetchBuses },
    { category: 'tours', id: 'tours', title: 'Tours', load: fetchTours },
    { category: 'things-to-do', id: 'things-to-do', title: 'Things to Do', load: fetchThingsToDo },
    { category: 'ferry', id: 'ferry', title: 'Ferry Tickets', load: fetchFerries },
];

// Every homepage list comes from the API. A list that fails to load or comes back empty is left out.
export const getHomeSections = async () => {
    const loaded = await Promise.all(
        sections.map(async ({ load, ...section }) => {
            try {
                return { ...section, href: `/explore/${section.category}`, items: await load(HOME_LIMIT) };
            } catch (error) {
                console.error(`[api] ${section.category} failed:`, (error as Error).message);
                return { ...section, href: `/explore/${section.category}`, items: [] };
            }
        }),
    );
    return loaded.filter((section) => section.items.length > 0);
};

// Everything in one category, for the "See all" page. Null when the category does not exist.
export const getCategoryItems = async (category: string) => {
    const section = sections.find((s) => s.category === category);
    if (!section) return null;
    const items = await section.load(ALL_LIMIT).catch((error) => {
        console.error(`[api] ${category} failed:`, (error as Error).message);
        return [];
    });
    return { title: section.title, items };
};
