import type { ApiPaymentMethod } from '@/lib/orders';

export type PaymentMethod = {
    id: string;
    provider: string;
    name: string;
    description: string;
    logo: string;
    available: boolean;
};

// Logo files we ship for the gateways we know; any other method falls back to the generic one
const LOGOS: [RegExp, string][] = [
    [/aba|payway/i, '/images/payment/aba.svg'],
    [/vattanac/i, '/images/payment/vattanac.svg'],
    [/acleda/i, '/images/payment/acleda.svg'],
    [/true/i, '/images/payment/truemoney.svg'],
];
const FALLBACK_LOGO = '/images/payment/other.svg';

// The payment methods come from the API (the order's checkout step). Each method is its own group.
export const toPaymentMethod = (m: ApiPaymentMethod): PaymentMethod => ({
    id: m.id,
    provider: m.name,
    name: m.name,
    description: m.description,
    logo: LOGOS.find(([pattern]) => pattern.test(`${m.option} ${m.icon} ${m.name}`))?.[1] ?? FALLBACK_LOGO,
    available: true,
});
