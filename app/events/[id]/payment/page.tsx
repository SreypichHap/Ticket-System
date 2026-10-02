import { notFound, redirect } from 'next/navigation';
import Payment from '../../../../page/payment';
import { getEventBySlug } from '@/lib/events';
import { getOrder, getPaymentMethods } from '@/lib/orders';
import { toPaymentMethod } from '@/component/checkout/paymentMethods';

type Props = { params: Promise<{ id: string }> };

const Page = async ({ params }: Props) => {
    const { id } = await params;
    const event = await getEventBySlug(id);
    if (!event) notFound();

    // No open order: start over from the tickets
    const current = await getOrder();
    if (!current || current.order.lines.length === 0) redirect(`/events/${id}/tickets`);
    const { order, token } = current;

    // Paid (the gateway sends the buyer back here): no methods needed, just the confirmation
    const paid = order.state === 'complete';
    // Contact details not saved yet: go back to the booking info step
    if (!paid && order.state !== 'payment') redirect(`/events/${id}/checkout`);

    const methods = paid ? [] : (await getPaymentMethods(token)).map(toPaymentMethod);
    const count = order.lines.reduce((n, line) => n + line.quantity, 0);

    return <Payment eventId={id} bookingId={order.number} placedAt={Date.parse(order.createdAt)} count={count} total={order.total} methods={methods} paid={paid} />;
};

export default Page;
