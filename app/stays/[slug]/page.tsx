import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/component/public/navbar';
import PhotoGallery from '@/component/stay/PhotoGallery';
import StayHeader from '@/component/stay/StayHeader';
import AboutCard from '@/component/stay/AboutCard';
import ThingsToKnowCard from '@/component/stay/ThingsToKnowCard';
import BookingActions from '@/component/stay/BookingActions';
import MobileBookingBar from '@/component/stay/MobileBookingBar';
import { getStay } from '@/lib/stays';

type Props = { params: Promise<{ slug: string }> };

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const stay = await getStay((await params).slug);
    return { title: stay?.name ?? 'Stay' };
};

const Page = async ({ params }: Props) => {
    const stay = await getStay((await params).slug);
    if (!stay) notFound();

    return (
        <div className={`min-h-screen bg-[#F6F4FB]`}>
            <Navbar />
            <main className='mx-auto max-w-[1180px] px-6 pb-28 pt-6 lg:pb-16'>
                <PhotoGallery photos={stay.photos} backHref='/' />
                <StayHeader stay={stay} />
                <div className='grid items-start gap-4 pt-5 lg:grid-cols-[1fr_380px] lg:gap-7'>
                    <div className='flex min-w-0 flex-col gap-4'>
                        {stay.description.length > 0 && <AboutCard paragraphs={stay.description} />}
                        {stay.thingsToKnow.length > 0 && <ThingsToKnowCard items={stay.thingsToKnow} />}
                    </div>
                    <div className='hidden flex-col gap-4 lg:sticky lg:top-6 lg:flex'>
                        <BookingActions stay={stay} />
                    </div>
                </div>
            </main>
            <MobileBookingBar stay={stay} />
        </div>
    );
};

export default Page;
