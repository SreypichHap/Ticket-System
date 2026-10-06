'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

type Props = {
    // Where "back" goes. Without it the button steps back in the browser history.
    href?: string;
    className?: string;
};

const BackButton = ({ href, className = '' }: Props) => {
    const router = useRouter();
    const classes = `absolute left-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#1A1530] shadow-[0_2px_8px_rgba(13,10,26,.25)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#EDE7FB] ${className}`;

    if (href) {
        return (
            <Link href={href} aria-label='Go back' className={classes}>
                <ArrowLeft size={20} aria-hidden='true' />
            </Link>
        );
    }
    return (
        <button type='button' aria-label='Go back' onClick={() => router.back()} className={classes}>
            <ArrowLeft size={20} aria-hidden='true' />
        </button>
    );
};

export default BackButton;
