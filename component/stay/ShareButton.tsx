'use client';

import { useState } from 'react';
import { Check, Share2 } from 'lucide-react';

type Props = { title: string; className?: string };

const ShareButton = ({ title, className = '' }: Props) => {
    const [copied, setCopied] = useState(false);

    const share = async () => {
        const url = window.location.href;
        try {
            if (navigator.share) await navigator.share({ title, url });
            else {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        } catch {
            // share sheet dismissed or clipboard blocked
        }
    };

    return (
        <button
            type='button'
            onClick={share}
            aria-label={copied ? 'Link copied' : 'Share this stay'}
            className={`flex h-11 w-11 items-center justify-center rounded-full border border-[#E7E2F3] bg-white text-[#1A1530] hover:bg-[#EDE7FB] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#EDE7FB] ${className}`}
        >
            {copied ? <Check size={18} aria-hidden='true' /> : <Share2 size={18} aria-hidden='true' />}
        </button>
    );
};

export default ShareButton;
