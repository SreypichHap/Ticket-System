import Link from 'next/link';
import { linkClass, type FooterContent } from './config';

type Props = Pick<FooterContent, 'brandName' | 'copyright' | 'bottomLinks'>;

const FooterBottom = ({ brandName, copyright, bottomLinks }: Props) => (
    <div className='mt-10 border-t border-[#6C4BE0]/10'>
        <div className='flex flex-col items-center justify-between gap-4 pt-10 text-center md:flex-row md:text-left'>
            <p className='text-base text-[#6B6890] dark:text-[#B1B0C6]'>
                {copyright.replace('{year}', String(new Date().getFullYear())).replace('{brand}', brandName)}
            </p>
            <ul className='flex gap-6'>
                {bottomLinks.map((l) => (
                    <li key={l.label}>
                        <Link href={l.href} className={linkClass}>
                            {l.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

export default FooterBottom;
