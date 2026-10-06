'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Calendar } from 'lucide-react';
import type { StaySearch } from '@/lib/types';
import { formatRange, nightsBetween, summary, todayIso } from '@/lib/stay-search';
import DateRangePicker from './DateRangePicker';
import Stepper from './Stepper';

// maxRooms / maxGuests come from the stay's rooms in the API; undefined when it gives none
type Props = { search: StaySearch; maxRooms?: number; maxGuests?: number; className?: string };

// Shows the current search; the popover edits it and writes it to the URL, which re-renders the page with new totals.
const StaySearchButton = ({ search, maxRooms, maxGuests, className = '' }: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const ref = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState({ start: search.checkIn, end: search.checkOut as string | null, rooms: search.rooms, guests: search.guests });

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
        const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
        document.addEventListener('keydown', onKey);
        document.addEventListener('mousedown', onDown);
        return () => {
            document.removeEventListener('keydown', onKey);
            document.removeEventListener('mousedown', onDown);
        };
    }, [open]);

    const toggle = () => {
        if (!open) setDraft({ start: search.checkIn, end: search.checkOut, rooms: search.rooms, guests: search.guests });
        setOpen(!open);
    };
    const apply = () => {
        if (!draft.end) return;
        const params = new URLSearchParams({ checkIn: draft.start, checkOut: draft.end, rooms: String(draft.rooms), guests: String(draft.guests) });
        router.replace(`${pathname}?${params}`, { scroll: false });
        setOpen(false);
    };

    return (
        <div ref={ref} className={`relative ${className}`}>
            <button
                type='button'
                aria-expanded={open}
                aria-haspopup='dialog'
                onClick={toggle}
                className='flex min-h-[52px] items-center gap-3 rounded-2xl border border-[#DCD4EE] bg-white py-2 pl-4 pr-2.5 text-left hover:bg-[#FCFBFE] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#EDE7FB]'
            >
                <Calendar size={20} aria-hidden='true' className='shrink-0 text-[#5B21B6]' />
                <span>
                    <span className='block text-sm font-semibold text-[#1A1530]'>{formatRange(search.checkIn, search.checkOut)}</span>
                    <span className='block text-xs text-[#5E5775]'>{summary(search)}</span>
                </span>
                <span className='ml-1 rounded-full bg-[#EDE7FB] px-3 py-1 text-xs font-semibold text-[#5B21B6]'>Change</span>
            </button>

            {open && (
                <div role='dialog' aria-label='Change dates, rooms and guests' className='absolute right-0 top-full z-30 mt-2 flex w-[min(360px,calc(100vw-48px))] flex-col gap-4 rounded-3xl border border-[#E7E2F3] bg-white p-4 shadow-[0_16px_40px_rgba(26,21,48,.15)]'>
                    <DateRangePicker start={draft.start} end={draft.end} min={todayIso()} onPick={(start, end) => setDraft({ ...draft, start, end })} />
                    <Stepper label='Rooms' value={draft.rooms} max={maxRooms} onChange={(rooms) => setDraft({ ...draft, rooms })} />
                    <Stepper label='Guests' value={draft.guests} max={maxGuests && maxGuests * draft.rooms} onChange={(guests) => setDraft({ ...draft, guests })} />
                    <button
                        type='button'
                        disabled={!draft.end}
                        onClick={apply}
                        className='h-12 rounded-[14px] bg-[#5B21B6] text-sm font-semibold text-white hover:bg-[#4C1D95] disabled:bg-[#B8B2C9] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#DCD4EE]'
                    >
                        {draft.end ? `Apply · ${nightsBetween(draft.start, draft.end)} ${nightsBetween(draft.start, draft.end) === 1 ? 'night' : 'nights'}` : 'Pick a check-out date'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default StaySearchButton;
