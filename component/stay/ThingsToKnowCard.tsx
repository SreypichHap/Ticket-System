import { Info } from 'lucide-react';
import { FaCheckCircle } from 'react-icons/fa';
import { ImCross } from 'react-icons/im';
import type { ThingToKnow } from '@/lib/types';
import { HEADING } from './fonts';

type Props = { items: ThingToKnow[]; className?: string };

const ThingsToKnowCard = ({ items, className = '' }: Props) => {
    const notices = items.filter((i) => i.type === 'notice');
    const rules = items.filter((i) => i.type === 'rule');

    return (
        <section className={`flex flex-col gap-4 rounded-3xl border border-[#E7E2F3] bg-white p-6 ${className}`}>
            <h2 className={`${HEADING} text-xl text-[#1A1530]`}>Things to know</h2>
            {notices.map((n) => (
                <div key={n.text} className='flex items-start gap-3 rounded-2xl bg-[#FDF1D3] px-4 py-3.5 text-[#5C3B00]'>
                    <Info size={20} aria-hidden='true' className='mt-0.5 shrink-0' />
                    <p>{highlightAmounts(n.text)}</p>
                </div>
            ))}
            {rules.length > 0 && (
                <ul className='grid gap-2.5 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]'>
                    {rules.map((r) => {
                        const banned = r.icon === 'ban';
                        return (
                            <li key={r.label} className='flex items-center gap-3 rounded-[14px] bg-[#F6F4FB] p-3'>
                                <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white'>
                                    {banned ? <ImCross size={16} aria-hidden='true' className='text-[#DC2626]' /> : <FaCheckCircle size={20} aria-hidden='true' className='text-[#0F6B63]' />}
                                </span>
                                <span className='font-medium text-[#1A1530]'>{r.label}</span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
};

// Key words in a notice are bold: dollar amounts, e.g. "$10"
const highlightAmounts = (text: string) =>
    text.split(/(\$\d+(?:\.\d+)?)/).map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part));

export default ThingsToKnowCard;
