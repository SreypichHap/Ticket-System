import Image from 'next/image';
import type { EventDetail } from '@/lib/types';
import EventInfoCard from './EventInfoCard';

type Props = { event: EventDetail; className?: string };

const EventHero = ({ event, className = '' }: Props) => (
    <section data-animate='event-hero' className={`grid grid-cols-1 overflow-hidden rounded-3xl md:grid-cols-[2fr_1fr] ${className}`}>
        <div className='relative aspect-video'>
            <Image src={event.banner} alt={event.title} fill priority sizes='(min-width: 1120px) 725px, (min-width: 768px) 66vw, 100vw' className='object-cover' />
        </div>
        <EventInfoCard event={event} />
    </section>
);

export default EventHero;
