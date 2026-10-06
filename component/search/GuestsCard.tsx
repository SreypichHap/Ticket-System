import { BedDouble, ChevronRight } from 'lucide-react';
import { plural } from '@/lib/stay-search';
import { childrenLabel } from '../sheets/GuestsSheet';

type Props = { rooms: number; adults: number; childCount: number; onOpen: () => void; className?: string };

const GuestsCard = ({ rooms, adults, childCount, onOpen, className = '' }: Props) => (
    <button
        type='button'
        onClick={onOpen}
        className={`flex w-full items-center gap-3.5 rounded-[20px] border border-search-border bg-white p-4 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-search-soft ${className}`}
    >
        <span className='flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-search-soft'>
            <BedDouble size={22} aria-hidden='true' className='text-search-accent' />
        </span>
        <span className='min-w-0 flex-1'>
            <span className='block text-xs text-search-muted'>Rooms &amp; guests</span>
            <span className='block text-base font-semibold text-search-text'>
                {plural(rooms, 'room')} · {plural(adults, 'adult')}
            </span>
            <span className='block text-xs text-search-muted'>{childCount === 0 ? 'No children' : childrenLabel(childCount)}</span>
        </span>
        <ChevronRight size={20} aria-hidden='true' className='shrink-0 text-search-muted' />
    </button>
);

export default GuestsCard;
