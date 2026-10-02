import { formatPrice, plural } from '@/lib/stay-search';
import { HEADING } from '../stay/fonts';

type Props = { roomName: string; total: number; currency: string; nights: number; onContinue: () => void; className?: string };

// Always rendered so the aria-live region announces the selection; it shows only while a room is selected.
const SelectionBar = ({ roomName, total, currency, nights, onContinue, className = '' }: Props) => (
    <div aria-live='polite' className={`sticky bottom-0 mt-8 px-6 pb-5 ${className}`}>
        {roomName && (
            <div className='mx-auto flex max-w-[1080px] items-center justify-between gap-3 rounded-[20px] bg-[#1A1530] py-3.5 pl-[22px] pr-3.5 text-white shadow-[0_12px_32px_rgba(26,21,48,.25)]'>
                <div className='min-w-0'>
                    <p className='truncate text-[13px] text-[#C4B5FD]'>1 room selected · {roomName}</p>
                    <p>
                        <span className={`${HEADING} text-2xl`}>{formatPrice(total, currency)}</span>
                        <span className='ml-2 text-[13px] text-[#D9D2EE]'>for {plural(nights, 'night')}</span>
                    </p>
                </div>
                <button
                    type='button'
                    onClick={onContinue}
                    className='h-12 shrink-0 rounded-[14px] bg-white px-7 text-base font-bold text-[#1A1530] hover:bg-[#EDE7FB] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C4B5FD]'
                >
                    Continue →
                </button>
            </div>
        )}
    </div>
);

export default SelectionBar;
