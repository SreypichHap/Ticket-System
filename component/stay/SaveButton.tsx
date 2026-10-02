'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

type Props = { className?: string };

const SaveButton = ({ className = '' }: Props) => {
    const [saved, setSaved] = useState(false);
    return (
        <button
            type='button'
            aria-pressed={saved}
            aria-label='Save this stay'
            onClick={() => setSaved((s) => !s)}
            className={`flex h-11 w-11 items-center justify-center rounded-full border border-[#E7E2F3] bg-white text-[#1A1530] hover:bg-[#EDE7FB] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#EDE7FB] ${className}`}
        >
            <Heart size={18} aria-hidden='true' className={saved ? 'fill-[#B4123A] text-[#B4123A]' : ''} />
        </button>
    );
};

export default SaveButton;
