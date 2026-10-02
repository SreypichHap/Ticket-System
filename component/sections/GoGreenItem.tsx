import type { LucideIcon } from 'lucide-react';
import { poppins } from '../fonts';

export type GoGreenItemData = { icon: LucideIcon; title: string; description: string };

type GoGreenItemProps = GoGreenItemData & { className?: string };

const GoGreenItem = ({ icon: Icon, title, description, className = '' }: GoGreenItemProps) => (
    <div className={`${poppins.className} flex flex-col items-center rounded-3xl border border-[#E7E2F3] dark:border-[#362F47] bg-white dark:bg-[#14111F] p-8 text-center ${className}`}>
        <div className='flex h-[88px] w-[88px] items-center justify-center rounded-full bg-[#EDE7FB] dark:bg-[#191328]'>
            <Icon size={48} stroke='#5D54D9' aria-hidden='true' />
        </div>
        <h3 className='mt-5 text-xl font-bold text-[#1A1530] dark:text-[#E7E5F3]'>{title}</h3>
        <p className='mt-2 text-base text-[#5E5775] dark:text-[#C3BFCF]'>{description}</p>
    </div>
);

export default GoGreenItem;
