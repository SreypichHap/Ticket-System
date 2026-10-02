'use client';

import type { ReactNode } from 'react';

type Props = { targetId: string; children: ReactNode; className?: string };

const ScrollToButton = ({ targetId, children, className = '' }: Props) => (
    <button
        type='button'
        className={className}
        onClick={() => {
            const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            document.getElementById(targetId)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        }}
    >
        {children}
    </button>
);

export default ScrollToButton;
