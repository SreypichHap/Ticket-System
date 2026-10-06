import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { StaySearch } from '@/lib/types';
import { plural } from '@/lib/stay-search';
import StaySearchButton from './StaySearchButton';
import { HEADING } from '../stay/fonts';

type Props = { stayName: string; stayHref: string; roomCount: number; search: StaySearch; maxRooms?: number; maxGuests?: number; className?: string };

const RoomsPageHeader = ({ stayName, stayHref, roomCount, search, maxRooms, maxGuests, className = '' }: Props) => (
    <header className={`mb-[22px] flex flex-wrap items-end justify-between gap-4 ${className}`}>
        <div className='flex items-center gap-4'>
            <Link
                href={stayHref}
                aria-label={`Back to ${stayName}`}
                className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#E7E2F3] bg-white text-[#1A1530] hover:bg-[#EDE7FB] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#EDE7FB]'
            >
                <ArrowLeft size={20} aria-hidden='true' />
            </Link>
            <div>
                <h1 className={`${HEADING} text-2xl leading-tight md:text-[32px] text-[#1A1530]`}>Select room</h1>
                <p className='text-sm text-[#5E5775]'>
                    {stayName} · {plural(roomCount, 'room')}
                </p>
            </div>
        </div>
        <StaySearchButton search={search} maxRooms={maxRooms} maxGuests={maxGuests} />
    </header>
);

export default RoomsPageHeader;
