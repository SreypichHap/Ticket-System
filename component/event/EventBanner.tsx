'use client';

import { useState } from 'react';
import Image, { type StaticImageData } from 'next/image';

type Props = {
    cover?: string | StaticImageData;
    avatar?: string | StaticImageData;
    showBack?: boolean;
    title: string;
    subtitle?: string;
};

const EventBanner = ({ cover, avatar, title, subtitle, showBack = true }: Props) => {
    const [coverFailed, setCoverFailed] = useState(false);
    const [avatarFailed, setAvatarFailed] = useState(false);

    return (
        // The gradient shows whenever the cover is missing or fails to load
        <div className='relative h-[220px] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-violet-900 sm:h-[320px]'>
            {cover && !coverFailed && (
                <Image src={cover} alt={title} fill priority sizes='(min-width: 1440px) 1440px, 100vw' className='object-cover' onError={() => setCoverFailed(true)} />
            )}
            <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent' />
            {showBack && (
            <button
                type='button'
                onClick={() => window.history.back()}
                aria-label='Go back'
                className='absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white dark:bg-[#14111F] text-[#1A1530] dark:text-[#E7E5F3] shadow-[0_2px_8px_rgba(13,10,26,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B21B6]'
            >
                <svg viewBox='0 0 24 24' className='h-5 w-5' fill='none' stroke='currentColor' strokeWidth='2' aria-hidden='true'>
                    <path d='M19 12H5M12 19l-7-7 7-7' strokeLinecap='round' strokeLinejoin='round' />
                </svg>
            </button>
            )}
            <div className='absolute bottom-3 left-3.5 flex items-center gap-3 text-white'>
                {avatar && !avatarFailed && (
                    <div className='relative h-[50px] w-[50px] overflow-hidden rounded-full border-6 border-white'>
                        <Image src={avatar} alt='' fill sizes='50px' className='object-cover' onError={() => setAvatarFailed(true)} />
                    </div>
                )}
                <div>
                    <p className='text-sm font-medium'>{title}</p>
                    {subtitle && <p className='text-xs'>{subtitle}</p>}
                </div>
            </div>
        </div>
    );
};

export default EventBanner;
