'use client';

import { useState } from 'react';
import { Tag, X } from 'lucide-react';
import { applyCoupon, removeCoupon, type CouponResult } from './bookingApi';
import { formatTicketPrice } from '@/lib/format';
import FieldError from './FieldError';
import { FIELD, FIELD_ERROR, FOCUS_RING, MUTED } from './styles';

type Props = { coupon: { code: string; discount: number } | null; onChange: (result: CouponResult) => void; className?: string };

const CouponCard = ({ coupon, onChange, className = '' }: Props) => {
    const [open, setOpen] = useState(false);
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    // The API decides whether a code is valid
    const apply = async () => {
        if (!code.trim() || busy) return;
        setBusy(true);
        try {
            const result = await applyCoupon(code);
            if (!result) return setError('This coupon code is not valid');
            onChange(result);
            setCode('');
            setError('');
            setOpen(false);
        } catch {
            setError('Could not apply the coupon. Please try again.');
        } finally {
            setBusy(false);
        }
    };

    const remove = async () => {
        if (busy) return;
        setBusy(true);
        try {
            onChange(await removeCoupon());
        } catch {
            setError('Could not remove the coupon. Please try again.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <section data-animate='coupon-card' data-state={open ? 'open' : 'closed'} aria-label='Coupon' className={`rounded-3xl border border-dashed border-[#CFC7E3] dark:border-[#3F394F] bg-white dark:bg-[#14111F] p-6 ${className}`}>
            <div className='flex items-center gap-4'>
                <span className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#EDE7FB] dark:bg-[#191328] text-[#5B21B6] dark:text-[#BB9BED]'>
                    <Tag size={20} aria-hidden='true' />
                </span>
                <div className='min-w-0 flex-1'>
                    <p className='font-bold'>Have a coupon?</p>
                    <p className={`text-sm ${MUTED}`}>Apply it before you reserve.</p>
                </div>
                {coupon ? (
                    <span className='inline-flex items-center gap-1 rounded-full bg-[#EDE7FB] dark:bg-[#191328] py-1 pl-3 pr-1 text-sm font-bold text-[#5B21B6] dark:text-[#BB9BED]'>
                        {coupon.code} (-{formatTicketPrice(coupon.discount)})
                        <button type='button' onClick={remove} aria-label='Remove coupon' className={`flex size-11 items-center justify-center rounded-full hover:bg-white/70 dark:hover:bg-[#14111F]/70 ${FOCUS_RING}`}>
                            <X size={16} aria-hidden='true' />
                        </button>
                    </span>
                ) : (
                    !open && (
                        <button
                            type='button'
                            onClick={() => setOpen(true)}
                            aria-expanded={open}
                            className={`h-11 shrink-0 rounded-full border border-[#5B21B6] px-5 text-sm font-bold text-[#5B21B6] dark:text-[#BB9BED] hover:bg-[#EDE7FB] dark:hover:bg-[#191328] ${FOCUS_RING}`}
                        >
                            Add code
                        </button>
                    )
                )}
            </div>
            {open && !coupon && (
                <form
                    className='mt-4 flex flex-col gap-3 sm:flex-row sm:items-start'
                    onSubmit={(e) => {
                        e.preventDefault();
                        apply();
                    }}
                >
                    <div className='flex-1'>
                        <input
                            value={code}
                            onChange={(e) => {
                                setCode(e.target.value);
                                setError('');
                            }}
                            placeholder='Coupon code'
                            aria-label='Coupon code'
                            aria-invalid={error ? true : undefined}
                            aria-describedby={error ? 'coupon-error' : undefined}
                            autoFocus
                            className={`${FIELD} ${error ? FIELD_ERROR : ''}`}
                        />
                        <FieldError id='coupon-error' message={error} />
                    </div>
                    <button type='submit' className={`h-12 rounded-[14px] bg-[#5B21B6] px-6 text-base font-bold text-white hover:bg-[#4C1A9A] ${FOCUS_RING}`}>
                        Apply
                    </button>
                </form>
            )}
        </section>
    );
};

export default CouponCard;
