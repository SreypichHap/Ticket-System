import { z } from 'zod';
import { getOrder, startPayment } from '@/lib/orders';

// Creates the payment for the chosen method and returns the gateway page to send the buyer to
export const POST = async (request: Request) => {
    const parsed = z.object({ paymentMethodId: z.string().min(1) }).safeParse(await request.json().catch(() => null));
    if (!parsed.success) return Response.json({ error: 'invalid_request' }, { status: 400 });
    const current = await getOrder();
    if (!current) return Response.json({ error: 'no_order' }, { status: 404 });

    try {
        return Response.json({ checkoutUrl: await startPayment(current.token, parsed.data.paymentMethodId) });
    } catch (error) {
        console.error('[booking] payment failed:', (error as Error).message);
        return Response.json({ error: 'failed' }, { status: 502 });
    }
};
