import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import type { Stay } from '@/lib/types';

type Props = { stay: Pick<Stay, 'hotline' | 'slug'>; className?: string };

const BookingActions = ({ stay, className = '' }: Props) => (
    <div className={`flex flex-col gap-3 overflow-hidden rounded-[28px] border border-[#E7E2F3] bg-white px-6 pb-6 pt-5 shadow-[0_16px_40px_rgba(26,21,48,.10)] ${className}`}>
        <Link
            href={`/stays/${stay.slug}/rooms`}
            className='flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#5B21B6] text-base font-semibold text-white hover:bg-[#4C1D95] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#DCD4EE]'
        >
            View room options
            <ArrowRight size={20} aria-hidden='true' />
        </Link>
        {stay.hotline && (
            <a
                href={`tel:${stay.hotline.replace(/[^\d+]/g, '')}`}
                className='flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-[#DCD4EE] bg-white text-sm font-semibold text-[#1A1530] hover:bg-[#F6F4FB] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#EDE7FB]'
            >
                <Phone size={18} aria-hidden='true' className='text-[#5B21B6]' />
                Call {stay.hotline}
            </a>
        )}
    </div>
);

export default BookingActions;
