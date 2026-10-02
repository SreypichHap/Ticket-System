'use client';

import { Minus, Plus } from 'lucide-react';

type Props = {
    value: number;
    min: number;
    max: number;
    onChange: (value: number) => void;
    size?: 'sm' | 'md';
};

const sizes = {
    sm: { button: 'h-8 w-8', icon: 16, value: 'min-w-[1.5rem] text-sm' },
    md: { button: 'h-10 w-10', icon: 20, value: 'min-w-[2rem] text-base' },
};

const QuantityStepper = ({ value, min, max, onChange, size = 'sm' }: Props) => {
    const s = sizes[size];
    // Nothing selected yet: show only the + button. The − and number appear after the first add.
    const selected = value > 0;
    const button = `flex ${s.button} items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-violet-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500`;

    return (
        <div className='inline-flex items-center gap-1 rounded-full bg-violet-50 px-1 py-0.5'>
            {selected && (
                <button type='button' aria-label='Decrease quantity' disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))} className={button}>
                    <Minus size={s.icon} strokeWidth={2} aria-hidden='true' />
                </button>
            )}
            {selected && (
                <span aria-live='polite' data-animate='qty-value' className={`${s.value} text-center font-medium tabular-nums text-gray-700`}>
                    {value}
                </span>
            )}
            <button type='button' aria-label='Increase quantity' disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))} className={button}>
                <Plus size={s.icon} strokeWidth={2} aria-hidden='true' />
            </button>
        </div>
    );
};

export default QuantityStepper;
