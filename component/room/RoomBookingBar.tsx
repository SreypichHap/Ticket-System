'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { StaySearch } from '@/lib/types';
import RoomSelectorButton from './RoomSelectorButton';
import RoomQuantitySheet from './RoomQuantitySheet';

type Props = {
    stayId: string;
    roomId: string;
    available: boolean;
    // Rooms available per the API (stock count / per-order limit); null when it gives none
    maxRooms: number | null;
    // The search carried over from the room list (dates, guests, rooms)
    search: StaySearch;
    className?: string;
};

const RoomBookingBar = ({ stayId, roomId, available, maxRooms, search, className = '' }: Props) => {
    const router = useRouter();
    const [rooms, setRooms] = useState(maxRooms ? Math.min(search.rooms, maxRooms) : search.rooms);
    const [pickerOpen, setPickerOpen] = useState(false);

    const book = () => {
        const params = new URLSearchParams({ stayId, roomId, rooms: String(rooms), checkIn: search.checkIn, checkOut: search.checkOut, guests: String(search.guests) });
        router.push(`/booking?${params}`);
    };

    return (
        <div className={`fixed inset-x-0 bottom-0 z-40 px-6 pb-[max(0.5rem,env(safe-area-inset-bottom))] ${className}`}>
            <div className='mx-auto flex max-w-[1180px] gap-3 py-0'>
                <RoomSelectorButton value={rooms} onClick={() => setPickerOpen(true)} className='flex-1' />
                <div className='flex-1'>
                    {available ? (
                        <button
                            type='button'
                            onClick={book}
                            className='min-h-[58px] w-full rounded-full bg-[#5B21B6] text-base font-semibold text-white hover:bg-[#4C1D95] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#DCD4EE]'
                        >
                            Book
                        </button>
                    ) : (
                        <div className='flex min-h-[58px] items-center justify-center rounded-full bg-[#EFECF5] text-sm font-semibold text-[#5E5775]'>Sold out for these dates</div>
                    )}
                </div>
            </div>
            <RoomQuantitySheet
                open={pickerOpen}
                value={rooms}
                max={maxRooms ?? search.rooms}
                onSelect={(n) => {
                    setRooms(n);
                    setPickerOpen(false);
                }}
                onClose={() => setPickerOpen(false)}
            />
        </div>
    );
};

export default RoomBookingBar;
