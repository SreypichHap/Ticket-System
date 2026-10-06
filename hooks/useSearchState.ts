'use client';

import { useState } from 'react';
import { parseSearch } from '@/lib/stay-search';
import type { StaySearch } from '@/lib/types';

export type Guests = { rooms: number; adults: number; children: number; childAges: (number | null)[] };
export type SearchState = Guests & { start: string; end: string | null };

const fromSearch = (s: StaySearch): SearchState => ({ start: s.checkIn, end: s.checkOut, rooms: s.rooms, adults: s.guests - s.children, children: s.children, childAges: s.childAges });

// The dates and guests being edited. Sheets work on a draft and only call setDates / setGuests when applied.
export const useSearchState = (initial: StaySearch) => {
    const [state, setState] = useState(() => fromSearch(initial));

    const setDates = (start: string, end: string | null) => setState((s) => ({ ...s, start, end }));
    const setGuests = (guests: Guests) => setState((s) => ({ ...s, ...guests }));
    const reset = () => setState(fromSearch(parseSearch({})));

    // The search to apply; null until a check-out is chosen
    const toSearch = (): StaySearch | null =>
        state.end ? { checkIn: state.start, checkOut: state.end, rooms: state.rooms, guests: state.adults + state.children, children: state.children, childAges: state.childAges } : null;

    return { state, setDates, setGuests, reset, toSearch };
};
