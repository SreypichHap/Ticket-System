import { Check } from 'lucide-react';
import { poppins } from '../fonts';

export type WorkflowItem = { id: string; title: string; description: string };

type WorkflowCardProps = Omit<WorkflowItem, 'id'> & { className?: string };

const WorkflowCard = ({ title, description, className = '' }: WorkflowCardProps) => (
    <li
        className={`${poppins.className} relative min-h-[220px] rounded-3xl border border-[#E7E2F3] dark:border-[#362F47] bg-[#F6F4FB] dark:bg-[#181420] p-8 hover:border-[#5B21B6] hover:shadow-[0_12px_32px_rgba(26,21,48,0.08)] ${className}`}
    >
        <span className='absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full bg-[#EDE7FB] dark:bg-[#191328]'>
            <Check size={18} aria-hidden='true' className='text-[#5B21B6] dark:text-[#B9A8F7]' />
        </span>
        <h3 className='pr-12 text-xl font-bold text-[#1A1530] dark:text-[#E7E5F3]'>{title}</h3>
        <p className='mt-4 text-base leading-relaxed text-[#5E5775] dark:text-[#C3BFCF]'>{description}</p>
    </li>
);

export default WorkflowCard;
