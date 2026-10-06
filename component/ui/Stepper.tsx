import { Minus, Plus } from 'lucide-react';

type Props = { label: string; hint?: string; value: number; min: number; max?: number; onChange: (value: number) => void; className?: string };

const BUTTON =
    'flex h-11 w-11 items-center justify-center rounded-full border border-search-accent text-search-accent-text hover:bg-search-soft disabled:border-search-border disabled:text-search-disabled disabled:hover:bg-transparent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-search-soft';

const Stepper = ({ label, hint, value, min, max, onChange, className = '' }: Props) => (
    <div role='group' aria-label={label} className={`flex items-center justify-between gap-4 ${className}`}>
        <div>
            <p className='text-base font-medium text-search-text'>{label}</p>
            {hint && <p className='text-xs text-search-muted'>{hint}</p>}
        </div>
        <div className='flex items-center gap-3.5'>
            <button type='button' aria-label={`Fewer ${label.toLowerCase()}`} disabled={value <= min} onClick={() => onChange(value - 1)} className={BUTTON}>
                <Minus size={18} aria-hidden='true' />
            </button>
            <span aria-live='polite' className='w-6 text-center text-base font-semibold text-search-text'>
                {value}
            </span>
            <button type='button' aria-label={`More ${label.toLowerCase()}`} disabled={max !== undefined && value >= max} onClick={() => onChange(value + 1)} className={BUTTON}>
                <Plus size={18} aria-hidden='true' />
            </button>
        </div>
    </div>
);

export default Stepper;
