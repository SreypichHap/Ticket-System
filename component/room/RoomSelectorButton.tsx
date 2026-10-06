'use client';

import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

type Props = { value: number; onClick: () => void; className?: string };

const RoomSelectorButton = forwardRef<HTMLButtonElement, Props>(({ value, onClick, className = '' }, ref) => (
    <button
        ref={ref}
        type='button'
        onClick={onClick}
        aria-haspopup='dialog'
        className={`flex min-h-[58px] items-center justify-center gap-2 rounded-full border border-[#DCD4EE] bg-white px-6 text-base font-semibold text-[#5B3FD9] hover:bg-[#F6F4FB] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#EDE7FB] ${className}`}
    >
        <ChevronDown size={20} aria-hidden='true' />
        {value} {value === 1 ? 'Room' : 'Rooms'}
    </button>
));
RoomSelectorButton.displayName = 'RoomSelectorButton';

export default RoomSelectorButton;
