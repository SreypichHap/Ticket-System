'use client';

import { useCallback, useMemo, useState } from 'react';
import type { Ticket } from './tickets';

// Holds the chosen quantity per ticket id. `total` is the order price across all tickets.
export const useTicketQuantities = (tickets: Ticket[]) => {
    const [quantities, setQuantities] = useState<Record<string, number>>({});

    const setQuantity = useCallback((id: string, quantity: number) => {
        setQuantities((prev) => ({ ...prev, [id]: quantity }));
    }, []);

    const total = useMemo(
        () => tickets.reduce((sum, t) => sum + t.price * (quantities[t.id] ?? 0), 0),
        [tickets, quantities],
    );

    return { quantities, setQuantity, total };
};
