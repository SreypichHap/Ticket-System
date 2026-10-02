import type { TicketZone } from '@/lib/types';
import TicketRow from './TicketRow';

type Props = { zone: TicketZone; selectHref: string; className?: string };

const TicketZoneGroup = ({ zone, selectHref, className = '' }: Props) => (
    <div data-animate='ticket-zone' className={className}>
        <h3 className='text-lg font-semibold'>{zone.title}</h3>
        <ul>
            {zone.tickets.map((t) => (
                <TicketRow key={t.id} ticket={t} selectHref={selectHref} />
            ))}
        </ul>
    </div>
);

export default TicketZoneGroup;
