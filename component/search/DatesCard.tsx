import { ArrowRight, Calendar } from 'lucide-react';
import { formatDay, formatWeekday, nextWeekend, thisWeekend, tonight, type Range } from '@/lib/date';
import { nightsBetween, plural, todayIso } from '@/lib/stay-search';

type Box = 'start' | 'end';
type Props = { start: string; end: string | null; active: Box | null; onOpen: (box: Box) => void; onQuick: (range: Range) => void; className?: string };

const DateBox = ({ label, iso, active, onClick }: { label: string; iso: string | null; active: boolean; onClick: () => void }) => (
    <button
        type='button'
        onClick={onClick}
        className={`flex min-h-[78px] flex-col items-start justify-center rounded-[14px] border px-3.5 py-2 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-search-soft ${
            active ? 'border-[1.5px] border-search-accent bg-search-tint' : 'border-search-border bg-white'
        }`}
    >
        <span className='text-xs text-search-muted'>{label}</span>
        <span className={`text-lg font-semibold ${iso ? 'text-search-text' : 'text-search-disabled'}`}>{iso ? formatDay(iso) : 'Add date'}</span>
        <span className='text-xs text-search-muted'>{iso ? formatWeekday(iso) : ' '}</span>
    </button>
);

const DatesCard = ({ start, end, active, onOpen, onQuick, className = '' }: Props) => {
    const today = todayIso();
    const quick: { label: string; range: Range }[] = [
        { label: 'Tonight', range: tonight(today) },
        { label: 'This weekend', range: thisWeekend(today) },
        { label: 'Next weekend', range: nextWeekend(today) },
    ];
    return (
        <section className={`rounded-[20px] border border-search-border bg-white p-4 ${className}`}>
            <p className='mb-3 flex items-center gap-2 text-sm font-semibold text-search-text'>
                <Calendar size={18} aria-hidden='true' className='text-search-accent' />
                Dates
            </p>
            <div className='grid grid-cols-[1fr_auto_1fr] items-center gap-2'>
                <DateBox label='Check-in' iso={start} active={active === 'start'} onClick={() => onOpen('start')} />
                <span className='flex flex-col items-center gap-0.5 text-xs font-medium text-search-accent-text'>
                    <span className='rounded-full bg-search-soft px-2.5 py-1'>{end ? plural(nightsBetween(start, end), 'night') : '–'}</span>
                    <ArrowRight size={14} aria-hidden='true' />
                </span>
                <DateBox label='Check-out' iso={end} active={active === 'end'} onClick={() => onOpen('end')} />
            </div>
            <div className='mt-3 flex flex-wrap gap-2'>
                {quick.map(({ label, range }) => (
                    <button
                        key={label}
                        type='button'
                        onClick={() => onQuick(range)}
                        className='min-h-11 rounded-full border border-search-border bg-white px-4 text-sm font-medium text-search-text hover:bg-search-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-search-soft'
                    >
                        {label}
                    </button>
                ))}
            </div>
        </section>
    );
};

export default DatesCard;
