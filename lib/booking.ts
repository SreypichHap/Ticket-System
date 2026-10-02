import type { Order } from './orders';
import type { EventDetail, TicketTier } from './types';

export type BookingItem = { id: string; name: string; zone: string; tier: TicketTier; qty: number; unitPrice: number };

export type Booking = {
    masterId: string;
    placedAt: string;
    event: { title: string; startAt: string; endAt: string; venue: string; thumbnail: string };
    items: BookingItem[];
    couponCode: string | null;
    discount: number;
};

// The booking shown on the checkout steps: the real order from the API, with each line matched to the event's ticket for its zone / tier
export const buildBooking = (event: EventDetail, order: Order): Booking => {
    const tickets = event.zones.flatMap((z) => z.tickets);
    return {
        masterId: order.number,
        placedAt: order.createdAt,
        event: { title: event.title, startAt: event.startAt, endAt: event.endAt, venue: event.venue.name, thumbnail: event.banner },
        items: order.lines.map((line) => {
            const ticket = tickets.find((t) => t.id === line.productId);
            return { id: line.productId || line.id, name: line.name, zone: ticket?.zone ?? '', tier: ticket?.tier ?? 'standard', qty: line.quantity, unitPrice: line.price };
        }),
        couponCode: order.couponCode,
        discount: order.discount,
    };
};

// Ticket count and subtotal are always derived from the items
export const bookingTotals = (items: BookingItem[]) => ({
    count: items.reduce((n, i) => n + i.qty, 0),
    subtotal: items.reduce((sum, i) => sum + i.qty * i.unitPrice, 0),
});
