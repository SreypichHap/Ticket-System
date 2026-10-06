'use client';

import { useState } from 'react';
import { Check, ConciergeBell, LayoutGrid, Shirt, Sparkles, Tv, type LucideIcon } from 'lucide-react';
import type { FacilityGroup } from '@/lib/types';

type Props = { group: FacilityGroup; className?: string };

const COLLAPSED = 5;

// Icons for the API's facility groups (option types); any other group gets the sparkles icon
const GROUP_ICONS: Record<string, LucideIcon> = { entertainments: Tv, 'layout-and-furnishings': LayoutGrid, comforts: Sparkles, 'clothing-laundry': Shirt, 'service-conviniences': ConciergeBell };

// On phones the list stops after 5 items behind a "Show n more" button; from md up every item shows.
const FacilityColumn = ({ group, className = '' }: Props) => {
    const [expanded, setExpanded] = useState(false);
    const hidden = group.items.length - COLLAPSED;
    const Icon = GROUP_ICONS[group.id] ?? Sparkles;

    return (
        <div className={className}>
            <h3 className='mb-3 flex items-center gap-2 border-b-2 border-[#EDE7FB] pb-3 text-sm font-semibold text-[#1A1530]'>
                <Icon size={18} aria-hidden='true' className='text-[#5B21B6]' />
                {group.name}
            </h3>
            <ul className='flex flex-col gap-2.5'>
                {group.items.map((item, i) => (
                    <li key={item} className={`flex items-start gap-2 text-sm leading-snug text-[#3F3A52] ${!expanded && i >= COLLAPSED ? 'max-md:hidden' : ''}`}>
                        <Check size={15} aria-hidden='true' className='mt-0.5 shrink-0 text-[#0F6B63]' />
                        {item}
                    </li>
                ))}
            </ul>
            {hidden > 0 && (
                <button
                    type='button'
                    aria-expanded={expanded}
                    onClick={() => setExpanded((e) => !e)}
                    className='mt-1 min-h-11 text-sm font-semibold text-[#5B21B6] hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#EDE7FB] md:hidden'
                >
                    {expanded ? 'Show less' : `Show ${hidden} more`}
                </button>
            )}
        </div>
    );
};

export default FacilityColumn;
