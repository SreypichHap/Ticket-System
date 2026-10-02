import { formatTicketPrice } from '@/lib/format';
import type { BookingItem } from '@/lib/booking';
import { MUTED, TILE } from './styles';

type Props = { item: BookingItem; className?: string };

const TicketStubLine = ({ item, className = '' }: Props) => {
    const { name, zone, qty, unitPrice } = item;

    return (
        <div data-animate='ticket-stub-line' className={`${TILE} flex items-center justify-between gap-3 ${className}`}>
            <div className='min-w-0'>
                <p className='font-bold'>
                    {name}
                    {name.toLowerCase().includes(zone.toLowerCase()) ? '' : ` · ${zone}`}
                </p>
                <p className={`text-sm ${MUTED}`}>
                    {qty} × {formatTicketPrice(unitPrice)}
                </p>
            </div>
            <p className='shrink-0 text-lg font-extrabold'>{formatTicketPrice(qty * unitPrice)}</p>
        </div>
    );
};

export default TicketStubLine;
