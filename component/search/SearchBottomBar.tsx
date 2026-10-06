import { rangeLabel } from '@/lib/date';
import { nightsBetween, plural } from '@/lib/stay-search';

type Props = { start: string; end: string | null; guests: number; onApply: () => void; className?: string };

const SearchBottomBar = ({ start, end, guests, onApply, className = '' }: Props) => (
    <div className={`fixed inset-x-0 bottom-0 z-40 px-6 pb-[max(0.75rem,env(safe-area-inset-bottom))] ${className}`}>
        <div className='mx-auto flex max-w-[1080px] items-center justify-between gap-4 rounded-[20px] border border-search-border bg-white px-5 py-3 shadow-[0_12px_32px_rgba(27,24,48,.12)]'>
            <div>
                <p className='text-base font-semibold text-search-text'>{end ? rangeLabel(start, end) : 'Select dates'}</p>
                <p className='text-xs text-search-muted'>{end ? `${plural(nightsBetween(start, end), 'night')} · ${plural(guests, 'guest')}` : plural(guests, 'guest')}</p>
            </div>
            <button
                type='button'
                disabled={!end}
                onClick={onApply}
                className='h-[52px] rounded-2xl bg-search-accent px-10 text-base font-semibold text-white hover:bg-search-accent-text disabled:bg-search-border disabled:text-search-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-search-soft'
            >
                Apply
            </button>
        </div>
    </div>
);

export default SearchBottomBar;
