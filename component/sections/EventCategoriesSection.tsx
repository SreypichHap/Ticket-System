import EventCategoryCard, { type EventCategory } from './EventCategoryCard';
import { poppins } from '../fonts';
import concertImg from '../../asset/sellticket/concert.jpg';
import sportsImg from '../../asset/sellticket/sport.jpg';
import workshopImg from '../../asset/sellticket/workshop_and_meetup.jpg';
import artsImg from '../../asset/sellticket/arts_exhibitions.jpg';
import fundraisingImg from '../../asset/sellticket/fundraising_events.jpg';
import concertIcon from '../../asset/sellticket/icon/concert.png';
import sportIcon from '../../asset/sellticket/icon/sport.png';
import workshopIcon from '../../asset/sellticket/icon/workshop.png';
import artIcon from '../../asset/sellticket/icon/art.png';
import fundraisingIcon from '../../asset/sellticket/icon/fundraising.png';

export type EventCategoriesSectionProps = {
    brandName?: string;
    title?: string;
    subtitle?: string;
    categories?: EventCategory[];
    className?: string;
    cardClassName?: string;
};

const defaultCategories: EventCategory[] = [
    { id: 'concert', title: 'Concert', href: '/events?category=concert', image: concertImg, imageAlt: 'Crowd at a stage concert with LED screens', icon: concertIcon },
    { id: 'sports', title: 'Sports', href: '/events?category=sports', image: sportsImg, imageAlt: 'Runners celebrating as they cross a race finish line', icon: sportIcon },
    { id: 'workshop', title: 'Workshop & Meetup', href: '/events?category=workshop', image: workshopImg, imageAlt: 'Speaker addressing a seated audience at a meetup', icon: workshopIcon },
    { id: 'arts', title: 'Arts & Exhibitions', href: '/events?category=arts', image: artsImg, imageAlt: 'Visitors viewing paintings in an art gallery', icon: artIcon },
    { id: 'fundraising', title: 'Fundraising Events', href: '/events?category=fundraising', image: fundraisingImg, imageAlt: 'Crowd of participants at the start of a charity fun run in a stadium', icon: fundraisingIcon },
]

const EventCategoriesSection = ({
    brandName = 'BookMe+',
    title = 'Sell tickets for any event',
    subtitle = `Whether it's a concert, sports event, or workshop, ${brandName} has you covered with powerful ticketing solutions.`,
    categories = defaultCategories,
    className = '',
    cardClassName = '',
}: EventCategoriesSectionProps) => (
    <section aria-labelledby='event-categories-title' className={`bg-white dark:bg-[#14111F] px-4 py-8 md:px-40 ${className}`}>
        <div className='mx-auto max-w-[1160px]'>
            <div className='text-center'>
                <h2 id='event-categories-title' className={`${poppins.className} text-3xl font-extrabold uppercase tracking-tight text-[#1A1530] dark:text-[#E7E5F3] md:text-5xl`}>
                    {title}
                </h2>
                <p className={`${poppins.className} mx-auto mt-4 max-w-[680px] text-base leading-relaxed text-[#5E5775] dark:text-[#C3BFCF] md:text-lg`}>{subtitle}</p>
            </div>

            <div className='mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
                {categories.map(({ id, ...category }) => (
                    <EventCategoryCard
                        key={id}
                        {...category}
                        className={cardClassName}
                    />
                ))}
            </div>
        </div>
    </section>
);

export default EventCategoriesSection;
