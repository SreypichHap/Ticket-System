import { Ban, FileText, Leaf, QrCode } from 'lucide-react';
import GoGreenItem, { type GoGreenItemData } from './GoGreenItem';
import { poppins } from '../fonts';

export type GoGreenSectionProps = {
    brandName?: string;
    subtitle?: string;
    items?: GoGreenItemData[];
    className?: string;
};

const defaultItems: GoGreenItemData[] = [
    { icon: QrCode, title: 'No printed tickets', description: '100% digital QR codes' },
    { icon: Ban, title: 'No plastic badges', description: 'Mobile check-ins only' },
    { icon: FileText, title: 'No paper brochures', description: 'Digital event guides' },
];

const GoGreenSection = ({
    brandName = 'BookMe+',
    subtitle = '100% Digital Events. Better for Cambodia.',
    items = defaultItems,
    className = '',
}: GoGreenSectionProps) => (
    <section aria-labelledby='go-green-title' className={`bg-white dark:bg-[#14111F] px-4 py-8 md:px-40 ${className}`}>
        <div className='mx-auto max-w-[1160px] text-center'>
            <div className='flex flex-wrap items-center justify-center gap-4'>
                <span className='flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#BBF7D0] dark:border-[#2B593B] bg-[#DCFCE7] dark:bg-[#122D1B] shadow-[0_8px_24px_rgba(21,128,61,0.18)]'>
                    <Leaf size={26} aria-hidden='true' className='text-[#15803D] dark:text-[#4ADE80]' />
                </span>
                <h2
                    id='go-green-title'
                    className={`${poppins.className} text-3xl font-extrabold uppercase tracking-tight text-[#15803D] dark:text-[#B9F3CF] md:text-5xl`}
                >
                    Go green with {brandName}
                </h2>
            </div>
            <p className={`${poppins.className} mt-3 text-base font-medium text-[#3F3A52] dark:text-[#D5D2DF] md:text-lg`}>{subtitle}</p>

            <div className='mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3 md:gap-10'>
                {items.map((item) => (
                    <GoGreenItem key={item.title} {...item} />
                ))}
            </div>
        </div>
    </section>
);

export default GoGreenSection;
