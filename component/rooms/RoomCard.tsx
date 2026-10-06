'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ImageIcon } from 'lucide-react';
import type { Room } from '@/lib/types';
import GalleryLightbox from '../stay/GalleryLightbox';
import RoomAttributes from './RoomAttributes';
import RoomPerks from './RoomPerks';
import RoomPriceBox from './RoomPriceBox';
import { HEADING } from '../stay/fonts';

type Props = { room: Room; href: string; nights: number; priority?: boolean; className?: string };

const RoomCard = ({ room, href, nights, priority = false, className = '' }: Props) => {
    const [photosOpen, setPhotosOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);
    const dim = room.soldOut ? 'opacity-60' : '';
    const cover = room.images[0];

    return (
        <article
            data-state={room.soldOut ? 'sold-out' : 'default'}
            className={`flex flex-wrap overflow-hidden rounded-3xl bg-white border border-[#E7E2F3] ${className}`}
        >
            <div className={`relative aspect-[16/10] min-h-[220px] w-full bg-[#EDE7FB] md:aspect-auto md:flex-[0_0_300px] ${dim}`}>
                {cover && <Image src={cover.src} alt={cover.alt} fill sizes='(min-width: 768px) 300px, 100vw' priority={priority} className='object-cover' />}
                {room.images.length > 0 && (
                    <button
                        type='button'
                        onClick={() => {
                            setPhotoIndex(0);
                            setPhotosOpen(true);
                        }}
                        aria-label={`Show ${room.images.length} photos of ${room.name}`}
                        className='absolute bottom-3 right-3 flex min-h-11 items-center gap-1.5 rounded-lg bg-black/60 px-3 text-xs font-semibold text-white hover:bg-black/75 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60'
                    >
                        <ImageIcon size={14} aria-hidden='true' />
                        Photos
                    </button>
                )}
            </div>

            <div className={`flex flex-[1_1_300px] flex-col gap-3 px-6 py-[22px] ${dim}`}>
                <h3 className={`${HEADING} text-xl leading-tight text-[#1A1530]`}>{room.name}</h3>
                <RoomAttributes attributes={room.attributes} />
                <RoomPerks perks={room.perks} />
                <Link href={href}
                    className='mt-auto flex min-h-11 items-center self-start text-sm font-semibold text-[#5B21B6] hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#EDE7FB]'
                >
                    Room details ›
                </Link>
            </div>

            <RoomPriceBox room={room} nights={nights} href={href} />

            <GalleryLightbox photos={room.images} open={photosOpen} index={photoIndex} onIndexChange={setPhotoIndex} onClose={() => setPhotosOpen(false)} />
        </article>
    );
};

export default RoomCard;
