'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { useSearchState } from '@/hooks/useSearchState';
import { toQuery } from '@/lib/stay-search';
import type { StaySearch } from '@/lib/types';
import DateRangeSheet from '../sheets/DateRangeSheet';
import GuestsSheet from '../sheets/GuestsSheet';
import DatesCard from './DatesCard';
import GuestsCard from './GuestsCard';
import SearchBottomBar from './SearchBottomBar';

// maxRooms / maxGuestsPerRoom come from the stay's rooms in the API; undefined when it gives none
type Props = { search: StaySearch; maxRooms?: number; maxGuestsPerRoom?: number };
type Sheet = 'start' | 'end' | 'guests' | null;

// The search screen replaces the room list on the same route (?change=1). Apply and close both go back to the plain route.
const SearchScreen = ({ search, maxRooms, maxGuestsPerRoom }: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const { state, setDates, setGuests, reset, toSearch } = useSearchState(search);
    const [sheet, setSheet] = useState<Sheet>(null);

    const leave = (next: StaySearch) => router.replace(`${pathname}?${toQuery(next)}`);
    const apply = () => {
        const next = toSearch();
        if (next) leave(next);
    };

    return (
        <>
            <header className='mb-[22px] flex items-start justify-between gap-4'>
                <div>
                    <h1 className='text-2xl font-semibold leading-tight text-search-text md:text-[32px]'>Plan your stay</h1>
                    <p className='text-sm text-search-muted'>Pick your dates and who&apos;s coming.</p>
                </div>
                <div className='flex items-center gap-1'>
                    <button type='button' onClick={reset} className='min-h-11 px-3 text-sm font-semibold text-search-accent-text hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-search-soft'>
                        Reset
                    </button>
                    <button type='button' aria-label='Close' onClick={() => leave(search)} className='flex h-11 w-11 items-center justify-center rounded-full text-search-text hover:bg-search-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-search-soft'>
                        <X size={22} aria-hidden='true' />
                    </button>
                </div>
            </header>

            <div className='grid items-start gap-4 pb-8 md:grid-cols-2'>
                <DatesCard start={state.start} end={state.end} active={sheet === 'start' || sheet === 'end' ? sheet : null} onOpen={setSheet} onQuick={({ start, end }) => setDates(start!, end)} />
                <GuestsCard rooms={state.rooms} adults={state.adults} childCount={state.children} onOpen={() => setSheet('guests')} />
            </div>

            <SearchBottomBar start={state.start} end={state.end} guests={state.adults + state.children} onApply={apply} />

            <DateRangeSheet
                open={sheet === 'start' || sheet === 'end'}
                start={state.start}
                end={state.end}
                onApply={(start, end) => {
                    setDates(start, end);
                    setSheet(null);
                }}
                onClose={() => setSheet(null)}
            />
            <GuestsSheet
                open={sheet === 'guests'}
                value={state}
                maxRooms={maxRooms}
                maxGuestsPerRoom={maxGuestsPerRoom}
                onApply={(guests) => {
                    setGuests(guests);
                    setSheet(null);
                }}
                onClose={() => setSheet(null)}
            />
        </>
    );
};

export default SearchScreen;
