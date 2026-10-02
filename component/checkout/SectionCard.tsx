import type { ReactNode } from 'react';

type Props = { title?: string; children: ReactNode };

const SectionCard = ({ title, children }: Props) => (
    <section className='rounded-2xl border border-black dark:border-white p-5'>
        {title && <h2 className='mb-4 text-base font-semibold text-gray-900'>{title}</h2>}
        {children}
    </section>
);

export default SectionCard;
