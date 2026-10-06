'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Photo } from '@/lib/types';
import BackButton from './BackButton';
import GalleryLightbox from './GalleryLightbox';
import { HEADING } from './fonts';

type Props = { photos: Photo[]; backHref?: string; className?: string; tileClassName?: string };

const FOCUS = 'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#5B21B6]';

const PhotoGallery = ({ photos, backHref, className = '', tileClassName = '' }: Props) => {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);
    const [slide, setSlide] = useState(0);
    const total = photos.length;
    if (total === 0) return null;

    const show = (i: number) => {
        setIndex(i);
        setOpen(true);
    };
    const tile = `relative overflow-hidden bg-[#EDE7FB] ${tileClassName}`;
    const side = photos.slice(1, 5);
    const more = total - 5;

    return (
        <div className={`relative overflow-hidden rounded-[28px] ${className}`}>
            <BackButton href={backHref} />

            {/* Mobile: one full-width swipeable carousel */}
            <div
                className='relative md:hidden'
            >
                <div
                    className='flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
                    onScroll={(e) => setSlide(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
                >
                    {photos.map((photo, i) => (
                        <button key={`${i}-${photo.src}`} type='button' onClick={() => show(i)} aria-label={`Open photo ${i + 1} of ${total}`} className={`${tile} aspect-[4/3] w-full shrink-0 snap-start ${FOCUS}`}>
                            <Image src={photo.src} alt={photo.alt} fill sizes='100vw' priority={i === 0} className='object-cover' />
                        </button>
                    ))}
                </div>
                <p className='pointer-events-none absolute bottom-4 right-4 rounded-full bg-black/70 px-3 py-1 text-sm font-semibold text-white' aria-hidden='true'>
                    {slide + 1} / {total}
                </p>
            </div>

            {/* Desktop: hero + 2x2 grid */}
            <div className={`hidden gap-2 md:grid md:grid-rows-[216px_216px] ${total === 1 ? '' : total <= 4 ? 'md:grid-cols-[2fr_1fr]' : 'md:grid-cols-[2fr_1fr_1fr]'}`}>
                <div className={`${tile} ${total > 1 ? 'row-span-2' : 'row-span-2 min-h-[432px]'}`}>
                    <button type='button' onClick={() => show(0)} aria-label='Open photo 1' className={`absolute inset-0 ${FOCUS}`}>
                        <Image src={photos[0].src} alt={photos[0].alt} fill sizes='(min-width: 1180px) 600px, 50vw' priority className='object-cover' />
                    </button>
                </div>
                {side.map((photo, i) => {
                    const isMore = i === 3 && more > 0;
                    return (
                        <button key={`${i}-${photo.src}`} type='button' onClick={() => show(i + 1)} aria-label={isMore ? `Show ${more} more photos` : `Open photo ${i + 2}`} className={`${tile} ${FOCUS}`}>
                            <Image src={photo.src} alt={photo.alt} fill sizes='300px' className='object-cover' />
                            {isMore && (
                                <span className='absolute inset-0 flex flex-col items-center justify-center bg-black/45 text-white'>
                                    <span className={`${HEADING} text-2xl leading-none`}>+{more}</span>
                                    <span className='text-sm font-medium'>more photos</span>
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            <GalleryLightbox photos={photos} open={open} index={index} onIndexChange={setIndex} onClose={() => setOpen(false)} />
        </div>
    );
};

export default PhotoGallery;
