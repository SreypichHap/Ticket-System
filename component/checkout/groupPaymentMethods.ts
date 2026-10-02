import type { PaymentMethod } from './paymentMethods';

export type PaymentGroup = { provider: string; methods: PaymentMethod[] };

const OTHER = 'Other';

// Groups methods by provider in first-seen order. Every "Other" method is merged into one group placed last.
export const groupPaymentMethods = (methods: PaymentMethod[]): PaymentGroup[] => {
    const groups: PaymentGroup[] = [];

    for (const method of methods) {
        const group = groups.find((g) => g.provider === method.provider);
        if (group) group.methods.push(method);
        else groups.push({ provider: method.provider, methods: [method] });
    }

    return [...groups.filter((g) => g.provider !== OTHER), ...groups.filter((g) => g.provider === OTHER)];
};
