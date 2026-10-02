import type { IconType } from 'react-icons';
import { MdOutlineLocationOn, MdOutlineMailOutline } from 'react-icons/md';
import { FiPhone } from 'react-icons/fi';

export type FooterLink = { label: string; href: string };
export type SocialKey = 'facebook' | 'instagram' | 'tiktok';
export type ContactItem = { icon: IconType; text: string; href?: string };

export type FooterContent = {
    brandName: string;
    logo: { src: string; alt: string; width: number; height: number };
    description: string;
    socials: { key: SocialKey; label: string; href: string }[];
    quickLinks: { title: string; ariaLabel: string; links: FooterLink[] };
    contact: { title: string; items: ContactItem[] };
    copyright: string; // {year} and {brand} are replaced at render time
    bottomLinks: FooterLink[];
};

// Swap this object (or pass another via props) for other languages, e.g. Khmer.
export const footerContent: FooterContent = {
    brandName: 'BookMe',
    logo: { src: '/images/logo.png', alt: 'BookMe logo', width: 220, height: 82 },
    description: 'Discover and book events, hotels, tours and more in one place, with the best deals and simple checkout.',
    socials: [
        { key: 'facebook', label: 'Facebook', href: 'https://facebook.com' },
        { key: 'instagram', label: 'Instagram', href: 'https://instagram.com' },
        { key: 'tiktok', label: 'TikTok', href: 'https://tiktok.com' },
    ],
    quickLinks: {
        title: 'Quick Links',
        ariaLabel: 'Quick links',
        links: [
            { label: 'Home', href: '/' },
            { label: 'Case Studies', href: '/case-studies' },
            { label: 'Pricing', href: '/pricing' },
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Use', href: '/terms' },
        ],
    },
    contact: {
        title: 'Contact Us',
        items: [
            { icon: MdOutlineLocationOn, text: 'A23 A, One Park Shop House Street, Sangkat Srah Chak, Khan Daun Penh, Phnom Penh, Cambodia' },
            { icon: FiPhone, text: '+855 010 318 316', href: 'tel:+855010318316' },
            { icon: MdOutlineMailOutline, text: 'hello@bookme.plus', href: 'mailto:hello@bookme.plus' },
        ],
    },
    copyright: '© {year} {brand}. All rights reserved.',
    bottomLinks: [
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
    ],
};

export const linkClass =
    'text-[#6B6890] dark:text-[#B1B0C6] hover:text-[#1E1B3A] dark:hover:text-[#E1DFF0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C4BE0] rounded-sm';
