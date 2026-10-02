'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const HOME_RESET_EVENT = 'bookme:home-reset';

// Logo link to "/". On the homepage a same-page link does not remount anything, so it also
// tells the homepage to clear its category filter and scrolls back to the top.
const HomeLogoLink = ({ children }) => {
    const pathname = usePathname();

    const handleClick = () => {
        if (pathname !== '/') return;
        window.dispatchEvent(new Event(HOME_RESET_EVENT));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <Link href='/' aria-label='BookMe home' onClick={handleClick} className='shrink-0'>
            {children}
        </Link>
    );
};

export default HomeLogoLink;
