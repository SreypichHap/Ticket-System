'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { Room } from '@/lib/types';
import RoomAttributes from './RoomAttributes';
import { HEADING } from '../stay/fonts';

type Props = { room: Room; open: boolean; onClose: () => void; className?: string };

// A modal <dialog> sheet: bottom sheet on phones, centered card from sm up. Esc closes it and focus is trapped by the browser.
const RoomDetailsSheet = ({ room, open, onClose, className = '' }: Props) => {
    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = ref.current;
        if (!dialog) return;
        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();
    }, [open]);

    return (
        <dialog
            ref={ref}
            aria-labelledby={`room-${room.id}-details`}
            onClose={onClose}
            onClick={(e) => e.target === ref.current && onClose()}
            className={`m-auto mb-0 max-h-[85vh] w-full max-w-none overflow-y-auto rounded-t-3xl bg-white p-0 backdrop:bg-black/50 sm:mb-auto sm:w-[min(560px,94vw)] sm:rounded-3xl ${className}`}
        >
            {open && (
                <div className='flex flex-col gap-4 p-6'>
                    <div className='flex items-start justify-between gap-4'>
                        <h2 id={`room-${room.id}-details`} className={`${HEADING} text-[22px] text-[#1A1530]`}>
                            {room.name}
                        </h2>
                        <button
                            type='button'
                            autoFocus
                            aria-label='Close room details'
                            onClick={onClose}
                            className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#E7E2F3] text-[#1A1530] hover:bg-[#EDE7FB] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#EDE7FB]'
                        >
                            <X size={18} aria-hidden='true' />
                        </button>
                    </div>
                    <RoomAttributes attributes={room.attributes} />
                    {room.description && <p className='text-base leading-relaxed text-[#3F3A52]'>{room.description}</p>}
                    {room.amenities.length > 0 && (
                        <section>
                            <h3 className={`${HEADING} mb-2 text-base text-[#1A1530]`}>What this room offers</h3>
                            <ul className='grid gap-2 sm:grid-cols-2'>
                                {room.amenities.map((a) => (
                                    <li key={a} className='rounded-[14px] bg-[#F6F4FB] px-3 py-2.5 text-sm font-medium text-[#1A1530]'>
                                        {a}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>
            )}
        </dialog>
    );
};

export default RoomDetailsSheet;
