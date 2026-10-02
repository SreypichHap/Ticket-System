import { linkClass, type ContactItem } from './config';

type Props = { title: string; items: ContactItem[] };

const FooterContact = ({ title, items }: Props) => (
    <div data-animate='footer-col'>
        <h2 className='text-xl font-semibold text-[#1E1B3A] dark:text-[#E1DFF0]'>{title}</h2>
        <address className='mt-6 not-italic'>
            <ul className='flex flex-col gap-5'>
                {items.map(({ icon: Icon, text, href }) => (
                    <li key={text} className='flex items-start gap-3'>
                        <Icon size={22} className='mt-1 shrink-0 text-[#6C4BE0] dark:text-[#947CE9]' aria-hidden='true' />
                        {href ? (
                            <a href={href} className={`text-lg ${linkClass}`}>
                                {text}
                            </a>
                        ) : (
                            <span className='text-lg text-[#6B6890] dark:text-[#B1B0C6]'>{text}</span>
                        )}
                    </li>
                ))}
            </ul>
        </address>
    </div>
);

export default FooterContact;
