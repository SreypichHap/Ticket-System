import Image from 'next/image';
import Link from 'next/link';
import type { Ticket } from '@/lib/types';
import { formatTicketPrice } from '@/lib/format';
import { PRIMARY_BTN } from './styles';

type Props = { ticket: Ticket; selectHref: string; className?: string };

const TicketRow = ({ ticket, selectHref, className = '' }: Props) => {
    const { name, price, image, soldOut } = ticket;

    return (
        <li data-animate='ticket-row' className={`border-b border-black/10 dark:border-white/10 last:border-b-0 ${className}`}>
            {/* aria-disabled lives on a group: it isn't valid on a bare listitem */}
            <div role='group' aria-label={name} aria-disabled={soldOut || undefined} className='flex items-center gap-4 py-4'>
                <div className='relative size-16 shrink-0 overflow-hidden rounded-lg'>
                    <Image src={image} alt={name} fill sizes='64px' className={`object-cover ${soldOut ? 'opacity-60' : ''}`} />
                    {soldOut && (
                        // #D62B3E instead of #FF4D5E: white 10px text needs 4.5:1 contrast
                        <span className='absolute left-1/2 top-1/2 w-[130%] -translate-x-1/2 -translate-y-1/2 rotate-[-12deg] bg-[#D62B3E] py-0.5 text-center text-[10px] font-bold uppercase text-white'>
                            Sold out
                        </span>
                    )}
                </div>
                <div className='min-w-0 flex-1'>
                    <p className='font-medium'>{name}</p>
                    <p className='font-semibold'>{formatTicketPrice(price)}</p>
                </div>
                {!soldOut && (
                    // h-9 look with a 44px hit area from the pseudo-element
                    <Link href={selectHref} className={`${PRIMARY_BTN} relative h-9 px-5 text-sm after:absolute after:-inset-y-1 after:inset-x-0`}>
                        Select
                        <span className='sr-only'> {name}</span>
                    </Link>
                )}
            </div>
        </li>
    );
};

export default TicketRow;
