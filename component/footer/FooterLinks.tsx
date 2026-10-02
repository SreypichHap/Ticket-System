import Link from 'next/link';
import { linkClass, type FooterLink } from './config';

type Props = { title: string; ariaLabel: string; links: FooterLink[] };

const FooterLinks = ({ title, ariaLabel, links }: Props) => (
    <div data-animate='footer-col'>
        <h2 className='text-xl font-semibold text-[#1E1B3A] dark:text-[#E1DFF0]'>{title}</h2>
        <nav aria-label={ariaLabel}>
            <ul className='mt-6 flex flex-col gap-4'>
                {links.map((l) => (
                    <li key={l.label}>
                        <Link href={l.href} className={`text-lg ${linkClass}`}>
                            {l.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    </div>
);

export default FooterLinks;
