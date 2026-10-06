// Room detail, read from the BookMe+ API. A room is a product of the stay's vendor; its properties ("Max 8 Guests",
// "3 Bedrooms", "Free cancellation", "No smoking"…) are sorted into key facts, things to know and facilities.
// Anything the API does not provide is left empty, and the page hides that block.
import { apiGet, assetUrl, included } from './api';
import type { Fact, FacilityGroup, RoomDetail, ThingToKnow } from './types';

type Json = any; // eslint-disable-line @typescript-eslint/no-explicit-any

const factKind = (value: string): Fact['kind'] | null => {
    if (/adult/i.test(value)) return 'adults';
    if (/kid|child/i.test(value)) return 'kids';
    if (/guest|sleeps/i.test(value)) return 'maxGuests';
    if (/bathroom/i.test(value)) return 'bathrooms';
    if (/bedroom|\bbeds?\b/i.test(value)) return 'bedrooms';
    if (/sofa/i.test(value)) return 'sofas';
    if (/wi-?fi/i.test(value)) return 'wifi';
    if (/m²|m2|sqm|size/i.test(value)) return 'size';
    if (/view/i.test(value)) return 'view';
    if (value.split(/\s+/).length <= 3 && /\b(villa|bungalow|suite|studio|apartment|house|cabin|dorm|dormitory)\b/i.test(value)) return 'propertyType';
    return null;
};

const CANCELLATION = /refund|cancel/i;
const RULE = /^(no|non)\b|not allowed|prohibit|quiet|after \d/i;

const FACT_ORDER: Fact['kind'][] = ['adults', 'kids', 'propertyType', 'bedrooms', 'bathrooms', 'maxGuests', 'sofas', 'wifi', 'size', 'view'];
const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
// Variant option types that are not shown as extras: pricing / booking plumbing and the ones turned into facts or notices
const SKIPPED_VARIANT_TYPES = new Set(['location', 'payment', 'source', 'number-of-adults', 'number-of-kids', 'kids-age-max', 'free-cancellation']);

// A variant's option values with their option type: [{ type, value }]
export const optionsOf = (variantId: string | undefined, lookup: Map<string, Json>) =>
    ((variantId && lookup.get(`variant:${variantId}`)?.relationships.option_values?.data) ?? [])
        .map((ref: Json) => lookup.get(`option_value:${ref.id}`))
        .filter(Boolean)
        .map((value: Json) => ({ value: value.attributes, type: lookup.get(`option_type:${value.relationships.option_type?.data?.id}`)?.attributes }))
        .filter((o: Json) => o.type);

// Facts, facilities and notices of a room product. The room list cards and the detail page both read it, so they always agree.
export const parseRoomProduct = (product: Json, lookup: Map<string, Json>) => {
    const values: string[] = [];
    for (const ref of product.relationships.product_properties?.data ?? []) {
        const value = String(lookup.get(`${ref.type}:${ref.id}`)?.attributes?.value ?? '').trim();
        if (value && !/^placeholder$/i.test(value) && !values.some((v) => v.toLowerCase() === value.toLowerCase())) values.push(value);
    }

    const facts: Fact[] = [];
    const notices: ThingToKnow[] = [];
    const rules: ThingToKnow[] = [];
    const facilities: string[] = [];

    // The default variant carries the guest numbers and the booking terms
    const variant = optionsOf(product.relationships.default_variant?.data?.id, lookup).filter((o: Json) => o.type.kind === 'variant');
    const adults = variant.find((o: Json) => o.type.name === 'number-of-adults');
    const kids = variant.find((o: Json) => o.type.name === 'number-of-kids');
    const kidsAge = variant.find((o: Json) => o.type.name === 'kids-age-max');
    if (adults) facts.push({ kind: 'adults', label: capitalize(adults.value.presentation) });
    if (kids) facts.push({ kind: 'kids', label: capitalize(kids.value.presentation) + (kidsAge ? ` (0–${kidsAge.value.name})` : '') });
    for (const { type, value } of variant) {
        if (type.name === 'free-cancellation') notices.push({ type: 'notice', text: capitalize(String(value.name).replace(/-/g, ' ')) });
        else if (!SKIPPED_VARIANT_TYPES.has(type.name)) facilities.push(value.presentation);
    }

    // The master variant lists the room's facilities, grouped by option type (Entertainment, Comforts...)
    const groups = new Map<string, { position: number; group: FacilityGroup }>();
    for (const { type, value } of optionsOf(product.relationships.primary_variant?.data?.id, lookup).filter((o: Json) => o.type.kind === 'product')) {
        const entry = groups.get(type.name) ?? { position: type.position as number, group: { id: type.name as string, name: type.presentation as string, items: [] as string[] } };
        entry.group.items.push(value.presentation);
        groups.set(type.name, entry);
    }
    const facilityGroups = [...groups.values()].sort((a, b) => a.position - b.position).map((g) => g.group);

    // The product's properties add more facts, notices, rules and facilities
    for (const value of values) {
        const kind = factKind(value);
        if (CANCELLATION.test(value)) notices.push({ type: 'notice', text: value });
        else if (RULE.test(value)) rules.push({ type: 'rule', icon: /quiet|after \d|night/i.test(value) ? 'moon' : 'ban', label: value });
        else facilities.push(value);
        if (kind && !facts.some((f) => f.kind === kind)) facts.push({ kind, label: value });
    }
    facts.sort((a, b) => FACT_ORDER.indexOf(a.kind) - FACT_ORDER.indexOf(b.kind));
    const known = new Set(facilityGroups.flatMap((g) => g.items.map((i) => i.toLowerCase())));
    const extra = [...new Set(facilities)].filter((i) => !known.has(i.toLowerCase()));

    return {
        facts,
        facilities: extra.length > 0 ? [...facilityGroups, { id: 'facilities', name: 'More facilities', items: extra }] : facilityGroups,
        thingsToKnow: [...notices, ...rules] as ThingToKnow[],
    };
};

// How many rooms one booking can take: the smaller of the API's per-order limit and the stock count; null when the API gives neither
export const roomLimit = (product: Json, lookup: Map<string, Json>): number | null => {
    const perOrder = Number(product.attributes.max_quantity_per_order);
    const stock = Number([...lookup.values()].find((i) => i.type === 'stock_item')?.attributes?.count_on_hand);
    const limits = [perOrder, stock].filter((n) => n > 0);
    return limits.length > 0 ? Math.min(...limits) : null;
};

export const getRoom = async (slug: string, roomId: string): Promise<RoomDetail | null> => {
    let vendor: Json;
    let productJson: Json;
    try {
        [vendor, productJson] = await Promise.all([
            apiGet(`vendors/${encodeURIComponent(slug)}`, {}).then((j) => j.data),
            apiGet(`products/${encodeURIComponent(roomId)}`, { include: 'images,product_properties,vendor,primary_variant.option_values.option_type,default_variant.option_values.option_type,default_variant.stock_items' }),
        ]);
    } catch {
        return null; // unknown stay or room, or the API is unavailable
    }
    const product = productJson.data;
    // The room must belong to this stay
    if (!vendor || !product || String(product.relationships.vendor?.data?.id) !== String(vendor.id)) return null;

    const lookup = included(productJson);
    const name = product.attributes.name as string;

    const { facts, facilities, thingsToKnow } = parseRoomProduct(product, lookup);

    return {
        id: String(product.id),
        stayId: String(vendor.id),
        stayName: vendor.attributes.name as string,
        name,
        roomType: facts.find((f) => f.kind === 'propertyType')?.label ?? '',
        pricePerNight: Number(product.attributes.price) || 0,
        currency: (product.attributes.currency as string) ?? 'USD',
        available: Boolean(product.attributes.available),
        maxRooms: roomLimit(product, lookup),
        description: String(product.attributes.description ?? '').trim(),
        photos: (product.relationships.images?.data ?? [])
            .map((ref: Json) => assetUrl(lookup.get(`image:${ref.id}`)))
            .filter((src: string | undefined, i: number, all: (string | undefined)[]) => src && all.indexOf(src) === i)
            .map((src: string, i: number) => ({ src, alt: `${name} – photo ${i + 1}` })),
        facts,
        facilities,
        thingsToKnow,
    };
};
