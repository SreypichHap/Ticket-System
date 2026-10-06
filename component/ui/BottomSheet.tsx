'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useEscapeKey } from '@/hooks/useEscapeKey';

type Props = {
    open: boolean;
    title: string;
    onClose: () => void;
    showClose?: boolean;
    children: ReactNode;
    // Animation slots: style via these or via the data-state="open" | "closed" attributes
    overlayClassName?: string;
    panelClassName?: string;
};

// Generic bottom sheet: overlay + panel + handle + title. Knows nothing about what it contains.
const BottomSheet = ({ open, title, onClose, showClose = false, children, overlayClassName = '', panelClassName = '' }: Props) => {
    const titleId = useId();
    const panelRef = useRef<HTMLDivElement>(null);
    const state = open ? 'open' : 'closed';

    useBodyScrollLock(open);
    useEscapeKey(open, onClose);

    // Focus moves into the sheet on open and returns to whatever opened it on close
    useEffect(() => {
        if (!open) return;
        const opener = document.activeElement as HTMLElement | null;
        panelRef.current?.focus();
        return () => opener?.focus();
    }, [open]);

    // To animate the exit, keep rendering after `open` turns false (data-state="closed") and unmount on transitionend / animationend.
    if (!open) return null;

    return (
        <>
            <div data-state={state} onClick={onClose} aria-hidden='true' className={`fixed inset-0 z-50 bg-black/50 ${overlayClassName}`} />
            <div
                ref={panelRef}
                role='dialog'
                aria-modal='true'
                aria-labelledby={titleId}
                tabIndex={-1}
                data-state={state}
                className={`fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[500px] rounded-t-3xl bg-white pb-[env(safe-area-inset-bottom)] focus:outline-none ${panelClassName}`}
            >
                <div className='mx-auto mt-3 h-[3px] w-8 rounded-full bg-[#D1CCDD]' aria-hidden='true' />
                <div className='relative border-b border-[#E7E2F3]'>
                    <h2 id={titleId} className='py-3.5 text-center text-base font-medium text-[#1A1530]'>
                        {title}
                    </h2>
                    {showClose && (
                        <button type='button' aria-label='Close' onClick={onClose} className='absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-[#1A1530] hover:bg-[#F6F4FB] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#EDE7FB]'>
                            <X size={20} aria-hidden='true' />
                        </button>
                    )}
                </div>
                {children}
            </div>
        </>
    );
};

export default BottomSheet;
