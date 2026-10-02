import { HEADING } from './fonts';
import { formatPrice } from './format';
import type { Ticket } from './types';

export type OrderLine = { ticket: Ticket; quantity: number };

type Props = {
    lines: OrderLine[];
    total: number;
    totalQuantity: number;
    // Booking is being placed: the button is locked and says so
    loading?: boolean;
    error?: string | null;
    onCheckout?: () => void;
    className?: string;
};

const money = (n: number) => `$${n.toFixed(2)}`;

const OrderSummary = ({ lines, total, totalQuantity, loading = false, error, onCheckout, className = '' }: Props) => (
    <aside aria-label='Order summary' data-animate='order-summary' className={`rounded-[24px] border border-[#E7E2F3] dark:border-[#362F47] bg-white dark:bg-[#14111F] p-6 ${className}`}>
        <h2 className={`${HEADING} text-2xl text-[#1A1530] dark:text-[#E7E5F3]`}>Order summary</h2>
        {lines.length === 0 ? (
            <p className='mt-4 text-base text-[#5E5775] dark:text-[#C3BFCF]'>No tickets selected yet.</p>
        ) : (
            <ul className='mt-4 flex flex-col gap-4'>
                {lines.map(({ ticket, quantity }) => (
                    <li key={ticket.id} data-animate='order-line' className='flex items-start justify-between gap-3'>
                        <div className='min-w-0'>
                            <p className='text-base font-bold text-[#1A1530] dark:text-[#E7E5F3]'>{ticket.name}</p>
                            <p className='text-sm text-[#5E5775] dark:text-[#C3BFCF]'>
                                {ticket.zone} · {quantity} × {formatPrice(ticket.price)}
                            </p>
                        </div>
                        <p className='shrink-0 text-base font-bold text-[#1A1530] dark:text-[#E7E5F3]'>{formatPrice(ticket.price * quantity)}</p>
                    </li>
                ))}
            </ul>
        )}
        <hr className='my-5 border-t border-dashed border-[#E7E2F3] dark:border-[#362F47]' />
        <div className='flex items-baseline justify-between'>
            <span className='text-base font-medium text-[#1A1530] dark:text-[#E7E5F3]'>Total</span>
            <span data-animate='order-total' className={`${HEADING} text-4xl leading-none text-[#1A1530] dark:text-[#E7E5F3]`}>
                {money(total)}
            </span>
        </div>
        <button
            type='button'
            disabled={totalQuantity === 0 || loading}
            aria-busy={loading}
            onClick={onCheckout}
            className='mt-6 min-h-12 w-full rounded-full bg-[#5B21B6] px-6 text-base font-bold text-white transition-colors hover:bg-[#4C1A9A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B21B6] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#CFC6E4] dark:disabled:bg-[#272231] disabled:hover:bg-[#CFC6E4] dark:disabled:hover:bg-[#272231]'
        >
            {loading ? 'Placing booking…' : `Checkout · ${totalQuantity} ${totalQuantity === 1 ? 'ticket' : 'tickets'}`}
        </button>
        {error && (
            <p role='alert' className='mt-3 text-sm text-[#B4123A] dark:text-[#F59CB2]'>
                {error}
            </p>
        )}
    </aside>
);

export default OrderSummary;
