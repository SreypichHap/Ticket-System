import type { TicketZone } from '@/lib/types';
import TicketZoneGroup from './TicketZoneGroup';
import { CARD } from './styles';

type Props = { zones: TicketZone[]; selectHref: string; className?: string };

const TicketZoneList = ({ zones, selectHref, className = '' }: Props) => (
    <section id='tickets' aria-labelledby='tickets-title' data-animate='ticket-zone-list' className={`${CARD} scroll-mt-6 ${className}`}>
        <h2 id='tickets-title' className='sr-only'>
            Tickets
        </h2>
        {zones.map((zone, i) => (
            <TicketZoneGroup key={zone.id} zone={zone} selectHref={selectHref} className={i > 0 ? 'mt-8' : ''} />
        ))}
    </section>
);

export default TicketZoneList;
