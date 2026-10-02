'use client';

type Props = { tabs: string[]; active: string; onChange: (tab: string) => void; className?: string };

const EventTabs = ({ tabs, active, onChange, className = '' }: Props) => (
    // Plain strip: scrolls with the page; pb-6 keeps the cards 24px clear of the tabs
    <div className={`relative bg-[#FBF7FF] dark:bg-[#190E24] pb-6 ${className}`}>
        <div role='tablist' className='flex gap-7 border-b border-gray-100'>
            {tabs.map((tab) => (
                <button
                    key={tab}
                    role='tab'
                    type='button'
                    aria-selected={active === tab}
                    onClick={() => onChange(tab)}
                    className={`-mb-px border-b-[3px] py-2.5 text-[13px] ${active === tab ? 'border-[#2B2B2B] text-[#2B2B2B] dark:text-[#E3E0EE]' : 'border-transparent text-[#4B5563] dark:text-[#C9CED6]'}`}
                >
                    {tab}
                </button>
            ))}
        </div>
    </div>
);

export default EventTabs;
