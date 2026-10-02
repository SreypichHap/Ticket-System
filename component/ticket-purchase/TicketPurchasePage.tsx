'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBooking, SoldOutError } from '../booking/bookingApi';
import { labels } from '../booking/labels';
import { DEFAULT_MAX_PER_TICKET } from '../booking/order';
import EventBanner from '../event/EventBanner';
import EventDetails from '../event/EventDetails';
import OrderSummary from './OrderSummary';
import TicketCard from './TicketCard';
import TicketTabs, { type TabId } from './TicketTabs';
import { formatEventDay, formatEventTimeRange } from '@/lib/format';
import type { EventDetail } from '@/lib/types';
import type { Quantities } from './types';

type Props = { event: EventDetail };

const TicketPurchasePage = ({ event }: Props) => {
    const router = useRouter();
    const [tab, setTab] = useState<TabId>('tickets');
    const tickets = useMemo(() => event.zones.flatMap((z) => z.tickets), [event.zones]);
    const [placing, setPlacing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [quantities, setQuantities] = useState<Quantities>({});

    const { lines, subtotal, totalQuantity } = useMemo(() => {
        const lines = tickets.flatMap((ticket) => {
            const quantity = quantities[ticket.id] ?? 0;
            return quantity > 0 ? [{ ticket, quantity }] : [];
        });
        return {
            lines,
            subtotal: lines.reduce((s, l) => s + l.ticket.price * l.quantity, 0),
            totalQuantity: lines.reduce((s, l) => s + l.quantity, 0),
        };
    }, [quantities, tickets]);

    const maxFor = (ticket: { maxPerOrder: number | null }) => ticket.maxPerOrder ?? DEFAULT_MAX_PER_TICKET;
    const setQuantity = (id: string, quantity: number) => {
        const ticket = tickets.find((t) => t.id === id);
        setQuantities((prev) => ({ ...prev, [id]: Math.max(0, Math.min(ticket ? maxFor(ticket) : DEFAULT_MAX_PER_TICKET, quantity)) }));
    };

    // Places the booking in the background (no intermediate page), then goes straight to the booking info page
    const checkout = async () => {
        if (placing || lines.length === 0) return;
        setPlacing(true);
        setError(null);
        try {
            await createBooking(event.slug, quantities);
            router.push(`/events/${event.slug}/checkout`);
        } catch (e) {
            setError(e instanceof SoldOutError ? labels.booking.soldOut(e.ticketTitle) : labels.booking.genericError);
            setPlacing(false);
        }
    };

    return (
        <div className={`bg-[var(--ticket-page-bg)] min-h-screen text-[#1A1530] dark:text-[#E7E5F3]`}>
            <div className='mx-auto flex max-w-[1200px] flex-col gap-6 px-4 pb-6 pt-0 sm:px-6'>
                <EventBanner cover={event.banner} avatar={event.organizer.logo} title={event.title} subtitle={event.subtitle} />
                <TicketTabs active={tab} onChange={setTab} ticketCount={tickets.length} />

                {tab === 'tickets' && (
                    <div id='panel-tickets' role='tabpanel' aria-labelledby='tab-tickets' className='flex flex-col gap-6 lg:flex-row lg:items-start'>
                        <ul aria-label='Tickets' className='flex min-w-0 flex-1 flex-col gap-4'>
                            {tickets.map((t) => (
                                <li key={t.id}>
                                    <TicketCard ticket={t} imageSrc={t.image} quantity={quantities[t.id] ?? 0} max={maxFor(t)} onQuantityChange={setQuantity} />
                                </li>
                            ))}
                        </ul>
                        <OrderSummary className='w-full lg:sticky lg:top-6 lg:w-[340px] lg:shrink-0' lines={lines} total={subtotal} totalQuantity={totalQuantity} loading={placing} error={error} onCheckout={checkout} />
                    </div>
                )}
                {tab === 'details' && (
                    <div id='panel-details' role='tabpanel' aria-labelledby='tab-details'>
                        <EventDetails description={event.descriptionHtml} format='html' date={formatEventDay(event.startAt)} time={formatEventTimeRange(event.startAt, event.endAt)} location={event.venue.address} mapUrl={event.venue.mapUrl} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default TicketPurchasePage;
