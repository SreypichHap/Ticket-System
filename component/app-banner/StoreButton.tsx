import type { ReactNode } from 'react';
import { Star } from 'lucide-react';

type Props = {
    icon: ReactNode;
    caption: string;
    label: string;
    href: string;
    ariaLabel: string;
    rating: string;
    ratingCaption: string;
};

const StoreButton = ({ icon, caption, label, href, ariaLabel, rating, ratingCaption }: Props) => (
    <div className='flex items-center gap-4' data-animate='store-button'>
        <a
            href={href}
            target='_blank'
            rel='noopener noreferrer'
            aria-label={ariaLabel}
            className='flex w-[165px] shrink-0 items-center gap-2 rounded-xl border border-white/70 px-4 py-2 text-white transition hover:border-white hover:bg-white/15 dark:hover:bg-[#14111F]/15'
        >
            <span className='shrink-0'>{icon}</span>
            <span className='flex flex-col leading-tight'>
                <span className='text-[10px]'>{caption}</span>
                <span className='text-base font-bold'>{label}</span>
            </span>
        </a>
        <div className='flex flex-col leading-tight text-white'>
            <span className='flex items-center gap-1 font-bold'>
                <Star className='h-4 w-4 fill-current' aria-hidden='true' />
                {rating}
                <span className='text-xs font-normal text-white/70'>/5</span>
            </span>
            <span className='text-xs text-white/70'>{ratingCaption}</span>
        </div>
    </div>
);

export default StoreButton;
