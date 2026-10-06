'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatWithWeekday, monthLabel, monthOf, pickDate, sameMonth, shiftMonth, type Range } from '@/lib/date';
import { nightsBetween, plural, todayIso } from '@/lib/stay-search';
import BottomSheet from '../ui/BottomSheet';
import CalendarMonth from '../ui/CalendarMonth';

type Props = { open: boolean; start: string; end: string | null; onApply: (start: string, end: string) => void; onClose: () => void };

// The body mounts only while the sheet is open, so every opening starts from the committed dates (closing discards the draft)
const DateRangeBody = ({ start, end, onApply }: Pick<Props, 'start' | 'end' | 'onApply'>) => {
    const today = todayIso();
    const [range, setRange] = useState<Range>({ start, end });
    const [month, setMonth] = useState(monthOf(start));
    const ready = range.start && range.end;

    return (
        <div className='px-5 pb-5 pt-4'>
            <div className='grid grid-cols-2 gap-3'>
                {[
                    { label: 'Check-in', value: range.start, next: !range.start },
                    { label: 'Check-out', value: range.end, next: !!range.start && !range.end },
                ].map(({ label, value, next }) => (
                    <div key={label} className={`rounded-[14px] border px-3.5 py-2.5 ${next ? 'border-[1.5px] border-search-accent bg-search-tint' : 'border-search-border bg-white'}`}>
                        <p className='text-xs text-search-muted'>{label}</p>
                        <p className={`text-sm font-semibold ${value ? 'text-search-text' : 'text-search-disabled'}`}>{value ? formatWithWeekday(value) : 'Add date'}</p>
                    </div>
                ))}
            </div>

            <div className='mb-1 mt-4 flex items-center justify-between'>
                <button
                    type='button'
                    aria-label='Previous month'
                    disabled={sameMonth(month, monthOf(today))}
                    onClick={() => setMonth(shiftMonth(month, -1))}
                    className='flex h-11 w-11 items-center justify-center rounded-full text-search-text hover:bg-search-soft disabled:text-search-disabled disabled:hover:bg-transparent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-search-soft'
                >
                    <ChevronLeft size={20} aria-hidden='true' />
                </button>
                <p aria-live='polite' className='text-base font-semibold text-search-text'>
                    {monthLabel(month)}
                </p>
                <button
                    type='button'
                    aria-label='Next month'
                    onClick={() => setMonth(shiftMonth(month, 1))}
                    className='flex h-11 w-11 items-center justify-center rounded-full text-search-text hover:bg-search-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-search-soft'
                >
                    <ChevronRight size={20} aria-hidden='true' />
                </button>
            </div>

            <CalendarMonth month={month} range={range} today={today} onPick={(iso) => setRange(pickDate(range, iso))} />

            <div className='mt-4 flex items-center gap-4'>
                <button type='button' onClick={() => setRange({ start: null, end: null })} className='min-h-11 px-2 text-sm font-semibold text-search-accent-text hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-search-soft'>
                    Clear
                </button>
                <button
                    type='button'
                    disabled={!ready}
                    onClick={() => ready && onApply(range.start!, range.end!)}
                    className='h-[52px] flex-1 rounded-2xl bg-search-accent text-base font-semibold text-white hover:bg-search-accent-text disabled:bg-search-border disabled:text-search-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-search-soft'
                >
                    {ready ? `Apply · ${plural(nightsBetween(range.start!, range.end!), 'night')}` : 'Select check-out'}
                </button>
            </div>
        </div>
    );
};

const DateRangeSheet = ({ open, start, end, onApply, onClose }: Props) => (
    <BottomSheet open={open} title='Select dates' onClose={onClose} showClose>
        <DateRangeBody start={start} end={end} onApply={onApply} />
    </BottomSheet>
);

export default DateRangeSheet;
