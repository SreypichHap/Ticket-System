'use client';

import BottomSheet from '../ui/BottomSheet';

type Props = { open: boolean; value: number; max: number; onSelect: (n: number) => void; onClose: () => void };

const RoomQuantitySheet = ({ open, value, max, onSelect, onClose }: Props) => (
    <BottomSheet open={open} title='Quantity' onClose={onClose}>
        <ul className='max-h-[60vh] overflow-y-auto py-1'>
            {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
                <li key={n}>
                    <button
                        type='button'
                        aria-pressed={n === value}
                        onClick={() => onSelect(n)}
                        className={`w-full py-3 text-center text-base text-[#5B3FD9] hover:bg-[#F6F4FB] focus-visible:bg-[#F3EEFE] focus-visible:outline-none ${n === value ? 'bg-[#F3EEFE] font-semibold' : ''}`}
                    >
                        {n} {n === 1 ? 'Room' : 'Rooms'}
                    </button>
                </li>
            ))}
        </ul>
    </BottomSheet>
);

export default RoomQuantitySheet;
