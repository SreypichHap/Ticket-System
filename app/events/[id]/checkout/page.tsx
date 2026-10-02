import { notFound, redirect } from 'next/navigation';
import BookingInfo from '../../../../page/bookinginfo';
import { getEventBySlug } from '@/lib/events';
import { getOrder } from '@/lib/orders';
import { buildBooking } from '@/lib/booking';

type Props = { params: Promise<{ id: string }> };

const Page = async ({ params }: Props) => {
    const { id } = await params;
    const event = await getEventBySlug(id);
    if (!event) notFound();

    // No open order (cookie missing or expired): start over from the tickets
    const current = await getOrder();
    if (!current || current.order.lines.length === 0 || current.order.state === 'complete') redirect(`/events/${id}/tickets`);

    return <BookingInfo eventId={id} booking={buildBooking(event, current.order)} />;
};

export default Page;
