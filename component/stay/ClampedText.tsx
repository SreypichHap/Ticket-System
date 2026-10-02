'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type Props = { children: ReactNode; className?: string };

// Clamps its content to 4 lines; the toggle only appears when the content is actually longer.
const ClampedText = ({ children, className = '' }: Props) => {
    const ref = useRef<HTMLDivElement>(null);
    const [expanded, setExpanded] = useState(false);
    const [overflows, setOverflows] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const measure = () => {
            if (!expanded) setOverflows(el.scrollHeight > el.clientHeight + 1);
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(el);
        return () => observer.disconnect();
    }, [expanded]);

    return (
        <div className={className}>
            {/* 4 lines of 16px / leading-relaxed (1.625) plus the 10px gaps between paragraphs are clamped by max-height */}
            <div ref={ref} className={`flex flex-col gap-2.5 overflow-hidden ${expanded ? '' : 'max-h-[calc(4*1.625*16px)]'}`}>
                {children}
            </div>
            {(overflows || expanded) && (
                <button
                    type='button'
                    aria-expanded={expanded}
                    onClick={() => setExpanded((e) => !e)}
                    className='mt-1 min-h-11 text-[15px] font-bold text-[#5B21B6] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#EDE7FB]'
                >
                    {expanded ? 'Show less' : 'Read more'}
                </button>
            )}
        </div>
    );
};

export default ClampedText;
