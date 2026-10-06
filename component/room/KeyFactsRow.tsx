import { Baby, BedDouble, Bath, Eye, Home, Maximize2, Sofa, Users, UsersRound, Wifi, type LucideIcon } from 'lucide-react';
import type { Fact } from '@/lib/types';

type Props = { facts: Fact[]; className?: string };

const ICONS: Record<Fact['kind'], LucideIcon> = {
    adults: Users,
    kids: Baby,
    propertyType: Home,
    bedrooms: BedDouble,
    bathrooms: Bath,
    maxGuests: UsersRound,
    sofas: Sofa,
    wifi: Wifi,
    size: Maximize2,
    view: Eye,
};

const KeyFactsRow = ({ facts, className = '' }: Props) => (
    <section className={`rounded-3xl border border-[#E7E2F3] bg-white px-2 py-1 ${className}`}>
        <ul className='grid grid-cols-4 md:[grid-template-columns:repeat(auto-fit,minmax(110px,1fr))]'>
            {facts.map(({ kind, label }) => {
                const Icon = ICONS[kind];
                return (
                    <li key={kind} className='flex flex-col items-center gap-2 border-l border-[#F0EDF7] px-2 py-[18px] text-center first:border-l-0 max-md:nth-[4n+1]:border-l-0'>
                        <span className='flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#F3EEFE]'>
                            <Icon size={22} aria-hidden='true' className='text-[#5B21B6]' />
                        </span>
                        <span className='text-sm font-semibold leading-snug text-[#1A1530]'>{label}</span>
                    </li>
                );
            })}
        </ul>
    </section>
);

export default KeyFactsRow;
