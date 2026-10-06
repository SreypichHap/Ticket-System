// Stay (hotel) detail, read from the BookMe+ API. A stay is a vendor; its rooms are the vendor's products in the
// "Accommodations" taxon. Anything the API does not provide is left empty, and the page hides that block.
import { apiGet, assetUrl, included } from './api';
import { parseRoomProduct, roomLimit } from './rooms';
import type { Fact, Room, RoomAttribute, Stay, ThingToKnow } from './types';

type Json = any; // eslint-disable-line @typescript-eslint/no-explicit-any

const ACCOMMODATIONS_TAXON_ID = '136';

// contact_us is free text ("Hotline: +855 10 718 811\r\n\r\nEmail: …"): take the first phone-like number
const findPhone = (text: string) => text.match(/\+?\d[\d\s().-]{6,}\d/)?.[0].trim() ?? '';

// about_us is plain text with blank lines between paragraphs
const paragraphs = (...texts: (string | null | undefined)[]) =>
    texts
        .flatMap((text) => String(text ?? '').split(/\r?\n\s*\r?\n/))
        .map((p) => p.replace(/\s*\r?\n\s*/g, ' ').trim())
        .filter(Boolean)
        .filter((p, i, all) => all.indexOf(p) === i);

// The rooms' properties ("Free cancellation", "Non Refundable", "Max 8 Guests"…) become the "Things to know" tiles; cancellation terms
// are shown as a notice. Test values such as "Placeholder" are skipped.
const CANCELLATION = /refund|cancel/i;
const toThingsToKnow = (products: Json[], lookup: Map<string, Json>): ThingToKnow[] => {
    const seen = new Set<string>();
    const items: ThingToKnow[] = [];
    for (const p of products) {
        for (const ref of p.relationships.product_properties?.data ?? []) {
            const prop = lookup.get(`${ref.type}:${ref.id}`)?.attributes;
            const value = String(prop?.value ?? '').trim();
            if (!value || /^placeholder$/i.test(value) || seen.has(value.toLowerCase())) continue;
            seen.add(value.toLowerCase());
            if (CANCELLATION.test(`${prop.name} ${value}`)) items.push({ type: 'notice', text: value });
            else items.push({ type: 'rule', icon: /^(no|non)\b|not allowed|prohibit/i.test(value) ? 'ban' : /quiet|night|sleep/i.test(value) ? 'moon' : 'info', label: value });
        }
    }
    return [...items.filter((i) => i.type === 'notice'), ...items.filter((i) => i.type === 'rule').slice(0, 12)];
};

export const getStay = async (slug: string): Promise<Stay | null> => {
    let vendorJson: Json;
    try {
        vendorJson = await apiGet(`vendors/${encodeURIComponent(slug)}`, { include: 'photos,places,image,logo' });
    } catch {
        return null; // unknown slug (404) or the API is unavailable
    }
    const vendor = vendorJson.data;
    if (!vendor) return null;

    // The vendor's rooms: its products in the Accommodations taxon
    const productsJson = await apiGet('products', {
        per_page: '100',
        'filter[taxons]': ACCOMMODATIONS_TAXON_ID,
        include: 'images,product_properties',
        'fields[product]': 'name,images,vendor,product_properties',
    }).catch(() => ({ data: [] }));
    const productLookup = included(productsJson);
    const rooms = (productsJson.data as Json[]).filter((p) => String(p.relationships.vendor?.data?.id) === String(vendor.id));

    // A property with no rooms for sale is not a bookable stay
    if (rooms.length === 0) return null;

    const a = vendor.attributes;
    const lookup = included(vendorJson);
    const name = a.name as string;

    // Photos: the property's own gallery, else the room photos
    const own = (vendor.relationships.photos?.data ?? []).map((ref: Json) => assetUrl(lookup.get(`asset:${ref.id}`))).filter(Boolean) as string[];
    const roomPhotos = rooms.map((p) => assetUrl(productLookup.get(`image:${p.relationships.images?.data?.[0]?.id}`))).filter(Boolean) as string[];
    const sources = own.length > 0 ? own : roomPhotos;
    const photos = sources.map((src, i) => ({ src, alt: `${name} – photo ${i + 1}` }));

    // `places` are the places around the property (other hotels, the town): only the town's name is usable as the area
    const places = (vendor.relationships.places?.data ?? []).map((ref: Json) => lookup.get(`place:${ref.id}`)?.attributes).filter(Boolean) as Json[];
    const area = (places.find((p) => /locality/.test(String(p.types))) ?? places[0])?.name ?? '';

    return {
        slug,
        name,
        stars: Number(a.star_rating) || 0,
        area,
        hotline: findPhone(String(a.contact_us ?? '')),
        photos,
        description: paragraphs(a.short_description, a.about_us),
        thingsToKnow: toThingsToKnow(rooms, productLookup),
    };
};

// The card shows the same facts the room detail page does (both come from parseRoomProduct)
const toRoom = (p: Json, lookup: Map<string, Json>): Room => {
    const { facts, facilities, thingsToKnow } = parseRoomProduct(p, lookup);
    const fact = (kind: Fact['kind']) => facts.find((f) => f.kind === kind)?.label;
    const guests = fact('maxGuests') ?? ['adults', 'kids'].map((k) => fact(k as Fact['kind'])?.replace(/ \(.*\)$/, '')).filter(Boolean).join(' · ');
    const attributes: RoomAttribute[] = [
        { kind: 'guests', label: guests },
        { kind: 'bed', label: fact('bedrooms') ?? '' },
        { kind: 'size', label: fact('size') ?? '' },
        { kind: 'view', label: fact('view') ?? '' },
    ].filter((a): a is RoomAttribute => Boolean(a.label));
    // Guests one room sleeps: the "Max N guests" fact, else the adults and kids of the default variant
    const maxGuests = guests ? (guests.match(/\d+/g) ?? []).reduce((sum, n) => sum + Number(n), 0) || null : null;
    // Perks: the booking terms first (free cancellation...), then the room's facilities
    const amenities = [...new Set([...thingsToKnow.flatMap((t) => (t.type === 'notice' ? [t.text] : [])), ...facilities.flatMap((g) => g.items)])];

    const name = p.attributes.name as string;
    return {
        id: String(p.id),
        name,
        images: (p.relationships.images?.data ?? [])
            .map((ref: Json) => assetUrl(lookup.get(`image:${ref.id}`)))
            .filter(Boolean)
            .map((src: string, i: number) => ({ src, alt: `${name} – photo ${i + 1}` })),
        attributes,
        perks: amenities.slice(0, 4),
        amenities,
        description: String(p.attributes.description ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(),
        soldOut: !p.attributes.available,
        maxRooms: roomLimit(p, lookup),
        maxGuests,
        pricePerNight: Number(p.attributes.price) || 0,
        currency: (p.attributes.currency as string) ?? 'USD',
    };
};

// Rooms page: the stay's name and its rooms. Null when the stay does not exist or has no rooms.
export const getStayRooms = async (slug: string): Promise<{ stayId: string; stayName: string; rooms: Room[] } | null> => {
    let vendor: Json;
    try {
        vendor = (await apiGet(`vendors/${encodeURIComponent(slug)}`, {})).data;
    } catch {
        return null;
    }
    if (!vendor) return null;

    const productsJson = await apiGet('products', {
        per_page: '100',
        'filter[taxons]': ACCOMMODATIONS_TAXON_ID,
        include: 'images,product_properties,default_variant.option_values.option_type,primary_variant.option_values.option_type,default_variant.stock_items',
        'fields[product]': 'name,description,price,currency,available,images,vendor,product_properties,default_variant,primary_variant',
    }).catch(() => ({ data: [] }));
    const lookup = included(productsJson);
    const rooms = (productsJson.data as Json[])
        .filter((p) => String(p.relationships.vendor?.data?.id) === String(vendor.id))
        .map((p) => toRoom(p, lookup));
    if (rooms.length === 0) return null;
    return { stayId: String(vendor.id), stayName: vendor.attributes.name as string, rooms };
};
