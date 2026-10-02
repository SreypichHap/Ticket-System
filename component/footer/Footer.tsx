import FooterBrand from './FooterBrand';
import FooterLinks from './FooterLinks';
import FooterContact from './FooterContact';
import FooterBottom from './FooterBottom';
import { footerContent, type FooterContent } from './config';

import { poppins } from '../fonts';

const Footer = ({ content = footerContent }: { content?: FooterContent }) => (
    <footer className={`${poppins.className} w-full border-t border-[#6C4BE0]/10 bg-white dark:bg-[#14111F]`} data-animate='footer'>
        <div className='mx-auto max-w-[1480px] px-6 pb-10 pt-14'>
            <div className='grid grid-cols-1 gap-12 md:grid-cols-3'>
                <FooterBrand logo={content.logo} description={content.description} socials={content.socials} />
                <FooterLinks {...content.quickLinks} />
                <FooterContact {...content.contact} />
            </div>
            <FooterBottom brandName={content.brandName} copyright={content.copyright} bottomLinks={content.bottomLinks} />
        </div>
    </footer>
);

export default Footer;
