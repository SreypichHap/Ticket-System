// Cart / order calls against the BookMe+ (Spree storefront) API. Server-only: every call uses the server credentials,
// and the guest order token lives in an httpOnly cookie, so neither reaches client-side code.
import { cookies } from 'next/headers';
import { getAccessToken, included } from './api';

type Json = any; // eslint-disable-line @typescript-eslint/no-explicit-any

const CART_COOKIE = 'bookme_cart';
const CART_MAX_AGE_SECONDS = 2 * 60 * 60;

export class OrderApiError extends Error {
    status: number;
    // Set when the API refused one cart item (out of stock, over the limit)
    variantId?: string;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

export type OrderLine = { id: string; productId: string; name: string; quantity: number; price: number };
export type Order = {
    number: string;
    state: string;
    currency: string;
    createdAt: string;
    itemTotal: number;
    discount: number;
    total: number;
    couponCode: string | null;
    lines: OrderLine[];
};

type Cart = { number: string; token: string };

export const readCart = async (): Promise<Cart | null> => {
    const raw = (await cookies()).get(CART_COOKIE)?.value;
    if (!raw) return null;
    try {
        const cart = JSON.parse(raw);
        return cart?.number && cart?.token ? cart : null;
    } catch {
        return null;
    }
};

export const saveCart = async (cart: Cart) => {
    (await cookies()).set(CART_COOKIE, JSON.stringify(cart), {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: CART_MAX_AGE_SECONDS,
    });
};

export const clearCart = async () => {
    (await cookies()).delete(CART_COOKIE);
};

const request = async (method: string, path: string, orderToken?: string, body?: unknown): Promise<Json> => {
    const headers: Record<string, string> = { Authorization: `Bearer ${await getAccessToken()}`, 'Content-Type': 'application/json' };
    if (orderToken) headers['X-Spree-Order-Token'] = orderToken;
    const res = await fetch(`${process.env.API_URL}/api/v2/storefront/${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        cache: 'no-store',
        signal: AbortSignal.timeout(15000),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new OrderApiError(json?.error ?? `${path} failed (${res.status})`, res.status);
    return json;
};

const mapOrder = (json: Json): Order => {
    const a = json.data.attributes;
    const lookup = included(json);
    const lines: OrderLine[] = (json.data.relationships.line_items?.data ?? []).flatMap((ref: Json) => {
        const item = lookup.get(`line_item:${ref.id}`);
        if (!item) return [];
        return [{
            id: String(item.id),
            productId: String(item.relationships.product?.data?.id ?? ''),
            name: item.attributes.name as string,
            quantity: Number(item.attributes.quantity),
            price: Number(item.attributes.price),
        }];
    });
    const promotion = (json.data.relationships.promotions?.data ?? []).map((p: Json) => lookup.get(`promotion:${p.id}`)).find(Boolean);
    return {
        number: a.number,
        state: a.state,
        currency: a.currency ?? 'USD',
        createdAt: a.created_at,
        itemTotal: Number(a.item_total),
        discount: Math.abs(Number(a.promo_total)) || 0,
        total: Number(a.total),
        couponCode: promotion?.attributes?.code ?? null,
        lines,
    };
};

const ORDER_INCLUDE = 'line_items,promotions';

export const getOrder = async (): Promise<{ order: Order; token: string } | null> => {
    const cart = await readCart();
    if (!cart) return null;
    try {
        const json = await request('GET', `cart?include=${ORDER_INCLUDE}`, cart.token);
        return { order: mapOrder(json), token: cart.token };
    } catch {
        return null; // expired / already completed cart
    }
};

// A new cart holding the given variants. A refused item (out of stock, over the limit) throws with the API's message.
export const createCart = async (items: { variantId: string; quantity: number }[]): Promise<Order> => {
    const created = await request('POST', 'cart');
    const cart = { number: created.data.attributes.number as string, token: created.data.attributes.token as string };
    for (const { variantId, quantity } of items) {
        try {
            await request('POST', 'cart/add_item', cart.token, { variant_id: variantId, quantity });
        } catch (error) {
            if (error instanceof OrderApiError) error.variantId = variantId;
            throw error;
        }
    }
    await saveCart(cart);
    const json = await request('GET', `cart?include=${ORDER_INCLUDE}`, cart.token);
    return mapOrder(json);
};

export type Contact = { firstName: string; lastName: string; phone: string; email: string };

// Saves the buyer on the order and moves it forward until it is ready for payment
export const saveContact = async (token: string, contact: Contact): Promise<Order> => {
    let json = await request('PATCH', 'checkout', token, {
        order: { email: contact.email, bill_address_attributes: { firstname: contact.firstName, lastname: contact.lastName, phone: contact.phone } },
    });
    for (let i = 0; i < 3 && json.data.attributes.state !== 'payment'; i++) json = await request('PATCH', 'checkout/next', token);
    return (await refresh(token)) ?? mapOrder(json);
};

const refresh = async (token: string) => {
    try {
        return mapOrder(await request('GET', `cart?include=${ORDER_INCLUDE}`, token));
    } catch {
        return null;
    }
};

export const applyCoupon = async (token: string, code: string): Promise<Order> => {
    await request('PATCH', 'cart/apply_coupon_code', token, { coupon_code: code });
    return mapOrder(await request('GET', `cart?include=${ORDER_INCLUDE}`, token));
};

export const removeCoupon = async (token: string, code: string): Promise<Order> => {
    await request('DELETE', `cart/remove_coupon_code/${encodeURIComponent(code)}`, token);
    return mapOrder(await request('GET', `cart?include=${ORDER_INCLUDE}`, token));
};

export type ApiPaymentMethod = { id: string; name: string; description: string; option: string; icon: string };

export const getPaymentMethods = async (token: string): Promise<ApiPaymentMethod[]> => {
    const json = await request('GET', 'checkout/payment_methods', token);
    return (json.data as Json[]).map((m) => ({
        id: String(m.id),
        name: m.attributes.name,
        description: m.attributes.description ?? '',
        option: m.attributes.payment_option ?? '',
        icon: m.attributes.icon_name ?? '',
    }));
};

// Creates the payment for the chosen method and returns the gateway page the buyer completes it on
export const startPayment = async (token: string, paymentMethodId: string): Promise<string> => {
    const json = await request('POST', 'checkout/create_payment', token, { payment_method_id: paymentMethodId });
    const payments = await request('GET', 'cart?include=payments', token);
    const url = (payments.included ?? []).filter((i: Json) => i.type === 'payment').map((p: Json) => p.attributes.checkout_url).filter(Boolean).pop();
    if (!url) throw new OrderApiError(json?.error ?? 'The payment has no checkout page', 502);
    return url as string;
};
