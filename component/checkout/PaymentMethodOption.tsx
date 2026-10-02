import Image from 'next/image';
import { Check } from 'lucide-react';
import type { PaymentMethod } from './paymentMethods';
import { labels } from '../booking/labels';

type Props = { method: PaymentMethod; selected: boolean; disabled?: boolean; onSelect: () => void };

// A row in the radio group: the native input is visually hidden but still drives keyboard and screen-reader behaviour.
const PaymentMethodOption = ({ method, selected, disabled = false, onSelect }: Props) => (
    <label
        data-animate='payment-option'
        data-state={selected ? 'checked' : 'unchecked'}
        className={`flex items-center gap-3 rounded-xl border p-3 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-violet-400 ${
            selected ? 'border-violet-500 bg-violet-50 ring-1 ring-violet-500' : 'border-gray-200'
        } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-violet-50/50'}`}
    >
        <input type='radio' name='paymentMethod' value={method.id} checked={selected} disabled={disabled} onChange={onSelect} className='sr-only' />
        <Image src={method.logo} alt='' width={40} height={40} unoptimized className='h-10 w-10 shrink-0 rounded-lg object-contain' />
        <div className='min-w-0 flex-1'>
            <p className='text-sm font-medium text-gray-900'>{method.name}</p>
            <p className='text-xs text-gray-500'>{method.description}</p>
            {disabled && <p className='mt-0.5 text-xs text-gray-500'>{labels.checkout.unavailable}</p>}
        </div>
        <span aria-hidden='true' className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${selected ? 'bg-violet-600 text-white' : 'border-2 border-gray-300'}`}>
            {selected && <Check size={12} strokeWidth={3} />}
        </span>
    </label>
);

export default PaymentMethodOption;
