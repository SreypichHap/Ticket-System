'use client';

import { useId, useState } from 'react';
import { Calendar, ChevronDown, MapPin } from 'lucide-react';
import { formatEventDateShort } from '@/lib/format';
import type { Booking } from '@/lib/booking';
import TicketStubLine from './TicketStubLine';
import { CARD, MUTED, ROUND_BTN } from './styles';

type Props = { event: Booking['event']; items: Booking['items']; className?: string };

const OrderSummaryCard = ({ event, items, className = '' }: Props) => {
    const [open, setOpen] = useState(true);
    const bodyId = useId();

    return (
        <section data-animate='order-summary-card' data-state={open ? 'open' : 'closed'} aria-label='Your order' className={`${CARD} ${className}`}>
            <div className='flex items-start gap-4'>
                <div className='min-w-0 flex-1'>
                    <p className='text-xs font-bold uppercase tracking-[0.12em] text-[#5B21B6] dark:text-[#BB9BED]'>Your order</p>
                    <h2 className='text-xl font-extrabold leading-tight'>{event.title}</h2>
                    <div className={`mt-2 flex flex-col gap-1 text-sm ${MUTED}`}>
                        <p className='flex items-start gap-2'>
                            <Calendar size={16} className='mt-0.5 shrink-0' aria-hidden='true' />
                            <span>{formatEventDateShort(event.startAt, event.endAt)}</span>
                        </p>
                        <p className='flex items-start gap-2'>
                            <MapPin size={16} className='mt-0.5 shrink-0' aria-hidden='true' />
                            <span>{event.venue}</span>
                        </p>
                    </div>
                </div>
                <button
                    type='button'
                    aria-expanded={open}
                    aria-controls={bodyId}
                    aria-label={open ? 'Hide order details' : 'Show order details'}
                    onClick={() => setOpen((o) => !o)}
                    className={ROUND_BTN}
                >
                    <ChevronDown size={20} aria-hidden='true' className={open ? 'rotate-180' : ''} />
                </button>
            </div>
            {open && (
                <div id={bodyId} className='mt-5 flex flex-col gap-3'>
                    {items.map((item) => (
                        <TicketStubLine key={item.id} item={item} />
                    ))}
                </div>
            )}
        </section>
    );
};

export default OrderSummaryCard;
