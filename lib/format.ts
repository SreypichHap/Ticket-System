// Event times are shown in the venue's timezone so server and client render the same text.
const TIME_ZONE = 'Asia/Phnom_Penh';

// Events can come without dates (or without an end time): empty / invalid values render as nothing
const valid = (iso?: string) => !!iso && !Number.isNaN(Date.parse(iso));

const dateFmt = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', timeZone: TIME_ZONE });
const timeFmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: TIME_ZONE });
const priceFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });

// "Sat, 03 Oct 2026 4:00 pm - 11:00 pm"
export const formatEventDate = (startAt: string, endAt: string) => {
    if (!valid(startAt)) return '';
    const time = (iso: string) => timeFmt.format(new Date(iso)).toLowerCase();
    return `${dateFmt.format(new Date(startAt))} ${time(startAt)}${valid(endAt) ? ` - ${time(endAt)}` : ''}`;
};

// Same as the ticket page: "Free" for 0, otherwise 2 decimals
export const formatTicketPrice = (price: number) => (price === 0 ? 'Free' : priceFmt.format(price));

// Date and time as separate strings, for the ticket page's Details tab
export const formatEventDay = (startAt: string) => (valid(startAt) ? dateFmt.format(new Date(startAt)) : '');
export const formatEventTimeRange = (startAt: string, endAt: string) => {
    if (!valid(startAt)) return '';
    const time = (iso: string) => timeFmt.format(new Date(iso)).toLowerCase();
    return valid(endAt) ? `${time(startAt)} - ${time(endAt)}` : time(startAt);
};

// "Sat, 03 Oct 2026 · 4:00–11:00 pm" (the am/pm is only repeated when it differs)
export const formatEventDateShort = (startAt: string, endAt: string) => {
    if (!valid(startAt)) return '';
    if (!valid(endAt)) return `${dateFmt.format(new Date(startAt))} · ${timeFmt.format(new Date(startAt)).toLowerCase()}`;
    const [from, fromSuffix] = timeFmt.format(new Date(startAt)).toLowerCase().split(' ');
    const [to, toSuffix] = timeFmt.format(new Date(endAt)).toLowerCase().split(' ');
    return `${dateFmt.format(new Date(startAt))} · ${from}${fromSuffix === toSuffix ? '' : ` ${fromSuffix}`}–${to} ${toSuffix}`;
};

const placedFmt = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true, timeZone: TIME_ZONE });
export const formatPlacedAt = (iso: string) => placedFmt.format(new Date(iso)).replace(/\b(AM|PM)\b/, (m) => m.toLowerCase());
