import { z } from 'zod';
import { createCart, OrderApiError } from '@/lib/orders';
import { getEventBySlug } from '@/lib/events';
import { DEFAULT_MAX_PER_TICKET } from '@/component/booking/order';

const bodySchema = z.object({
    slug: z.string().min(1),
    items: z.array(z.object({ ticketId: z.string().min(1), quantity: z.number().int().min(1) })).min(1),
});

// Creates the cart for the chosen tickets. The browser only sends ticket ids; variants and limits come from the API.
export const POST = async (request: Request) => {
    const parsed = bodySchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return Response.json({ error: 'invalid_request' }, { status: 400 });

    const event = await getEventBySlug(parsed.data.slug);
    if (!event) return Response.json({ error: 'not_found' }, { status: 404 });
    const tickets = event.zones.flatMap((z) => z.tickets);

    const items = [];
    for (const { ticketId, quantity } of parsed.data.items) {
        const ticket = tickets.find((t) => t.id === ticketId);
        if (!ticket) return Response.json({ error: 'invalid_request' }, { status: 400 });
        if (ticket.soldOut || quantity > (ticket.maxPerOrder ?? DEFAULT_MAX_PER_TICKET)) return Response.json({ error: 'unavailable', ticket: ticket.name }, { status: 409 });
        items.push({ variantId: ticket.variantId, quantity });
    }

    try {
        const order = await createCart(items);
        return Response.json({ number: order.number });
    } catch (error) {
        if (error instanceof OrderApiError && error.variantId) {
            const refused = tickets.find((t) => t.variantId === error.variantId);
            return Response.json({ error: 'unavailable', ticket: refused?.name ?? '' }, { status: 409 });
        }
        console.error('[booking] cart failed:', (error as Error).message);
        return Response.json({ error: 'failed' }, { status: 502 });
    }
};
