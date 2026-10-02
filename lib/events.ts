// Event detail + ticket data, read from the BookMe+ API (see ./api). An event is a child taxon of "Events";
// its tickets are the products inside that taxon.
import { apiGet, assetUrl, included } from './api';
import type { EventDetail, Ticket, TicketTier, TicketZone } from './types';

type Json = any; // eslint-disable-line @typescript-eslint/no-explicit-any

const TIER_COLORS: Record<TicketTier, string> = { standard: '#0F6B63', premium: '#5B21B6', standing: '#B4123A', vip: '#1A1530' };
const FALLBACK_IMAGE = '/images/banner-bg.jpg';
const FALLBACK_LOGO = '/images/logo.png';
const MAX_EVENT_SPAN_MS = 31 * 24 * 3600 * 1000;

const tierOf = (name: string): TicketTier => (/vip/i.test(name) ? 'vip' : /premium/i.test(name) ? 'premium' : /standing/i.test(name) ? 'standing' : 'standard');

// "Standard Zone A" -> "Zone A"; otherwise the ticket group's own name ("Ticket Type")
const zoneLabel = (ticketName: string, groupName: string) => {
    const match = ticketName.match(/zone\s+([A-Za-z0-9]+)/i);
    return match ? `Zone ${match[1].toUpperCase()}` : groupName;
};

// The organizer's purchase conditions arrive as one text block: an intro paragraph, then one rule per line
const parseConditions = (raw: unknown) => {
    const lines = String(raw ?? '').split('\n').map((l) => l.replace(/^\s*[-*]\s+/, '').replace(/\*\*/g, '').trim()).filter(Boolean);
    return { intro: lines[0] ?? '', items: lines.slice(1) };
};

const stripEmoji = (text: string) => text.replace(/^[^\p{L}\p{N}]+/u, '').trim();

export const getEventBySlug = async (slug: string): Promise<EventDetail | null> => {
    let json: Json;
    try {
        json = await apiGet(`taxons/events/${encodeURIComponent(slug)}`, { include: 'home_banner,app_banner,web_banner,places,vendor,vendor.logo,vendor.image,category_icon,children' });
    } catch {
        return null; // unknown slug (404) or the API is unavailable
    }
    const t = json.data;
    if (!t || t.attributes.kind !== 'event') return null;

    const a = t.attributes;
    const lookup = included(json);
    const rel = (name: string) => t.relationships[name]?.data?.id;
    const banner = assetUrl(lookup.get(`asset:${rel('home_banner')}`)) ?? assetUrl(lookup.get(`asset:${rel('app_banner')}`)) ?? assetUrl(lookup.get(`asset:${rel('web_banner')}`)) ?? FALLBACK_IMAGE;
    const place = lookup.get(`place:${t.relationships.places?.data?.[0]?.id}`)?.attributes;
    const vendorResource = lookup.get(`vendor:${rel('vendor') ?? t.relationships.vendors?.data?.[0]?.id}`);
    const vendor = vendorResource?.attributes;
    // Small round image on the banner: the organizer's logo, else its image, else the event's own icon
    const organizerLogo =
        assetUrl(lookup.get(`asset:${vendorResource?.relationships?.logo?.data?.id}`)) ??
        assetUrl(lookup.get(`asset:${vendorResource?.relationships?.image?.data?.id}`)) ??
        assetUrl(lookup.get(`asset:${rel('category_icon')}`));

    const venue = {
        name: place?.name ?? '',
        address: place?.formatted_address ?? place?.vicinity ?? '',
        mapUrl: place?.lat && place?.lon ? `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}` : '',
    };

    // Staging often has open-ended events (an end date decades away): only keep an end time that makes sense
    const start = Date.parse(a.from_date);
    const end = Date.parse(a.to_date);
    const endAt = end > start && end - start <= MAX_EVENT_SPAN_MS ? a.to_date : '';

    const productsJson = await apiGet('products', { per_page: '100', 'filter[taxons]': t.id, include: 'images,taxons' }).catch(() => ({ data: [] }));
    const productLookup = included(productsJson);
    const tickets: (Ticket & { group: string })[] = (productsJson.data as Json[]).map((p) => {
        const pa = p.attributes;
        const name = String(pa.name);
        const tier = tierOf(name);
        const group = stripEmoji(
            (p.relationships.taxons?.data ?? []).map((x: Json) => productLookup.get(`taxon:${x.id}`)?.attributes)
                .find((x: Json) => x && String(x.permalink).startsWith(`${a.permalink}/`))?.name ?? 'Tickets',
        ) || 'Tickets';
        return {
            id: String(p.id),
            name,
            price: Number(pa.price),
            currency: pa.currency ?? 'USD',
            image: assetUrl(productLookup.get(`image:${p.relationships.images?.data?.[0]?.id}`)) ?? banner,
            soldOut: !(pa.available && pa.in_stock),
            variantId: String(p.relationships.default_variant?.data?.id ?? ""),
            maxPerOrder: pa.max_quantity_per_order != null ? Number(pa.max_quantity_per_order) : null,
            zone: zoneLabel(name, group),
            venue: venue.name,
            tier,
            color: TIER_COLORS[tier],
            vip: tier === 'vip',
            group,
        };
    });

    const zones: TicketZone[] = [...new Set(tickets.map((x) => x.zone))].sort().map((zone) => ({
        id: `zone-${zone.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        title: zone,
        tickets: tickets.filter((x) => x.zone === zone).map((ticket) => {
            const { group, ...rest } = ticket;
            void group;
            return rest;
        }),
    }));

    return {
        slug,
        title: a.name,
        subtitle: a.subtitle || venue.name,
        banner,
        startAt: a.from_date,
        endAt,
        venue,
        descriptionHtml: a.description ?? '',
        conditions: parseConditions(a.public_metadata?.organizer_rule),
        organizer: { name: vendor?.name ?? '', logo: organizerLogo ?? FALLBACK_LOGO, url: '' },
        zones,
    };
};
