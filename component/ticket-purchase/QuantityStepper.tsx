'use client';

import { Minus, Plus } from 'lucide-react';

type Props = {
    value: number;
    max: number;
    onChange: (value: number) => void;
    label: string;
    selected?: boolean;
    className?: string;
};

const btn =
    'flex h-11 w-11 items-center justify-center rounded-full text-[#1A1530] dark:text-[#E7E5F3] transition-colors hover:bg-[#E3D8F7] dark:hover:bg-[#1E162D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B21B6] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent';

const QuantityStepper = ({ value, max, onChange, label, selected = false, className = '' }: Props) => (
    <div
        role='group'
        aria-label={`Quantity for ${label}`}
        className={`inline-flex items-center rounded-full border border-[#E7E2F3] dark:border-[#362F47] transition-colors ${selected ? 'bg-[#EFEAFB] dark:bg-[#191326]' : 'bg-white dark:bg-[#14111F]'} ${className}`}
    >
        {value > 0 && (
            <>
                <button type='button' aria-label={`Decrease ${label}`} onClick={() => onChange(value - 1)} className={btn}>
                    <Minus size={18} aria-hidden='true' />
                </button>
                <span aria-live='polite' data-animate='qty-value' className='min-w-8 text-center text-base font-bold tabular-nums text-[#1A1530] dark:text-[#E7E5F3]'>
                    {value}
                </span>
            </>
        )}
        <button type='button' aria-label={`Increase ${label}`} disabled={value >= max} onClick={() => onChange(value + 1)} className={btn}>
            <Plus size={18} aria-hidden='true' />
        </button>
    </div>
);

export default QuantityStepper;
