// Pure date helpers for the stay search screen. Dates are ISO strings ("2026-10-13") handled in UTC.
import { addDays } from './stay-search';

export type Month = { year: number; month: number }; // month: 0-11
export type Range = { start: string | null; end: string | null };

const parse = (iso: string) => new Date(`${iso}T00:00:00Z`);
const format = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-GB', { ...options, timeZone: 'UTC' });

const dayMonth = format({ day: 'numeric', month: 'short' });
const weekday = format({ weekday: 'short' });
const monthName = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
const fullDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeZone: 'UTC' });

export const formatDay = (iso: string) => dayMonth.format(parse(iso)); // 13 Oct
export const formatWeekday = (iso: string) => weekday.format(parse(iso)); // Tue
export const formatWithWeekday = (iso: string) => `${formatWeekday(iso)}, ${formatDay(iso)}`; // Tue, 13 Oct
export const formatFull = (iso: string) => fullDate.format(parse(iso)); // Tuesday, October 13, 2026

// "13 – 15 Oct", or "30 Oct – 2 Nov" across months
export const rangeLabel = (start: string, end: string) =>
    start.slice(0, 7) === end.slice(0, 7) ? `${parse(start).getUTCDate()} – ${formatDay(end)}` : `${formatDay(start)} – ${formatDay(end)}`;

export const monthOf = (iso: string): Month => ({ year: Number(iso.slice(0, 4)), month: Number(iso.slice(5, 7)) - 1 });
export const shiftMonth = ({ year, month }: Month, by: number): Month => {
    const d = new Date(Date.UTC(year, month + by, 1));
    return { year: d.getUTCFullYear(), month: d.getUTCMonth() };
};
export const sameMonth = (a: Month, b: Month) => a.year === b.year && a.month === b.month;
export const monthLabel = ({ year, month }: Month) => monthName.format(new Date(Date.UTC(year, month, 1)));

// A month as a Sunday-first grid: null cells pad the first week, the rest are ISO dates
export const monthCells = ({ year, month }: Month): (string | null)[] => {
    const lead = new Date(Date.UTC(year, month, 1)).getUTCDay();
    const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    return [...Array<null>(lead).fill(null), ...Array.from({ length: days }, (_, i) => new Date(Date.UTC(year, month, i + 1)).toISOString().slice(0, 10))];
};

// First tap sets the start; a later second tap sets the end; any other tap starts a new range
export const pickDate = ({ start, end }: Range, iso: string): Range =>
    start && !end && iso > start ? { start, end: iso } : { start: iso, end: null };

// Quick ranges: tonight, and the Friday-to-Sunday weekends (a weekend already under way starts today)
export const tonight = (today: string): Range => ({ start: today, end: addDays(today, 1) });
const weekendFrom = (today: string, fridayOffset: number): Range => {
    const start = addDays(today, fridayOffset);
    return { start, end: addDays(start, 2) };
};
export const thisWeekend = (today: string): Range => {
    const day = parse(today).getUTCDay(); // 0 Sunday ... 6 Saturday
    if (day === 6 || day === 0) return { start: today, end: addDays(today, 1) };
    return weekendFrom(today, 5 - day);
};
export const nextWeekend = (today: string): Range => {
    const day = parse(today).getUTCDay();
    const toFriday = (5 - day + 7) % 7;
    return weekendFrom(today, day >= 1 && day <= 5 ? toFriday + 7 : toFriday);
};
