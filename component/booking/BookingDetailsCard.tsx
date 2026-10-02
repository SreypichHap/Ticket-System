'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { formatPlacedAt } from '@/lib/format';
import { CARD, CARD_TITLE, FOCUS_RING, MUTED, TILE } from './styles';

type Props = { masterId: string; placedAt: string; className?: string };

const BookingDetailsCard = ({ masterId, placedAt, className = '' }: Props) => {
    const [copied, setCopied] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => () => clearTimeout(timer.current), []);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(masterId);
        } catch {
            return; // Clipboard can be blocked; the ID stays selectable on screen
        }
        setCopied(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), 1500);
    };

    return (
        <section data-animate='booking-details-card' aria-labelledby='booking-details-title' className={`${CARD} ${className}`}>
            <h2 id='booking-details-title' className={`${CARD_TITLE} mb-4`}>
                Booking details
            </h2>
            <div className='grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3'>
                <div className={`${TILE} flex flex-wrap items-center justify-between gap-3`}>
                    <div className='min-w-0'>
                        <p className={`text-xs ${MUTED}`}>Master ID</p>
                        <p className='break-all font-bold tabular-nums tracking-[0.04em]'>{masterId}</p>
                    </div>
                    <button
                        type='button'
                        onClick={copy}
                        aria-live='polite'
                        className={`inline-flex h-11 items-center gap-2 rounded-full border border-[#CFC7E3] dark:border-[#3F394F] bg-white dark:bg-[#14111F] px-4 text-sm font-semibold text-[#5B21B6] dark:text-[#BB9BED] hover:bg-[#EDE7FB] dark:hover:bg-[#191328] ${FOCUS_RING}`}
                    >
                        {copied ? <Check size={16} aria-hidden='true' /> : <Copy size={16} aria-hidden='true' />}
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                </div>
                <div className={TILE}>
                    <p className={`text-xs ${MUTED}`}>Placed on</p>
                    <p className='font-bold'>{formatPlacedAt(placedAt)}</p>
                </div>
            </div>
        </section>
    );
};

export default BookingDetailsCard;
