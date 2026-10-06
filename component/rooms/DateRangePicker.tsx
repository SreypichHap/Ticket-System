'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
    start: string;
    end: string | null;
    min: string;
    onPick: (start: string, end: string | null) => void;
    className?: string;
};

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const monthLabel = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
const dayLabel = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeZone: 'UTC' });

const iso = (y: number, m: number, d: number) => new Date(Date.UTC(y, m, d)).toISOString().slice(0, 10);

// One month grid. First click sets the check-in, the second (a later day) sets the check-out.
const DateRangePicker = ({ start, end, min, onPick, className = '' }: Props) => {
    const [year, setYear] = useState(Number(start.slice(0, 4)));
    const [month, setMonth] = useState(Number(start.slice(5, 7)) - 1);

    const shift = (delta: number) => {
        const d = new Date(Date.UTC(year, month + delta, 1));
        setYear(d.getUTCFullYear());
        setMonth(d.getUTCMonth());
    };
    const offset = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7; // Monday first
    const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const cells = [...Array(offset).fill(null), ...Array.from({ length: days }, (_, i) => iso(year, month, i + 1))];

    const pick = (day: string) => {
        if (!end || day <= start) onPick(day, null);
        else onPick(start, day);
    };
    const NAV = 'flex h-11 w-11 items-center justify-center rounded-full text-[#1A1530] hover:bg-[#EDE7FB] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#EDE7FB]';
    const canGoBack = iso(year, month, 1) > min.slice(0, 8) + '01';

    return (
        <div className={className}>
            <div className='mb-1 flex items-center justify-between'>
                <button type='button' aria-label='Previous month' disabled={!canGoBack} onClick={() => shift(-1)} className={`${NAV} disabled:opacity-30`}>
                    <ChevronLeft size={18} aria-hidden='true' />
                </button>
                <p aria-live='polite' className='text-sm font-semibold text-[#1A1530]'>
                    {monthLabel.format(new Date(Date.UTC(year, month, 1)))}
                </p>
                <button type='button' aria-label='Next month' onClick={() => shift(1)} className={NAV}>
                    <ChevronRight size={18} aria-hidden='true' />
                </button>
            </div>
            <div className='grid grid-cols-7 text-center'>
                {WEEKDAYS.map((w) => (
                    <span key={w} className='py-1 text-xs font-medium text-[#5E5775]'>
                        {w}
                    </span>
                ))}
                {cells.map((day, i) => {
                    if (!day) return <span key={`blank-${i}`} />;
                    const disabled = day < min;
                    const edge = day === start || day === end;
                    const inside = end !== null && day > start && day < end;
                    return (
                        <button
                            key={day}
                            type='button'
                            disabled={disabled}
                            aria-pressed={edge}
                            aria-label={dayLabel.format(new Date(`${day}T00:00:00Z`))}
                            onClick={() => pick(day)}
                            className={`h-11 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B21B6] ${
                                edge ? 'rounded-full bg-[#5B21B6] font-semibold text-white' : inside ? 'bg-[#EDE7FB] font-medium text-[#1A1530]' : 'rounded-full text-[#1A1530] hover:bg-[#EDE7FB]'
                            } ${disabled ? 'cursor-not-allowed text-[#B8B2C9] hover:bg-transparent' : ''}`}
                        >
                            {Number(day.slice(8))}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default DateRangePicker;
