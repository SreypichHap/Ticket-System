import Image from 'next/image';
import Link from 'next/link';
import HomeLogoLink from './HomeLogoLink';
import MobileMenu from './MobileMenu';
import ThemeToggle from './ThemeToggle';
import Logo from '../../public/images/logo.png';

const navLinks = [
    { label: 'My Booking', href: '/' },
    { label: 'Notifications', href: '/' },
    { label: 'For Organizers', href: '/' },
];
const authLinks = [
    { label: 'Register', href: '/register' },
    { label: 'Login', href: '/login', primary: true },
];

const Navbar = () => {
    return (
        <div className='flex items-center justify-between gap-4 px-4 md:px-10 lg:px-16 py-4 sticky top-0 z-50 bg-white dark:bg-[#14111F] border-b border-[#6C4BE0]/10 shadow-[0_4px_20px_rgba(108,75,224,0.08)]'>
            <HomeLogoLink>
                <Image src={Logo} alt='BookMe logo' className='w-[120px] h-[50px] dark:[filter:invert(1)_hue-rotate(180deg)]' />
            </HomeLogoLink>
            <div className='hidden md:flex gap-8 lg:gap-15 whitespace-nowrap text-[#1E1B3A] dark:text-[#E1DFF0] font-medium [&>a]:transition [&>a:hover]:text-[#6C4BE0] dark:[&>a:hover]:text-[#947CE9]'>
                {navLinks.map(({ label, href }) => (
                    <Link key={label} href={href}>{label}</Link>
                ))}
            </div>
            <div className='hidden shrink-0 items-center gap-2 sm:gap-4 md:flex'>
                <ThemeToggle />
                <Link
                    href='/register'
                    className='px-5 py-2 rounded-4xl border border-transparent font-medium text-[#1E1B3A] dark:text-[#E1DFF0] hover:bg-[#F1EDFB] dark:hover:bg-[#181325] hover:text-[#6C4BE0] dark:hover:text-[#947CE9] transition'>
                    Register
                </Link>
                <Link
                    href='/login'
                    className='px-5 py-2 rounded-4xl bg-[#6C4BE0] font-medium text-white shadow-md shadow-[#6C4BE0]/30 hover:brightness-110 transition'>
                    Login
                </Link>
            </div>
            <div className='flex items-center gap-1 md:hidden'>
                <ThemeToggle />
                <MobileMenu links={navLinks} authLinks={authLinks} />
            </div>
        </div>
    );
}

export default Navbar;
