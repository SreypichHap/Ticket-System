import type { StaySearch } from './types';

type Params = Record<string, string | string[] | undefined>;

const DAY = 86_400_000;
export const MAX_CHILD_AGE = 17;

const toIso = (d: Date) => d.toISOString().slice(0, 10);
const parse = (s?: string) => {
    if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
    const d = new Date(`${s}T00:00:00Z`);
    return Number.isNaN(+d) ? null : d;
};

export const todayIso = () => toIso(new Date());
export const addDays = (iso: string, n: number) => toIso(new Date(+parse(iso)! + n * DAY));
export const nightsBetween = (checkIn: string, checkOut: string) => Math.max(1, Math.round((+parse(checkOut)! - +parse(checkIn)!) / DAY));

const first = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v);
const int = (v: string | undefined, fallback: number, min = 1) => {
    const n = Number.parseInt(v ?? '', 10);
    return Number.isFinite(n) ? Math.max(min, n) : fallback;
};

// The search lives in the URL (?checkIn=2026-10-09&checkOut=2026-10-11&rooms=1&guests=2); a missing or past date falls back to a 2-night stay next week
export const parseSearch = (params: Params): StaySearch => {
    const today = todayIso();
    const inDate = first(params.checkIn);
    const outDate = first(params.checkOut);
    const valid = parse(inDate) && parse(outDate) && inDate! >= today && outDate! > inDate!;
    const checkIn = valid ? inDate! : addDays(today, 7);
    const checkOut = valid ? outDate! : addDays(checkIn, 2);
    const rooms = int(first(params.rooms), 1);
    const children = int(first(params.children), 0, 0);
    // Every room needs an adult
    const guests = Math.max(int(first(params.guests), 2), rooms + children);
    const ages = (first(params.ages) ?? '').split(',');
    const childAges = Array.from({ length: children }, (_, i) => {
        const age = Number.parseInt(ages[i] ?? '', 10);
        return Number.isFinite(age) ? Math.min(MAX_CHILD_AGE, Math.max(0, age)) : null;
    });
    return { checkIn, checkOut, rooms, guests, children, childAges };
};

// The search as URL params (children and their ages only when there are children)
export const toQuery = ({ checkIn, checkOut, rooms, guests, children, childAges }: StaySearch) => {
    const query = new URLSearchParams({ checkIn, checkOut, rooms: String(rooms), guests: String(guests) });
    if (children > 0) {
        query.set('children', String(children));
        query.set('ages', childAges.map((age) => age ?? '').join(','));
    }
    return query;
};

const short = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
export const formatShort = (iso: string) => short.format(parse(iso)!);
export const formatRange = (checkIn: string, checkOut: string) => `${formatShort(checkIn)} – ${formatShort(checkOut)} ${parse(checkOut)!.getUTCFullYear()}`;

export const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;
export const summary = ({ checkIn, checkOut, rooms, guests }: StaySearch) =>
    `${plural(nightsBetween(checkIn, checkOut), 'night')} · ${plural(rooms, 'room')} · ${plural(guests, 'guest')}`;

export const formatPrice = (price: number, currency = 'USD', decimals?: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: decimals ?? (Number.isInteger(price) ? 0 : 2), maximumFractionDigits: 2 }).format(price);
