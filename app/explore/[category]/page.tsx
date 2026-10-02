import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/component/public/navbar';
import HeroSection from '@/component/public/herosection';
import EventCard from '@/component/eventcard';
import Footer from '@/component/footer/Footer';
import { poppins } from '@/component/fonts';
import { getCategoryItems } from '@/lib/api';

type Props = { params: Promise<{ category: string }> };

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const data = await getCategoryItems((await params).category);
    return { title: data ? `${data.title} · All` : 'Not found' };
};

// "See all" page: every item of one homepage category (events, hotels, bus, ...)
const Page = async ({ params }: Props) => {
    const data = await getCategoryItems((await params).category);
    if (!data) notFound();

    return (
        <div className={`${poppins.className} min-h-screen bg-white dark:bg-[#14111F]`}>
            <Navbar />
            <HeroSection />
            <main className='px-4 pb-32 pt-8 md:px-40'>
                <div className='mx-auto max-w-[1160px]'>
                    <Link
                        href='/'
                        aria-label='Back to home'
                        className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-black/20 dark:border-white/20 text-black dark:text-white transition hover:bg-black/5 dark:hover:bg-white/5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/10 dark:focus-visible:ring-white/10'
                    >
                        <ArrowLeft size={24} aria-hidden='true' />
                    </Link>
                    <h1 className='mb-6 text-[32px] font-semibold tracking-tight text-[#1E1B3A] dark:text-[#E1DFF0]'>{data.title}</h1>
                    {data.items.length > 0 ? (
                        <ul className='grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),320px))] justify-center gap-4'>
                            {data.items.map((item) => (
                                <li key={item.id}>
                                    <EventCard {...item} />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className='py-10 text-center text-[#6B6890] dark:text-[#B1B0C6]'>Nothing to show here right now.</p>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Page;
