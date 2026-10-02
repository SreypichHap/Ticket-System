'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageIcon, Zap } from 'lucide-react';
import type { Room } from '@/lib/types';
import GalleryLightbox from '../stay/GalleryLightbox';
import RoomAttributes from './RoomAttributes';
import RoomPerks from './RoomPerks';
import RoomPriceBox from './RoomPriceBox';
import RoomDetailsSheet from './RoomDetailsSheet';
import { HEADING } from '../stay/fonts';

type Props = { room: Room; nights: number; selected: boolean; onToggle: () => void; priority?: boolean; className?: string };

const RoomCard = ({ room, nights, selected, onToggle, priority = false, className = '' }: Props) => {
    const [photosOpen, setPhotosOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const dim = room.soldOut ? 'opacity-60' : '';
    const cover = room.images[0];

    return (
        <article
            data-state={room.soldOut ? 'sold-out' : selected ? 'selected' : 'default'}
            className={`flex flex-wrap overflow-hidden rounded-3xl bg-white ${selected ? 'border-2 border-[#5B21B6] ring-[5px] ring-[#EDE7FB]' : 'border border-[#E7E2F3]'} ${className}`}
        >
            <div className={`relative aspect-[16/10] min-h-[220px] w-full bg-[#EDE7FB] md:aspect-auto md:flex-[0_0_300px] ${dim}`}>
                {cover && <Image src={cover.src} alt={cover.alt} fill sizes='(min-width: 768px) 300px, 100vw' priority={priority} className='object-cover' />}
                {room.instantBooking && (
                    <span className='absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-[#0F6B63] shadow-[0_2px_8px_rgba(13,10,26,.2)]'>
                        <Zap size={13} aria-hidden='true' />
                        Instant booking
                    </span>
                )}
                {room.images.length > 0 && (
                    <button
                        type='button'
                        onClick={() => {
                            setPhotoIndex(0);
                            setPhotosOpen(true);
                        }}
                        aria-label={`Show ${room.images.length} photos of ${room.name}`}
                        className='absolute bottom-3 right-3 flex min-h-11 items-center gap-1.5 rounded-lg bg-black/60 px-3 text-xs font-bold text-white hover:bg-black/75 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60'
                    >
                        <ImageIcon size={14} aria-hidden='true' />
                        Photos
                    </button>
                )}
            </div>

            <div className={`flex flex-[1_1_300px] flex-col gap-3 px-6 py-[22px] ${dim}`}>
                <h3 className={`${HEADING} text-[22px] leading-tight text-[#1A1530]`}>{room.name}</h3>
                <RoomAttributes attributes={room.attributes} />
                <RoomPerks perks={room.perks} />
                <button
                    type='button'
                    onClick={() => setDetailsOpen(true)}
                    className='mt-auto min-h-11 self-start text-[15px] font-bold text-[#5B21B6] hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#EDE7FB]'
                >
                    Room details ›
                </button>
            </div>

            <RoomPriceBox room={room} nights={nights} selected={selected} onToggle={onToggle} />

            <GalleryLightbox photos={room.images} open={photosOpen} index={photoIndex} onIndexChange={setPhotoIndex} onClose={() => setPhotosOpen(false)} />
            <RoomDetailsSheet room={room} open={detailsOpen} onClose={() => setDetailsOpen(false)} />
        </article>
    );
};

export default RoomCard;
