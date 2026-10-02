import { BedDouble, Eye, Maximize2, Users, type LucideIcon } from 'lucide-react';
import type { RoomAttribute } from '@/lib/types';

type Props = { attributes: RoomAttribute[]; className?: string };

const ICONS: Record<RoomAttribute['kind'], LucideIcon> = { guests: Users, bed: BedDouble, size: Maximize2, view: Eye };

const RoomAttributes = ({ attributes, className = '' }: Props) => {
    if (attributes.length === 0) return null;
    return (
        <ul className={`flex flex-wrap gap-x-[18px] gap-y-2 ${className}`}>
            {attributes.map(({ kind, label }) => {
                const Icon = ICONS[kind];
                return (
                    <li key={kind} className='flex items-center gap-1.5 text-sm text-[#3F3A52]'>
                        <Icon size={16} aria-hidden='true' className='shrink-0 text-[#5E5775]' />
                        {label}
                    </li>
                );
            })}
        </ul>
    );
};

export default RoomAttributes;
