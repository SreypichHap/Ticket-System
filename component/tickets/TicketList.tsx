'use client';

import TicketCard from './TicketCard';
import type { Ticket } from './tickets';

// Sits inside the page's PAGE_CONTAINER (see ../layout.ts), inset by px-3.5 like the tabs.
type Props = {
    tickets: Ticket[];
    quantities: Record<string, number>;
    onQuantityChange: (id: string, quantity: number) => void;
};

// Controlled: the page owns the quantities so the checkout bar can read them too.
const TicketList = ({ tickets, quantities, onQuantityChange }: Props) => {
    return (
        <section aria-labelledby='ticket-type-title' className='px-3.5'>
            <h2 id='ticket-type-title' className='mb-4 mt-10 text-2xl text-[#2B2B2B] dark:text-[#E3E0EE]'>
                Ticket Type
            </h2>
            <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
                {tickets.map((t) => (
                    <TicketCard key={t.id} {...t} quantity={quantities[t.id] ?? 0} onQuantityChange={onQuantityChange} />
                ))}
            </div>
        </section>
    );
};

export default TicketList;
