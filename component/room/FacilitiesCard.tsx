import type { FacilityGroup } from '@/lib/types';
import FacilityColumn from './FacilityColumn';
import { HEADING } from '../stay/fonts';

type Props = { groups: FacilityGroup[]; className?: string };

const FacilitiesCard = ({ groups, className = '' }: Props) => {
    const total = groups.reduce((sum, g) => sum + g.items.length, 0);
    return (
        <section className={`rounded-3xl border border-[#E7E2F3] bg-white px-7 py-6 ${className}`}>
            <div className='mb-5 flex flex-wrap items-baseline justify-between gap-2'>
                <h2 className={`${HEADING} text-xl text-[#1A1530]`}>Room facilities</h2>
                <p className='text-sm text-[#5E5775]'>{total} facilities</p>
            </div>
            <div className='grid gap-x-7 gap-y-6 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]'>
                {groups.map((group) => (
                    <FacilityColumn key={group.id} group={group} />
                ))}
            </div>
        </section>
    );
};

export default FacilitiesCard;
