import { Minus, Plus } from 'lucide-react';

type Props = { label: string; value: number; min?: number; max?: number; onChange: (value: number) => void; className?: string };

const BTN = 'flex h-11 w-11 items-center justify-center rounded-full border border-[#DCD4EE] text-[#1A1530] hover:bg-[#EDE7FB] disabled:opacity-30 disabled:hover:bg-transparent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#EDE7FB]';

const Stepper = ({ label, value, min = 1, max, onChange, className = '' }: Props) => (
    <div role='group' aria-label={label} className={`flex items-center justify-between ${className}`}>
        <span className='text-sm font-medium text-[#1A1530]'>{label}</span>
        <div className='flex items-center gap-3'>
            <button type='button' aria-label={`Fewer ${label.toLowerCase()}`} disabled={value <= min} onClick={() => onChange(value - 1)} className={BTN}>
                <Minus size={16} aria-hidden='true' />
            </button>
            <span aria-live='polite' className='w-6 text-center text-sm font-semibold text-[#1A1530]'>
                {value}
            </span>
            <button type='button' aria-label={`More ${label.toLowerCase()}`} disabled={max !== undefined && value >= max} onClick={() => onChange(value + 1)} className={BTN}>
                <Plus size={16} aria-hidden='true' />
            </button>
        </div>
    </div>
);

export default Stepper;
