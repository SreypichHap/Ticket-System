'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

type Props = { className?: string };

const BackButton = ({ className = '' }: Props) => {
    const router = useRouter();
    return (
        <button
            type='button'
            aria-label='Go back'
            onClick={() => router.back()}
            className={`absolute left-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#1A1530] shadow-[0_2px_8px_rgba(13,10,26,.25)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#EDE7FB] ${className}`}
        >
            <ArrowLeft size={20} aria-hidden='true' />
        </button>
    );
};

export default BackButton;
