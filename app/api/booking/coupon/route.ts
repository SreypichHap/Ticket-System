import { z } from 'zod';
import { applyCoupon, getOrder, OrderApiError, removeCoupon } from '@/lib/orders';

const summary = (order: Awaited<ReturnType<typeof applyCoupon>>) => ({ code: order.couponCode, discount: order.discount, total: order.total });

export const POST = async (request: Request) => {
    const parsed = z.object({ code: z.string().trim().min(1) }).safeParse(await request.json().catch(() => null));
    if (!parsed.success) return Response.json({ error: 'invalid_request' }, { status: 400 });
    const current = await getOrder();
    if (!current) return Response.json({ error: 'no_order' }, { status: 404 });

    try {
        return Response.json(summary(await applyCoupon(current.token, parsed.data.code)));
    } catch (error) {
        // 422 = the API does not accept this code
        if (error instanceof OrderApiError && error.status === 422) return Response.json({ error: 'invalid_coupon' }, { status: 422 });
        console.error('[booking] coupon failed:', (error as Error).message);
        return Response.json({ error: 'failed' }, { status: 502 });
    }
};

export const DELETE = async () => {
    const current = await getOrder();
    if (!current) return Response.json({ error: 'no_order' }, { status: 404 });
    if (!current.order.couponCode) return Response.json(summary(current.order));

    try {
        return Response.json(summary(await removeCoupon(current.token, current.order.couponCode)));
    } catch (error) {
        console.error('[booking] remove coupon failed:', (error as Error).message);
        return Response.json({ error: 'failed' }, { status: 502 });
    }
};
