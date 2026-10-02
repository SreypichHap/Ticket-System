import Image from 'next/image';
import { ArrowUpRight, Calendar, MapPin } from 'lucide-react';
import type { EventDetail } from '@/lib/types';
import { formatEventDate } from '@/lib/format';
import ScrollToButton from './ScrollToButton';
import { ICON_BTN, MUTED, PRIMARY_BTN } from './styles';

type Props = { event: EventDetail; className?: string };

const EventInfoCard = ({ event, className = '' }: Props) => {
    const { title, startAt, endAt, venue, organizer } = event;

    return (
        <div
            data-animate='event-info-card'
            className={`flex flex-col gap-4 bg-white/70 dark:bg-[#14111F]/70 p-6 text-[#1A1530] dark:text-[#E7E5F3] backdrop-blur ${className}`}
        >
            <div className='flex items-center justify-between'>
                <span className='relative size-12 overflow-hidden rounded-full bg-white dark:bg-[#14111F] ring-2 ring-white dark:ring-[#14111F]'>
                    <Image src={organizer.logo} alt={organizer.name} fill sizes='48px' className='object-contain p-1' />
                </span>
            </div>
            <h1 className='line-clamp-2 text-2xl font-bold'>{title}</h1>
            <p className='flex items-start gap-3 text-sm'>
                <Calendar size={18} className='mt-0.5 shrink-0' aria-hidden='true' />
                <span>{formatEventDate(startAt, endAt)}</span>
            </p>
            {venue.name && (
                <>
                    <hr className='border-black/10 dark:border-white/10' />
                    <div className='flex items-start gap-3'>
                        <MapPin size={18} className='mt-0.5 shrink-0' aria-hidden='true' />
                        <div className='min-w-0 flex-1'>
                            <p className='text-sm font-medium'>{venue.name}</p>
                            <p className={`text-xs ${MUTED}`}>{venue.address}</p>
                        </div>
                        <a
                            href={venue.mapUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            aria-label='Open in Maps'
                            className={`${ICON_BTN} -my-2 -mr-2 hover:bg-black/5 dark:hover:bg-white/5`}
                        >
                            <ArrowUpRight size={18} aria-hidden='true' />
                        </a>
                    </div>
                </>
            )}
            <ScrollToButton targetId='tickets' className={`${PRIMARY_BTN} mt-auto h-12 w-full`}>
                Get Ticket Now
            </ScrollToButton>
        </div>
    );
};

export default EventInfoCard;
