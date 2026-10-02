import type { ContactValues } from './contactSchema';

// Browser-side calls to our own /api/booking routes, which talk to the BookMe+ API with the server credentials.
export class SoldOutError extends Error {
    ticketTitle: string;

    constructor(ticketTitle: string) {
        super(`${ticketTitle} is sold out`);
        this.ticketTitle = ticketTitle;
    }
}

const post = async (path: string, body: unknown, method = 'POST') => {
    const res = await fetch(path, { method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
    const json = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, json };
};

// Creates the order for the chosen tickets; resolves with the order number
export const createBooking = async (slug: string, quantities: Record<string, number>) => {
    const items = Object.entries(quantities).filter(([, quantity]) => quantity > 0).map(([ticketId, quantity]) => ({ ticketId, quantity }));
    const { ok, json } = await post('/api/booking', { slug, items });
    if (json.error === 'unavailable') throw new SoldOutError(json.ticket ?? '');
    if (!ok) throw new Error('Could not create the booking');
    return { bookingId: json.number as string };
};

export const saveContactDetails = async (contact: ContactValues) => {
    const { ok } = await post('/api/booking/contact', contact);
    if (!ok) throw new Error('Could not save the contact details');
};

export type CouponResult = { code: string | null; discount: number; total: number };

// null when the API does not accept the code
export const applyCoupon = async (code: string): Promise<CouponResult | null> => {
    const { ok, status, json } = await post('/api/booking/coupon', { code });
    if (status === 422) return null;
    if (!ok) throw new Error('Could not apply the coupon');
    return json;
};

export const removeCoupon = async (): Promise<CouponResult> => {
    const { ok, json } = await post('/api/booking/coupon', undefined, 'DELETE');
    if (!ok) throw new Error('Could not remove the coupon');
    return json;
};

// Creates the payment and resolves with the gateway page to send the buyer to
export const startPayment = async (paymentMethodId: string) => {
    const { ok, json } = await post('/api/booking/pay', { paymentMethodId });
    if (!ok || !json.checkoutUrl) throw new Error('Could not start the payment');
    return json.checkoutUrl as string;
};
