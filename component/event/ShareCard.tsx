'use client';

import { useSyncExternalStore } from 'react';
import { FaFacebookF, FaLinkedinIn, FaTelegram, FaXTwitter } from 'react-icons/fa6';
import { CARD, CARD_TITLE, ICON_BTN } from './styles';

type Props = { title: string; className?: string };

const noopSubscribe = () => () => {};
// Current page URL; empty during SSR so the first client render matches the server
const usePageUrl = () => useSyncExternalStore(noopSubscribe, () => window.location.href, () => '');

const ShareCard = ({ title, className = '' }: Props) => {
    const url = encodeURIComponent(usePageUrl());
    const text = encodeURIComponent(title);

    const targets = [
        { name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${url}`, Icon: FaFacebookF },
        { name: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`, Icon: FaLinkedinIn },
        { name: 'Telegram', href: `https://t.me/share/url?url=${url}&text=${text}`, Icon: FaTelegram },
        { name: 'X', href: `https://twitter.com/intent/tweet?url=${url}&text=${text}`, Icon: FaXTwitter },
    ];

    return (
        <section data-animate='share-card' className={`${CARD} ${className}`}>
            <h2 className={`${CARD_TITLE} mb-3`}>Share with</h2>
            <div className='flex gap-3'>
                {targets.map(({ name, href, Icon }) => (
                    <a
                        key={name}
                        href={href}
                        target='_blank'
                        rel='noopener noreferrer'
                        aria-label={`Share on ${name}`}
                        className={`${ICON_BTN} bg-white dark:bg-[#14111F] text-[#1A1530] dark:text-[#E7E5F3] hover:bg-[#E0DEEA] dark:hover:bg-[#1D192E]`}
                    >
                        <Icon size={18} aria-hidden='true' />
                    </a>
                ))}
            </div>
        </section>
    );
};

export default ShareCard;
