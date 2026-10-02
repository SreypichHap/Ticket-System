import type { StaticImageData } from 'next/image';
import bannerBg1 from '../../asset/more-to-explore/image/img1.jpg';
import bannerBg2 from '../../asset/more-to-explore/image/img2.jpg';
import bannerBg3 from '../../asset/more-to-explore/image/img3.jpg';
import bannerBg4 from '../../asset/more-to-explore/image/img4.jpg';

export type StoreConfig = {
    caption: string;
    label: string;
    href: string;
    ariaLabel: string;
    rating: string;
    ratingCaption: string;
};

export type AppBannerContent = {
    heading: string;
    title: string;
    subtitle: string;
    scanLabel: string;
    orLabel: string;
    backgroundImages: (StaticImageData | string)[];
    logo: string;
    qrImage: string;
    stores: { apple: StoreConfig; google: StoreConfig };
};

// Swap this object (or pass another one via props) for other languages, e.g. Khmer.
export const appBannerContent: AppBannerContent = {
    heading: 'More to explore',
    title: 'Your all-in-one travel app',
    subtitle: 'Book events, hotels, tours and more in one place. Get exclusive deals when you book in the app.',
    scanLabel: 'Scan to get the app',
    orLabel: 'Or',
    backgroundImages: [bannerBg1, bannerBg2, bannerBg3, bannerBg4],
    logo: '/images/logo.png',
    qrImage: '/images/qr-placeholder.svg',
    stores: {
        apple: {
            caption: 'Download on the',
            label: 'App Store',
            href: '#',
            ariaLabel: 'Download on the App Store',
            rating: '4.8',
            ratingCaption: 'App ratings',
        },
        google: {
            caption: 'GET IT ON',
            label: 'Google Play',
            href: '#',
            ariaLabel: 'Get it on Google Play',
            rating: '4.8',
            ratingCaption: 'App ratings',
        },
    },
};
