import type { Room } from '@/lib/types';
import { formatPrice, plural } from '@/lib/stay-search';
import { HEADING } from '../stay/fonts';

type Props = { room: Room; nights: number; selected: boolean; onToggle: () => void; className?: string };

const RoomPriceBox = ({ room, nights, selected, onToggle, className = '' }: Props) => (
    <div className={`flex flex-col justify-end gap-2.5 border-t border-dashed border-[#DCD4EE] bg-[#FCFBFE] px-6 py-[22px] md:flex-[0_0_230px] md:border-l md:border-t-0 ${className}`}>
        {!room.soldOut && room.roomsLeft !== undefined && room.roomsLeft <= 3 && <p className='text-[13px] font-bold text-[#B4123A]'>Only {room.roomsLeft} left</p>}
        {room.pricePerNight > 0 && (
            <>
                <p>
                    <span className={`${HEADING} text-[30px] leading-none text-[#1A1530]`}>{formatPrice(room.pricePerNight, room.currency)}</span>
                    <span className='ml-1 text-sm text-[#5E5775]'>/ night</span>
                </p>
                <p className='text-[13px] text-[#5E5775]'>
                    {formatPrice(room.pricePerNight * nights, room.currency)} total for {plural(nights, 'night')}
                </p>
            </>
        )}
        {room.soldOut ? (
            <div className='flex min-h-12 items-center justify-center rounded-[14px] bg-[#EFECF5] px-3 text-center text-[15px] font-bold text-[#5E5775]'>Sold out for these dates</div>
        ) : (
            <button
                type='button'
                aria-pressed={selected}
                onClick={onToggle}
                className={`h-12 rounded-[14px] text-[15px] font-bold text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#DCD4EE] ${selected ? 'bg-[#0F6B63] hover:bg-[#0C5A53]' : 'bg-[#5B21B6] hover:bg-[#4C1D95]'}`}
            >
                {selected ? '✓ Selected' : 'Book'}
            </button>
        )}
    </div>
);

export default RoomPriceBox;
