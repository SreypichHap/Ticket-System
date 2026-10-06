import type { Room, StaySearch } from '@/lib/types';
import RoomCard from './RoomCard';

type Props = { slug: string; rooms: Room[]; search: StaySearch; nights: number; className?: string };

// "Book" on a card opens that room's detail page, where the booking is confirmed.
const RoomList = ({ slug, rooms, search, nights, className = '' }: Props) => {
    const query = new URLSearchParams({ checkIn: search.checkIn, checkOut: search.checkOut, rooms: String(search.rooms), guests: String(search.guests) });

    return (
        <ul className={`flex flex-col gap-4 ${className}`}>
            {rooms.map((room, i) => (
                <li key={room.id}>
                    <RoomCard room={room} href={`/stays/${slug}/rooms/${room.id}?${query}`} nights={nights} priority={i === 0} />
                </li>
            ))}
        </ul>
    );
};

export default RoomList;
