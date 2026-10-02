import { MapPin, Star } from 'lucide-react';
import type { Stay } from '@/lib/types';
import ShareButton from './ShareButton';
import SaveButton from './SaveButton';
import { HEADING } from './fonts';

type Props = { stay: Stay; className?: string };

const StayHeader = ({ stay, className = '' }: Props) => (
    <header className={`flex flex-wrap items-end justify-between gap-4 pb-2 pt-8 ${className}`}>
        <div>
            {stay.stars > 0 && (
                <div className='flex items-center gap-2'>
                    <span role='img' aria-label={`${stay.stars} out of 5 stars`} className='flex gap-0.5'>
                        {[1, 2, 3, 4, 5].map((n) => (
                            <Star key={n} size={18} aria-hidden='true' fill={n <= stay.stars ? '#F5B301' : '#DCD4EE'} stroke='none' />
                        ))}
                    </span>
                    <span className='text-sm font-medium text-[#5E5775]'>{stay.stars}-star stay</span>
                </div>
            )}
            <h1 className={`${HEADING} my-2 text-4xl leading-tight tracking-tight text-[#1A1530] md:text-[44px]`}>{stay.name}</h1>
            <p className='flex items-center gap-1.5 text-[15px] text-[#5E5775]'>
                <MapPin size={16} aria-hidden='true' />
                {stay.area}
            </p>
        </div>
        <div className='flex gap-2'>
            <ShareButton title={stay.name} />
            <SaveButton />
        </div>
    </header>
);

export default StayHeader;
