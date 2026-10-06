'use client';

import { useState } from 'react';
import type { Guests } from '@/hooks/useSearchState';
import { MAX_CHILD_AGE, plural } from '@/lib/stay-search';
import BottomSheet from '../ui/BottomSheet';
import Stepper from '../ui/Stepper';

// maxRooms / maxGuestsPerRoom come from the stay's rooms in the API; undefined means the API gives no limit
type Props = { open: boolean; value: Guests; maxRooms?: number; maxGuestsPerRoom?: number; onApply: (guests: Guests) => void; onClose: () => void };
type BodyProps = Pick<Props, 'value' | 'maxRooms' | 'maxGuestsPerRoom' | 'onApply'>;

export const childrenLabel = (n: number) => `${n} ${n === 1 ? 'child' : 'children'}`;

const AGES = Array.from({ length: MAX_CHILD_AGE + 1 }, (_, age) => ({ age, label: age === 0 ? 'Under 1' : `${age} ${age === 1 ? 'year' : 'years'}` }));

// The body mounts only while the sheet is open, so every opening starts from the committed guests (closing discards the draft)
const GuestsBody = ({ value, maxRooms, maxGuestsPerRoom, onApply }: BodyProps) => {
    const [draft, setDraft] = useState(value);
    const { rooms, adults, children, childAges } = draft;
    const capacity = maxGuestsPerRoom && maxGuestsPerRoom * rooms; // total guests the chosen rooms can take

    // Every room needs an adult; over capacity, children are dropped first, then adults (never below one per room)
    const update = (next: Guests) => {
        const limit = maxGuestsPerRoom ? maxGuestsPerRoom * next.rooms : Infinity;
        const adultsNow = Math.max(next.adults, next.rooms);
        const childrenNow = Math.min(next.children, Math.max(0, limit - adultsNow));
        setDraft({
            rooms: next.rooms,
            adults: Math.min(adultsNow, Math.max(next.rooms, limit - childrenNow)),
            children: childrenNow,
            childAges: Array.from({ length: childrenNow }, (_, i) => next.childAges[i] ?? null),
        });
    };

    return (
        <div className='px-5 pb-5 pt-5'>
            <div className='flex flex-col gap-5'>
                <Stepper label='Rooms' value={rooms} min={1} max={maxRooms} onChange={(n) => update({ ...draft, rooms: n })} />
                <Stepper label='Adults' hint='Age 18 or above' value={adults} min={rooms} max={capacity === undefined ? undefined : capacity - children} onChange={(n) => update({ ...draft, adults: n })} />
                <Stepper label='Children' hint='Age 0 – 17' value={children} min={0} max={capacity === undefined ? undefined : capacity - adults} onChange={(n) => update({ ...draft, children: n })} />
            </div>

            {children > 0 && (
                <div className='mt-5 rounded-[14px] bg-search-tint p-4'>
                    <p className='mb-3 text-xs text-search-muted'>Ages help us show the right rooms and prices.</p>
                    <div className='grid grid-cols-2 gap-3'>
                        {childAges.map((age, i) => (
                            <label key={i} className='flex flex-col gap-1 text-xs font-medium text-search-muted'>
                                Child {i + 1} age
                                <select
                                    value={age ?? ''}
                                    onChange={(e) => update({ ...draft, childAges: childAges.map((a, j) => (j === i ? (e.target.value === '' ? null : Number(e.target.value)) : a)) })}
                                    className='h-11 rounded-[14px] border border-search-border bg-white px-3 text-sm text-search-text focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-search-soft'
                                >
                                    <option value=''>Select age</option>
                                    {AGES.map((a) => (
                                        <option key={a.age} value={a.age}>
                                            {a.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            <div className='mt-5 flex items-center justify-between gap-4'>
                <div>
                    <p aria-live='polite' className='text-sm font-semibold text-search-text'>
                        {[plural(rooms, 'room'), plural(adults, 'adult'), children > 0 && childrenLabel(children)].filter(Boolean).join(' · ')}
                    </p>
                    <p className='text-xs text-search-muted'>Each room needs 1 adult</p>
                </div>
                <button
                    type='button'
                    onClick={() => onApply(draft)}
                    className='h-[52px] rounded-2xl bg-search-accent px-8 text-base font-semibold text-white hover:bg-search-accent-text focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-search-soft'
                >
                    Done
                </button>
            </div>
        </div>
    );
};

const GuestsSheet = ({ open, value, maxRooms, maxGuestsPerRoom, onApply, onClose }: Props) => (
    <BottomSheet open={open} title='Rooms & guests' onClose={onClose} showClose>
        <GuestsBody value={value} maxRooms={maxRooms} maxGuestsPerRoom={maxGuestsPerRoom} onApply={onApply} />
    </BottomSheet>
);

export default GuestsSheet;
