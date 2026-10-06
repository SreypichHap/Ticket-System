import { formatPrice } from '@/lib/stay-search';
import { HEADING } from '../stay/fonts';

type Props = { name: string; roomType: string; pricePerNight: number; currency: string; className?: string };

const RoomTitleCard = ({ name, roomType, pricePerNight, currency, className = '' }: Props) => (
    <section className={`flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#E7E2F3] bg-white px-7 py-6 ${className}`}>
        <div className='min-w-0'>
            {roomType && <span className='inline-block rounded-full bg-[#EDE7FB] px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-[#3B0F86]'>{roomType}</span>}
            <h1 className={`${HEADING} mt-2.5 text-2xl leading-tight text-[#1A1530] md:text-[32px]`}>{name}</h1>
        </div>
        {pricePerNight > 0 && (
            <div className='rounded-[18px] bg-[#F6F4FB] px-5 py-3.5 text-right'>
                <p className='text-xs text-[#5E5775]'>Price</p>
                <p>
                    <span className={`${HEADING} text-2xl leading-none text-[#1A1530]`}>{formatPrice(pricePerNight, currency, 2)}</span>
                    <span className='ml-1 text-sm text-[#5E5775]'>/ night</span>
                </p>
            </div>
        )}
    </section>
);

export default RoomTitleCard;
