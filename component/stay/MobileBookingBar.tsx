import Link from 'next/link';
import { Phone } from 'lucide-react';
import type { Stay } from '@/lib/types';

type Props = { stay: Pick<Stay, 'hotline' | 'slug'>; className?: string };

const MobileBookingBar = ({ stay, className = '' }: Props) => (
    <div className={`fixed inset-x-0 bottom-0 z-30 flex gap-3 border-t border-[#E7E2F3] bg-white px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+12px)] lg:hidden ${className}`}>
        {stay.hotline && (
            <a
                href={`tel:${stay.hotline.replace(/[^\d+]/g, '')}`}
                aria-label='Call hotline'
                className='flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] border border-[#DCD4EE] bg-white text-[#5B21B6] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#EDE7FB]'
            >
                <Phone size={20} aria-hidden='true' />
            </a>
        )}
        <Link
            href={`/stays/${stay.slug}/rooms`}
            className='flex h-12 flex-1 items-center justify-center rounded-[14px] bg-[#5B21B6] font-semibold text-white hover:bg-[#4C1D95] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#DCD4EE]'
        >
            View room options
        </Link>
    </div>
);

export default MobileBookingBar;
