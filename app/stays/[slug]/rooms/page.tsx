import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageContainer from '@/component/layout/PageContainer';
import RoomsPageHeader from '@/component/rooms/RoomsPageHeader';
import RoomList from '@/component/rooms/RoomList';
import SearchScreen from '@/component/search/SearchScreen';
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
    const query = await searchParams;
    const search = parseSearch(query);

    // "Change" on the room list opens the search screen on the same route
    if (query.change) {
        const most = (values: (number | null)[]) => Math.max(0, ...values.map((v) => v ?? 0)) || undefined;
        return (
            <PageContainer width='narrow' className='pb-28 pt-8'>
                <SearchScreen search={search} maxRooms={most(data.rooms.map((r) => r.maxRooms))} maxGuestsPerRoom={most(data.rooms.map((r) => r.maxGuests))} />
            </PageContainer>
        );
    }

    const nights = nightsBetween(search.checkIn, search.checkOut);

    return (
        <PageContainer width='narrow'>
            <RoomsPageHeader stayName={data.stayName} stayHref={`/stays/${(await params).slug}`} roomCount={data.rooms.length} search={search} />
            <RoomList slug={(await params).slug} rooms={data.rooms} search={search} nights={nights} />
        </PageContainer>
    );
};

export default Page;
