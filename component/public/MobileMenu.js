'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

// Mobile-only (below md): hamburger button; the menu drops down from the top over a blurred backdrop.
const MobileMenu = ({ links, authLinks, className = '' }) => {
    const [open, setOpen] = useState(false);
    const closeRef = useRef(null);
    const openRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === 'Escape' && setOpen(false);
        // Close when the viewport grows to desktop width so the page does not stay locked
        const mq = window.matchMedia('(min-width: 768px)');
        const onChange = () => mq.matches && setOpen(false);
        document.addEventListener('keydown', onKey);
        mq.addEventListener('change', onChange);
        document.body.style.overflow = 'hidden';
        closeRef.current?.focus();
        const opener = openRef.current;
        return () => {
            document.removeEventListener('keydown', onKey);
            mq.removeEventListener('change', onChange);
            document.body.style.overflow = '';
            opener?.focus();
        };
    }, [open]);

    return (
        <div className={`md:hidden ${className}`}>
            <button
                ref={openRef}
                type='button'
                aria-label='Open menu'
                aria-expanded={open}
                aria-controls='mobile-menu'
                onClick={() => setOpen(true)}
                className='flex h-11 w-11 items-center justify-center rounded-full text-[#1E1B3A] dark:text-[#E1DFF0] hover:bg-[#F1EDFB] dark:hover:bg-[#181325] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#EDE7FB] dark:focus-visible:ring-[#31254C]'
            >
                <Menu size={26} aria-hidden='true' />
            </button>

            {/* Blurred backdrop: tap to close */}
            <div
                aria-hidden='true'
                onClick={() => setOpen(false)}
                className={`fixed inset-0 z-40 bg-[#1A1530]/30 backdrop-blur-sm motion-safe:transition-opacity motion-safe:duration-300 ${
                    open ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
            />

            {/* Menu panel from the top */}
            <nav
                id='mobile-menu'
                aria-label='Main menu'
                inert={!open}
                className={`fixed inset-x-0 top-0 z-50 rounded-b-3xl bg-white dark:bg-[#14111F] px-4 pb-6 pt-4 shadow-[0_12px_32px_rgba(26,21,48,0.18)] motion-safe:transition-transform motion-safe:duration-300 ${
                    open ? 'translate-y-0' : '-translate-y-full'
                }`}
            >
                <div className='flex items-center justify-between'>
                    <span className='text-lg font-semibold text-[#1E1B3A] dark:text-[#E1DFF0]'>Menu</span>
                    <button
                        ref={closeRef}
                        type='button'
                        aria-label='Close menu'
                        onClick={() => setOpen(false)}
                        className='flex h-11 w-11 items-center justify-center rounded-full text-[#1E1B3A] dark:text-[#E1DFF0] hover:bg-[#F1EDFB] dark:hover:bg-[#181325] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#EDE7FB] dark:focus-visible:ring-[#31254C]'
                    >
                        <X size={26} aria-hidden='true' />
                    </button>
                </div>

                <ul className='mt-2 flex flex-col'>
                    {links.map(({ label, href }) => (
                        <li key={label}>
                            <Link href={href} onClick={() => setOpen(false)} className='block rounded-xl px-3 py-3 text-base font-medium text-[#1E1B3A] dark:text-[#E1DFF0] hover:bg-[#F1EDFB] dark:hover:bg-[#181325] hover:text-[#6C4BE0] dark:hover:text-[#947CE9]'>
                                {label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className='mt-4 flex gap-3 border-t border-[#6C4BE0]/10 pt-4'>
                    {authLinks.map(({ label, href, primary }) => (
                        <Link
                            key={label}
                            href={href}
                            onClick={() => setOpen(false)}
                            className={`flex-1 rounded-full px-5 py-3 text-center font-medium ${
                                primary
                                    ? 'bg-[#6C4BE0] text-white shadow-md shadow-[#6C4BE0]/30'
                                    : 'border border-[#6C4BE0]/30 text-[#1E1B3A] dark:text-[#E1DFF0]'
                            }`}
                        >
                            {label}
                        </Link>
                    ))}
                </div>
            </nav>
        </div>
    );
};

export default MobileMenu;
