'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import SectionCard from './SectionCard';
import { labels } from '../booking/labels';

type Props = { masterId: string; placedAt: number };

// "30 Sep 2026, 5:13 PM": day-first order isn't a locale option that also gives "Sep" and "PM", so the parts are assembled by hand
const formatPlaced = (timestamp: number) => {
    const parts = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }).formatToParts(timestamp);
    const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
    return `${get('day')} ${get('month')} ${get('year')}, ${get('hour')}:${get('minute')} ${get('dayPeriod').toUpperCase()}`;
};

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className='flex items-center justify-between gap-4 text-sm'>
        <dt className='text-gray-500'>{label}</dt>
        <dd className='flex items-center gap-2 text-gray-900'>{children}</dd>
    </div>
);

const BookingDetailsCard = ({ masterId, placedAt }: Props) => {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(masterId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Clipboard can be blocked (insecure origin, permissions); the id stays selectable on screen
        }
    };

    return (
        <SectionCard title={labels.checkout.bookingDetails}>
            <dl className='flex flex-col gap-2'>
                <Row label={labels.checkout.masterId}>
                    <span>{masterId}</span>
                    <button
                        type='button'
                        onClick={copy}
                        aria-label={labels.checkout.copy}
                        className='flex h-7 w-7 items-center justify-center rounded-full text-violet-600 hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400'
                    >
                        {copied ? <Check size={16} aria-hidden='true' /> : <Copy size={16} aria-hidden='true' />}
                    </button>
                    <span aria-live='polite' className='sr-only'>
                        {copied ? labels.checkout.copied : ''}
                    </span>
                </Row>
                <Row label={labels.checkout.placedDate}>
                    {/* Locale/timezone can differ between server and browser, so let the browser value win */}
                    <span suppressHydrationWarning>{formatPlaced(placedAt)}</span>
                </Row>
            </dl>
        </SectionCard>
    );
};

export default BookingDetailsCard;
