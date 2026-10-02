import Image from 'next/image';
import Link from 'next/link';
import type { EventDetail } from '@/lib/types';
import { CARD, CARD_TITLE } from './styles';

type Props = { organizer: EventDetail['organizer']; className?: string };

const OrganizerCard = ({ organizer, className = '' }: Props) => (
    <section data-animate='organizer-card' className={`${CARD} ${className}`}>
        <h2 className={`${CARD_TITLE} mb-3`}>Organized by</h2>
        {organizer.url ? (
            <Link href={organizer.url} className='flex min-h-11 items-center gap-3 rounded-full hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B3FD9]'>
                <span className='relative size-10 shrink-0 overflow-hidden rounded-full bg-white dark:bg-[#14111F]'>
                    <Image src={organizer.logo} alt='' fill sizes='40px' className='object-contain p-1' />
                </span>
                <span className='font-medium'>{organizer.name}</span>
                </Link>
        ) : (
            <div className='flex min-h-11 items-center gap-3'>
                <span className='relative size-10 shrink-0 overflow-hidden rounded-full bg-white dark:bg-[#14111F]'>
                    <Image src={organizer.logo} alt='' fill sizes='40px' className='object-contain p-1' />
                </span>
                <span className='font-medium'>{organizer.name}</span>
                </div>
        )}
    </section>
);

export default OrganizerCard;
