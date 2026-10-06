import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/component/public/navbar';
import RoomsPageHeader from '@/component/rooms/RoomsPageHeader';
import RoomList from '@/component/rooms/RoomList';
import { getStayRooms } from '@/lib/stays';
import { nightsBetween, parseSearch } from '@/lib/stay-search';

type Props = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const data = await getStayRooms((await params).slug);
    return { title: data ? `Select room · ${data.stayName}` : 'Select room' };
};

const Page = async ({ params, searchParams }: Props) => {
    const data = await getStayRooms((await params).slug);
    if (!data) notFound();
    const search = parseSearch(await searchParams);
    const most = (values: (number | null)[]) => Math.max(0, ...values.map((v) => v ?? 0)) || undefined;
    const nights = nightsBetween(search.checkIn, search.checkOut);

    return (
        <div className={`flex min-h-screen flex-col bg-[#F6F4FB]`}>
            <Navbar />
            <main className='mx-auto w-full max-w-[1080px] flex-1 px-6 pt-8'>
                <RoomsPageHeader stayName={data.stayName} stayHref={`/stays/${(await params).slug}`} roomCount={data.rooms.length} search={search} maxRooms={most(data.rooms.map((r) => r.maxRooms))} maxGuests={most(data.rooms.map((r) => r.maxGuests))} />
                <RoomList slug={(await params).slug} rooms={data.rooms} search={search} nights={nights} />
            </main>
        </div>
    );
};

export default Page;
