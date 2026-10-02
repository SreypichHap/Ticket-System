import Image from 'next/image';
import { CgFacebook } from 'react-icons/cg';
import { SiInstagram } from 'react-icons/si';
import { AiOutlineTikTok } from 'react-icons/ai';
import { linkClass, type FooterContent, type SocialKey } from './config';

const icons: Record<SocialKey, React.ReactNode> = {
    facebook: <CgFacebook size={22} aria-hidden='true' />,
    instagram: <SiInstagram size={22} aria-hidden='true' />,
    tiktok: <AiOutlineTikTok size={22} aria-hidden='true' />,
};

type Props = Pick<FooterContent, 'logo' | 'description' | 'socials'>;

const FooterBrand = ({ logo, description, socials }: Props) => (
    <div data-animate='footer-col'>
        <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} className='h-auto w-[220px] dark:[filter:invert(1)_hue-rotate(180deg)]' />
        <p className='mt-3 line-clamp-3 max-w-md text-lg leading-relaxed text-[#6B6890] dark:text-[#B1B0C6]'>{description}</p>
        <ul className='mt-8 flex gap-5'>
            {socials.map((s) => (
                <li key={s.key}>
                    <a href={s.href} target='_blank' rel='noopener noreferrer' aria-label={s.label} className={`block ${linkClass}`}>
                        {icons[s.key]}
                    </a>
                </li>
            ))}
        </ul>
    </div>
);

export default FooterBrand;
