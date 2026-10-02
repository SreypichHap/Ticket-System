'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { Photo } from '@/lib/types';

type Props = {
    photos: Photo[];
    open: boolean;
    index: number;
    onIndexChange: (index: number) => void;
    onClose: () => void;
    className?: string;
};

const BTN =
    'flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#1A1530] hover:bg-[#EDE7FB] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#EDE7FB]';

// showModal() makes the rest of the page inert (focus trap), closes on Esc and restores focus to the opener.
const GalleryLightbox = ({ photos, open, index, onIndexChange, onClose, className = '' }: Props) => {
    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = ref.current;
        if (!dialog) return;
        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();
    }, [open]);

    const step = (delta: number) => onIndexChange((index + delta + photos.length) % photos.length);
    const photo = photos[index];

    return (
        <dialog
            ref={ref}
            aria-label='Photo gallery'
            onClose={onClose}
            onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') step(-1);
                if (e.key === 'ArrowRight') step(1);
            }}
            onClick={(e) => e.target === ref.current && onClose()}
            className={`m-auto h-[90vh] w-[min(1100px,94vw)] max-w-none overflow-hidden rounded-3xl bg-[#1A1530] p-0 backdrop:bg-black/70 ${className}`}
        >
            {open && photo && (
                <div className='relative h-full w-full'>
                    <Image src={photo.src} alt={photo.alt} fill sizes='94vw' className='object-contain' />
                    <button type='button' autoFocus aria-label='Close gallery' onClick={onClose} className={`absolute right-4 top-4 ${BTN}`}>
                        <X size={20} aria-hidden='true' />
                    </button>
                    {photos.length > 1 && (
                        <>
                            <button type='button' aria-label='Previous photo' onClick={() => step(-1)} className={`absolute left-4 top-1/2 -translate-y-1/2 ${BTN}`}>
                                <ChevronLeft size={22} aria-hidden='true' />
                            </button>
                            <button type='button' aria-label='Next photo' onClick={() => step(1)} className={`absolute right-4 top-1/2 -translate-y-1/2 ${BTN}`}>
                                <ChevronRight size={22} aria-hidden='true' />
                            </button>
                        </>
                    )}
                    <p className='absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-sm font-medium text-white' aria-live='polite'>
                        {index + 1} / {photos.length}
                    </p>
                </div>
            )}
        </dialog>
    );
};

export default GalleryLightbox;
