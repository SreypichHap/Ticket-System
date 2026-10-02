import { Check } from 'lucide-react';

type Props = { perks: string[]; className?: string };

const RoomPerks = ({ perks, className = '' }: Props) => {
    if (perks.length === 0) return null;
    return (
        <ul className={`flex flex-wrap gap-2 ${className}`}>
            {perks.map((perk) => (
                <li key={perk} className='flex items-center gap-1 rounded-full bg-[#E6F4EF] px-2.5 py-1 text-[13px] font-medium text-[#0F5C4D]'>
                    <Check size={14} aria-hidden='true' />
                    {perk}
                </li>
            ))}
        </ul>
    );
};

export default RoomPerks;
