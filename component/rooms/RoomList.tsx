'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Room, StaySearch } from '@/lib/types';
import RoomCard from './RoomCard';
import SelectionBar from './SelectionBar';

type Props = { stayId: string; rooms: Room[]; search: StaySearch; nights: number; className?: string };

// Holds the single selected room; "Continue" hands the choice to /booking through the query string.
const RoomList = ({ stayId, rooms, search, nights, className = '' }: Props) => {
    const router = useRouter();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const selected = rooms.find((r) => r.id === selectedId && !r.soldOut);

    const next = () => {
        if (!selected) return;
        const params = new URLSearchParams({ stayId, roomId: selected.id, checkIn: search.checkIn, checkOut: search.checkOut, guests: String(search.guests) });
        router.push(`/booking?${params}`);
    };

    return (
        <>
            <ul className={`flex flex-col gap-4 ${className}`}>
                {rooms.map((room, i) => (
                    <li key={room.id}>
                        <RoomCard room={room} nights={nights} priority={i === 0} selected={room.id === selected?.id} onToggle={() => setSelectedId(room.id === selectedId ? null : room.id)} />
                    </li>
                ))}
            </ul>
            <SelectionBar
                roomName={selected?.name ?? ''}
                total={(selected?.pricePerNight ?? 0) * nights}
                currency={selected?.currency ?? 'USD'}
                nights={nights}
                onContinue={next}
            />
        </>
    );
};

export default RoomList;
