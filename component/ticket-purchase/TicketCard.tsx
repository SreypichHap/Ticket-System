import Image from 'next/image';
import { MapPin } from 'lucide-react';
import QuantityStepper from './QuantityStepper';
import { HEADING } from './fonts';
import { formatPrice } from './format';
import type { Ticket } from './types';

type Props = {
    ticket: Ticket;
    imageSrc: string;
    quantity: number;
    max: number;
    onQuantityChange: (id: string, quantity: number) => void;
    className?: string;
};

// Stub width is a CSS variable so the notch offset (stub - 11px) tracks it at every breakpoint.
const TicketCard = ({ ticket, imageSrc, quantity, max, onQuantityChange, className = '' }: Props) => {
    const { id, name, zone, venue, price, vip } = ticket;
    const selected = quantity > 0;
    const notch = `absolute z-10 h-[22px] w-[22px] rounded-full border left-[calc(var(--stub)-11px)] border-[#E7E2F3] dark:border-[#362F47]`;

    return (
        <article
            data-animate='ticket-card'
            data-selected={selected}
            className={`relative flex min-h-[140px] overflow-hidden rounded-[20px] border border-[#E7E2F3] dark:border-[#362F47] bg-white dark:bg-[#14111F] [--stub:140px] sm:[--stub:240px] ${className}`}
        >
            <div className='relative w-[var(--stub)] shrink-0 self-stretch border-r border-dashed border-[#E7E2F3] dark:border-[#362F47] bg-[#E7E2F3] dark:bg-[#1D1A27]'>
                <Image src={imageSrc} alt='' fill sizes='(min-width: 640px) 240px, 140px' className='object-cover' />
            </div>
            <span aria-hidden='true' className={`bg-[var(--ticket-page-bg)] ${notch} -top-[11px]`} />
            <span aria-hidden='true' className={`bg-[var(--ticket-page-bg)] ${notch} -bottom-[11px]`} />
            <div className='flex min-w-0 flex-1 flex-col justify-between gap-4 px-5 py-5 sm:px-7 sm:py-6'>
                <div className='min-w-0'>
                    <div className='flex flex-wrap items-center gap-2'>
                        <h3 className='text-[17px] font-bold leading-tight text-[#1A1530] dark:text-[#E7E5F3]'>{name}</h3>
                        <span className={`rounded-full px-3 py-1.5 text-sm font-bold ${vip ? 'bg-[#F5C451] text-[#1A1530] dark:text-[#E7E5F3]' : 'bg-[rgba(13,10,26,0.72)] text-white'}`}>
                            {vip ? `VIP · ${zone.toUpperCase()}` : zone.toUpperCase()}
                        </span>
                    </div>
                    <p className='mt-1.5 flex items-center gap-1.5 text-sm text-[#5E5775] dark:text-[#C3BFCF]'>
                        <MapPin size={14} className='shrink-0' aria-hidden='true' />
                        <span className='truncate'>{venue}</span>
                    </p>
                </div>
                <div className='flex flex-wrap items-center justify-between gap-3'>
                    <p className={`${HEADING} text-2xl text-[#1A1530] dark:text-[#E7E5F3]`}>{formatPrice(price)}</p>
                    <QuantityStepper value={quantity} max={max} label={name} selected={selected} onChange={(q) => onQuantityChange(id, q)} />
                </div>
            </div>
        </article>
    );
};

export default TicketCard;
