import { formatFull, monthCells, type Month, type Range } from '@/lib/date';

type Props = { month: Month; range: Range; today: string; onPick: (iso: string) => void; className?: string };

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// One month, Sunday first. Past days are disabled; the range is a soft band with half bands at both ends.
const CalendarMonth = ({ month, range, today, onPick, className = '' }: Props) => {
    const { start, end } = range;
    return (
        <div className={className}>
            <div className='grid grid-cols-7 pb-1 text-center text-xs font-medium text-search-muted' aria-hidden='true'>
                {WEEKDAYS.map((day) => (
                    <span key={day}>{day}</span>
                ))}
            </div>
            <div className='grid grid-cols-7'>
                {monthCells(month).map((iso, i) => {
                    if (!iso) return <span key={`blank-${i}`} />;
                    const isStart = iso === start;
                    const isEnd = iso === end;
                    const selected = isStart || isEnd;
                    const inside = !!start && !!end && iso > start && iso < end;
                    const band = inside ? 'inset-x-0' : isStart && end ? 'left-1/2 right-0' : isEnd && start ? 'left-0 right-1/2' : '';
                    const past = iso < today;
                    return (
                        <div key={iso} className='relative flex h-11 items-center justify-center'>
                            {band && <span aria-hidden='true' className={`absolute inset-y-0 bg-search-soft ${band}`} />}
                            <button
                                type='button'
                                disabled={past}
                                aria-label={formatFull(iso)}
                                aria-pressed={selected}
                                onClick={() => onPick(iso)}
                                className={`relative flex h-11 w-11 items-center justify-center rounded-full text-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-search-soft ${
                                    selected
                                        ? 'bg-search-accent font-semibold text-white'
                                        : past
                                          ? 'text-search-disabled'
                                          : `text-search-text hover:bg-search-soft ${iso === today ? 'ring-2 ring-search-accent' : ''}`
                                }`}
                            >
                                {Number(iso.slice(8))}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarMonth;
