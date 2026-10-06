import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/component/public/navbar';
import PhotoGallery from '@/component/stay/PhotoGallery';
import ThingsToKnowCard from '@/component/stay/ThingsToKnowCard';
import RoomTitleCard from '@/component/room/RoomTitleCard';
import KeyFactsRow from '@/component/room/KeyFactsRow';
import AboutRoomCard from '@/component/room/AboutRoomCard';
import FacilitiesCard from '@/component/room/FacilitiesCard';
import RoomBookingBar from '@/component/room/RoomBookingBar';
import { getRoom } from '@/lib/rooms';
import { parseSearch } from '@/lib/stay-search';

type Props = {
    params: Promise<{ slug: string; roomId: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { slug, roomId } = await params;
    const room = await getRoom(slug, roomId);
    return { title: room ? `${room.name} · ${room.stayName}` : 'Room' };
};

const Page = async ({ params, searchParams }: Props) => {
    const { slug, roomId } = await params;
    const room = await getRoom(slug, roomId);
    if (!room) notFound();
    const search = parseSearch(await searchParams);
    // Back goes to the room list with the same dates and guests
    const backQuery = new URLSearchParams({ checkIn: search.checkIn, checkOut: search.checkOut, rooms: String(search.rooms), guests: String(search.guests) });

    return (
        <div className='flex min-h-screen flex-col bg-[#F6F4FB]'>
            <Navbar />
            <main className='mx-auto w-full max-w-[1180px] flex-1 px-6 pb-24 pt-6'>
                <div className='flex flex-col gap-4'>
                    <PhotoGallery photos={room.photos} backHref={`/stays/${slug}/rooms?${backQuery}`} />
                    <RoomTitleCard name={room.name} roomType={room.roomType} pricePerNight={room.pricePerNight} currency={room.currency} />
                    {room.facts.length > 0 && <KeyFactsRow facts={room.facts} />}
                    {room.description && <AboutRoomCard html={room.description} />}
                    {room.facilities.length > 0 && <FacilitiesCard groups={room.facilities} />}
                    {room.thingsToKnow.length > 0 && <ThingsToKnowCard items={room.thingsToKnow} />}
                </div>
            </main>
            <RoomBookingBar stayId={room.stayId} roomId={room.id} available={room.available} maxRooms={room.maxRooms} search={search} />
        </div>
    );
};

export default Page;
