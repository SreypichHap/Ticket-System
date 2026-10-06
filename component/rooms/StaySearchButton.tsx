import Link from 'next/link';
import { Calendar } from 'lucide-react';
import type { StaySearch } from '@/lib/types';
import { formatRange, summary, toQuery } from '@/lib/stay-search';

type Props = { search: StaySearch; className?: string };

// Shows the current search; "Change" opens the search screen on the same route (?change=1).
const StaySearchButton = ({ search, className = '' }: Props) => (
    <Link
        href={`?${toQuery(search)}&change=1`}
        className={`flex min-h-[52px] items-center gap-3 rounded-2xl border border-[#DCD4EE] bg-white py-2 pl-4 pr-2.5 text-left hover:bg-[#FCFBFE] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#EDE7FB] ${className}`}
    >
        <Calendar size={20} aria-hidden='true' className='shrink-0 text-[#5B21B6]' />
        <span>
            <span className='block text-sm font-semibold text-[#1A1530]'>{formatRange(search.checkIn, search.checkOut)}</span>
            <span className='block text-xs text-[#5E5775]'>{summary(search)}</span>
        </span>
        <span className='ml-1 rounded-full bg-[#EDE7FB] px-3 py-1 text-xs font-semibold text-[#5B21B6]'>Change</span>
    </Link>
);

export default StaySearchButton;
