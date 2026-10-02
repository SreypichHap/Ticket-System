'use client';

export type TabId = 'tickets' | 'details';

type Props = { active: TabId; onChange: (tab: TabId) => void; ticketCount: number; className?: string };

const tabs: { id: TabId; label: string }[] = [
    { id: 'tickets', label: 'Tickets' },
    { id: 'details', label: 'Details' },
];

const TicketTabs = ({ active, onChange, ticketCount, className = '' }: Props) => (
    <div role='tablist' aria-label='Event sections' className={`flex gap-8 border-b border-[#E7E2F3] dark:border-[#362F47] ${className}`}>
        {tabs.map((t) => {
            const selected = active === t.id;
            return (
                <button
                    key={t.id}
                    id={`tab-${t.id}`}
                    role='tab'
                    type='button'
                    aria-selected={selected}
                    aria-controls={`panel-${t.id}`}
                    onClick={() => onChange(t.id)}
                    data-animate='tab'
                    className={`-mb-px flex min-h-11 items-center gap-2 border-b-[3px] text-[15px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B21B6] ${
                        selected ? 'border-[#5B21B6] text-[#5B21B6] dark:text-[#BB9BED]' : 'border-transparent text-[#5E5775] dark:text-[#C3BFCF] hover:text-[#1A1530] dark:hover:text-[#E7E5F3]'
                    }`}
                >
                    {t.label}
                    {t.id === 'tickets' && (
                        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${selected ? 'bg-[#5B21B6] text-white' : 'bg-[#EFEAFB] dark:bg-[#191326] text-[#5B21B6] dark:text-[#BB9BED]'}`}>{ticketCount}</span>
                    )}
                </button>
            );
        })}
    </div>
);

export default TicketTabs;
