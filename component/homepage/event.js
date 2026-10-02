'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import iconTickets from '../../asset/categories/tickets_icons.png';
import iconHotel from '../../asset/categories/hotel_icon.png';
import iconBus from '../../asset/categories/bus_icon.png';
import iconTour from '../../asset/categories/tour_icons.png';
import iconThingsToDo from '../../asset/categories/thing to do_icon.png';
import iconFerry from '../../asset/categories/ferry_icon.png';
import { TbBaselineDensitySmall } from 'react-icons/tb';
import { HOME_RESET_EVENT } from '../public/HomeLogoLink';
import EventCard from '../eventcard';

import { poppins } from '../fonts';

// variant 'full' is for icons that already include their own rounded tile (asset/categories).
// variant 'icon' renders a react-icons component in the same purple on a matching light tile.
// variant 'plain' renders the icon without the lavender tile background.
const categories = [
    { id: 'all', label: 'All', icon: TbBaselineDensitySmall, variant: 'icon' },
    { id: 'events', label: 'Events', icon: iconTickets, variant: 'full' },
    { id: 'hotel', label: 'Hotel', icon: iconHotel, variant: 'full' },
    { id: 'bus', label: 'Bus', icon: iconBus, variant: 'full' },
    { id: 'tours', label: 'Tours', icon: iconTour, variant: 'full' },
    { id: 'things-to-do', label: 'Things to do', icon: iconThingsToDo, variant: 'full' },
    { id: 'ferry', label: 'Ferry', icon: iconFerry, variant: 'full' },
];

const CategoryItem = ({ label, icon, active = false, onSelect, disabled = false, badge, variant = 'full', className = '' }) => {
    const Glyph = icon;
    // Tile style: white card, light border; 152x96 on desktop (shrinks to fit the row), 120x88 on mobile
    const base = [
        'group relative flex h-[88px] w-[120px] shrink-0 snap-start flex-col items-center justify-center gap-2.5 rounded-2xl border bg-white dark:bg-[#14111F] px-3 transition duration-200 motion-safe:hover:-translate-y-1',
        'md:h-[96px] md:w-auto md:min-w-0 md:max-w-[152px] md:flex-1',
        'focus-visible:outline-none focus-visible:border-2 focus-visible:border-[#5B21B6] focus-visible:ring-4 focus-visible:ring-[#EDE7FB] dark:focus-visible:ring-[#31254C]',
        active ? 'border-[#5B21B6] dark:border-[#A99BFF] bg-[#F7F4FE] dark:bg-[#150F24]' : 'border-[#E7E2F3] dark:border-[#5A5078] hover:border-[#CFC7E3] dark:hover:border-[#7C70A6] hover:shadow-[0_8px_20px_rgba(26,21,48,0.08)]',
    ].join(' ');

    const content = (
        <>
            {variant === 'icon' ? (
                <span className='flex h-8 w-8 items-center justify-center rounded-lg bg-[#F3EEFE] dark:bg-white motion-safe:group-hover:animate-[icon-bounce_0.5s_ease-out]'>
                    <Glyph size={20} className='text-[#6444D8]' aria-hidden='true' />
                </span>
            ) : (
                <Image src={icon} alt='' width={32} height={32} className='h-8 w-8 object-contain motion-safe:group-hover:animate-[icon-bounce_0.5s_ease-out]' />
            )}
            {badge && (
                <span className='absolute -top-2 -left-2 rounded-full bg-[#C62828] px-1.5 py-0.5 text-[10px] font-bold leading-none text-white'>
                    {badge}
                    <span className='sr-only'> new</span>
                </span>
            )}
            <span className={`line-clamp-2 w-full text-center text-sm leading-tight text-[#1A1530] dark:text-[#E7E5F3] md:truncate md:line-clamp-none ${active ? 'font-bold' : 'font-medium'}`}>
                {label}
            </span>
        </>
    );

    // Hooks for hover/active animations (Tailwind transitions, Framer Motion, ...):
    // target data-state / data-disabled, or wrap `content` in a motion element.
    const hooks = {
        'data-state': disabled ? 'disabled' : active ? 'active' : 'enabled',
        'data-disabled': disabled ? '' : undefined,
    };

    return (
        <li className='list-none md:flex md:min-w-0 md:flex-1 md:justify-center'>
            {disabled ? (
                <span aria-disabled='true' {...hooks} className={`${base} cursor-not-allowed opacity-35 ${className}`}>
                    {content}
                </span>
            ) : (
                <button type='button' onClick={onSelect} aria-pressed={active} {...hooks} className={`${base} ${className}`}>
                    {content}
                </button>
            )}
        </li>
    );
};

// Shows the newest few items of a category; "See all" opens the full list page.
const CardCarousel = ({ id, title, items, href, className = 'bg-white dark:bg-[#14111F]' }) => (
    <section aria-labelledby={`${id}-title`} className={`${poppins.className} ${className} px-4 py-4 md:px-40`}>
        <div className='mx-auto max-w-[1160px]'>
            <div className='mb-3 flex items-center justify-between gap-4'>
                <h2 id={`${id}-title`} className='text-[32px] font-semibold tracking-tight text-[#1E1B3A] dark:text-[#E1DFF0]'>
                    {title}
                </h2>
                <Link
                    href={href}
                    className='shrink-0 rounded-full py-2 pl-4 pr-0 text-sm font-semibold text-[#6C4BE0] dark:text-[#947CE9] md:pr-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#EDE7FB] dark:focus-visible:ring-[#31254C]'
                >
                    See all<span className='sr-only'> {title}</span>
                    <span aria-hidden='true' className='ml-1 inline-block'>→</span>
                </Link>
            </div>
            <ul className='-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:scroll-px-0 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
                {items.map((item) => (
                    <li key={item.id} className='w-[min(320px,85vw)] shrink-0 snap-start'>
                        <EventCard {...item} />
                    </li>
                ))}
            </ul>
        </div>
    </section>
);

// sections: the list sections to show (see lib/api.ts). children: the rest of the homepage, shown only while no category filter is active.
const Event = ({ sections, children }) => {
    // null or 'all' = no filter (show every section); click the active category again to clear it
    const [activeCategory, setActiveCategory] = useState(null);
    useEffect(() => {
        const reset = () => setActiveCategory(null);
        window.addEventListener(HOME_RESET_EVENT, reset);
        return () => window.removeEventListener(HOME_RESET_EVENT, reset);
    }, []);
    const isFiltered = Boolean(activeCategory) && activeCategory !== 'all';
    // Category tiles without API data are left out ("All" stays whenever any list exists)
    const availableCategories = categories.filter((c) => c.id === 'all' ? sections.length > 0 : sections.some((s) => s.category === c.id));
    const visibleSections = isFiltered ? sections.filter((s) => s.category === activeCategory) : sections;

    return (
        <>
            <div className='bg-white dark:bg-[#14111F] px-4 pb-6 pt-6 md:px-40'>
                <div className='mx-auto max-w-[1160px]'>
                    <nav
                        aria-label='Categories'
                        className={`${poppins.className} w-full`}
                    >
                        <ul className='-mx-4 flex snap-x snap-mandatory scroll-px-4 justify-start gap-4 overflow-x-auto p-1 px-4 md:mx-0 md:scroll-px-0 md:justify-center md:gap-4 md:px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
                            {availableCategories.map((category) => (
                                <CategoryItem
                                    key={category.id}
                                    {...category}
                                    active={activeCategory === category.id}
                                    onSelect={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                                />
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
            {/* key remounts the carousel so its scroll position resets when the filter changes */}
            {visibleSections.map((s) => <CardCarousel key={s.id} id={s.id} title={s.title} items={s.items} href={s.href} />)}
            {!isFiltered && children}
        </>
    );
}

export default Event;
