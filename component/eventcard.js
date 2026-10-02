import Image from 'next/image';
import Link from 'next/link';

// Fixed time zone so server and client render the same text.
const formatDate = (iso) => {
    const d = new Date(iso);
    const day = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'Asia/Jakarta' }).format(d);
    const time = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Jakarta' }).format(d);
    return `${day} • ${time.replace(':', '.')}`;
};

const formatPrice = (amount, currency) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);

const PinIcon = () => (
    <svg viewBox='0 0 24 24' className='h-4 w-4 shrink-0 text-[#9A37E6] dark:text-[#BA77EE]' fill='none' stroke='currentColor' strokeWidth='2' aria-hidden='true'>
        <path d='M12 22s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z' strokeLinejoin='round' />
        <circle cx='12' cy='10' r='2.5' />
    </svg>
);

/** @param {{ title: string, image?: import('next/image').StaticImageData | string, date?: string, location?: string, price: number, currency: string, href?: string, className?: string }} props */
const EventCard = ({ title, image, date, location, price, currency, href, className = '' }) => {
    const card = (
        // Hook: card-level effects go on this element (hover currently zooms the image only)
        <div className={`flex h-full w-full flex-col group overflow-hidden rounded-2xl border border-[#6C4BE0]/10 bg-white dark:bg-[#14111F] shadow-sm ${className}`}>
            {/* Image */}
            <div className='relative aspect-video'>
                <div className='absolute inset-0 overflow-hidden'>
                    {/* Hook: image zoom on card hover goes on this Image */}
                    {image ? (
                        <Image src={image} alt={title} fill sizes='320px' className='object-cover transition duration-500 group-hover:scale-105' />
                    ) : (
                        // No photo from the API: plain tile instead of a stand-in picture
                        <div className='h-full w-full bg-gradient-to-br from-[#F1EDFB] dark:from-[#181325] to-[#E4DAFB] dark:to-[#1B132D]' aria-hidden='true' />
                    )}
                </div>
                {date && (
                    <span className='absolute bottom-0 left-5 z-10 translate-y-1/2 whitespace-nowrap rounded-full bg-white dark:bg-[#14111F] px-3 py-1 text-xs font-medium text-[#6C4BE0] dark:text-[#947CE9] shadow-md'>
                        {formatDate(date)}
                    </span>
                )}
            </div>

            {/* Description */}
            <div className={`flex flex-1 flex-col p-3 ${date ? 'pt-6' : ''}`}>
                <h3 className='line-clamp-2 text-xl font-semibold text-[#1E1B3A] dark:text-[#E1DFF0]'>{title}</h3>
                {location && (
                    <p className='mt-2 flex items-center gap-1 text-[13px] text-[#6B6890] dark:text-[#B1B0C6]'>
                        <PinIcon />
                        {location}
                    </p>
                )}
                <p className='mt-auto pt-3'>
                    <span className='text-xs text-[#6B6890] dark:text-[#B1B0C6]'>Starts from </span>
                    <span className='text-base font-bold text-[#6C4BE0] dark:text-[#947CE9]'>{formatPrice(price, currency)}</span>
                </p>
            </div>
        </div>
    );

    return href ? <Link href={href} className='block h-full'>{card}</Link> : card;
};

export default EventCard;
