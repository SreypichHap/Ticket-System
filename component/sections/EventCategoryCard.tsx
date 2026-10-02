import Image, { type StaticImageData } from 'next/image';
import { poppins } from '../fonts';

export type EventCategory = {
    id: string;
    title: string;
    href: string;
    image: StaticImageData | string;
    imageAlt: string;
    icon: StaticImageData | string;
};

type EventCategoryCardProps = Omit<EventCategory, 'id'> & {
    className?: string;
    imageClassName?: string;
};

const EventCategoryCard = ({ title, href, image, imageAlt, icon, className = '', imageClassName = '' }: EventCategoryCardProps) => (
    <a
        href={href}
        className={`${poppins.className} group flex flex-col overflow-hidden rounded-3xl border border-[#E7E2F3] dark:border-[#362F47] bg-white dark:bg-[#14111F] shadow-[0_1px_2px_rgba(26,21,48,0.04)] focus-visible:border-[#5B21B6] focus-visible:shadow-[0_12px_32px_rgba(26,21,48,0.10)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#EDE7FB] dark:focus-visible:ring-[#31254C] ${className}`}
    >
        <div className='relative aspect-[4/3] w-full overflow-hidden'>
            <Image
                src={image}
                alt={imageAlt}
                fill
                sizes='(min-width: 1024px) 20vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw'
                className={`object-cover transition duration-500 group-hover:scale-105 ${imageClassName}`}
            />
        </div>
        <div className='flex flex-col items-center gap-4 p-6 text-center'>
            <span className='flex h-16 w-16 items-center justify-center rounded-full'>
                <span className='flex h-14 w-14 items-center justify-center rounded-full bg-[#EDE7FB] dark:bg-[#191328]'>
                    <Image src={icon} alt='' width={28} height={28} className='h-7 w-7 object-contain' />
                </span>
            </span>
            <h3 className='text-lg font-bold text-[#1A1530] dark:text-[#E7E5F3]'>{title}</h3>
        </div>
    </a>
);

export default EventCategoryCard;
