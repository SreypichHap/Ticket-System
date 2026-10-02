'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';

type Props = {
    children: ReactNode;
    // Tailwind max-height for the collapsed state. max-h-24 = 4 lines at leading-6.
    collapsedClassName?: string;
    className?: string;
    moreLabel?: string;
    lessLabel?: string;
};

// Clamps its content and shows a See more / See less toggle, but only when the content actually overflows.
const ExpandableContent = ({ children, collapsedClassName = 'max-h-24', className = '', moreLabel = 'See more', lessLabel = 'See less' }: Props) => {
    const [expanded, setExpanded] = useState(false);
    const [overflowing, setOverflowing] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const id = useId();

    useEffect(() => {
        const el = ref.current;
        // Only measure while collapsed; once expanded the content fits, which would hide "See less".
        if (!el || expanded) return;
        const observer = new ResizeObserver(() => setOverflowing(el.scrollHeight > el.clientHeight + 1));
        observer.observe(el);
        return () => observer.disconnect();
    }, [expanded]);

    return (
        <div className={className}>
            <div id={id} ref={ref} data-expanded={expanded} className={`overflow-hidden ${expanded ? '' : collapsedClassName}`}>
                {children}
            </div>
            {(overflowing || expanded) && (
                <button
                    type='button'
                    aria-expanded={expanded}
                    aria-controls={id}
                    onClick={() => setExpanded((e) => !e)}
                    className='inline-flex min-h-11 items-center text-sm font-semibold text-[#5B3FD9] dark:text-[#927FE6] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B3FD9]'
                >
                    {expanded ? lessLabel : moreLabel}
                </button>
            )}
        </div>
    );
};

export default ExpandableContent;
