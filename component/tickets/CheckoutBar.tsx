import { PAGE_CONTAINER } from '../layout';
import Button from '../common/Button';

type Props = {
    totalQuantity: number;
    totalPrice: number;
    currency?: string;
    onContinue?: () => void;
    disabled?: boolean;
    buttonLabel?: string;
};

// Floating summary bar. Renders nothing until at least one ticket is selected.
const CheckoutBar = ({ totalQuantity, totalPrice, currency = 'USD', onContinue, disabled = false, buttonLabel = 'Continue' }: Props) => {
    if (totalQuantity <= 0) return null;

    const price = totalPrice === 0 ? 'Free' : new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(totalPrice);

    return (
        // Fixed full-width shell; the inner container gives the bar the same width and margins as the rest of the page
        <div data-animate='checkout-bar' className='pointer-events-none fixed inset-x-0 bottom-0 z-40'>
            <div className={PAGE_CONTAINER}>
                <div className='pointer-events-auto flex items-center justify-between gap-4 rounded-t-2xl bg-[#FDF9FF] dark:bg-[#1C0D23] px-6 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-5 shadow-[0_-4px_24px_rgba(108,75,224,0.08)]'>
                    <div>
                        <p className='text-[13px] text-[#2B2B2B] dark:text-[#E3E0EE]'>
                            {totalQuantity} {totalQuantity === 1 ? 'Ticket' : 'Tickets'}
                        </p>
                        <p className='text-[15px] text-[#2B2B2B] dark:text-[#E3E0EE]'>{price}</p>
                    </div>
                    <Button onClick={onContinue} disabled={disabled}>
                        {buttonLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutBar;
