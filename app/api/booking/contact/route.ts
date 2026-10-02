import { contactSchema } from '@/component/booking/contactSchema';
import { getOrder, saveContact } from '@/lib/orders';

// Saves the buyer's contact details on the order and moves it to the payment step
export const POST = async (request: Request) => {
    const parsed = contactSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return Response.json({ error: 'invalid_request' }, { status: 400 });

    const current = await getOrder();
    if (!current) return Response.json({ error: 'no_order' }, { status: 404 });

    try {
        const order = await saveContact(current.token, parsed.data);
        return Response.json({ number: order.number, state: order.state });
    } catch (error) {
        console.error('[booking] contact failed:', (error as Error).message);
        return Response.json({ error: 'failed' }, { status: 502 });
    }
};
