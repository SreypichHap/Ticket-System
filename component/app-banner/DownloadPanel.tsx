import Image from 'next/image';
import StoreButton from './StoreButton';
import type { AppBannerContent } from './config';

const AppleIcon = () => (
    <svg viewBox='0 0 24 24' className='h-6 w-6' fill='currentColor' aria-hidden='true'>
        <path d='M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.8-.8-3-.8c-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7 2-1.1 2.8-2.2c.9-1.3 1.2-2.5 1.3-2.6-.1 0-2.5-1-2.5-3.9zM14.1 5.7c.6-.8 1.1-1.9 1-3-.9 0-2.1.6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1.1.1 2.1-.5 2.7-1.3z' />
    </svg>
);

const PlayIcon = () => (
    <svg viewBox='0 0 24 24' className='h-6 w-6' fill='currentColor' aria-hidden='true'>
        <path d='M4 2.5v19a1 1 0 001.5.9l16-9.5a1 1 0 000-1.8l-16-9.5A1 1 0 004 2.5z' />
    </svg>
);

type Props = Pick<AppBannerContent, 'scanLabel' | 'orLabel' | 'qrImage' | 'logo' | 'stores'>;

const DownloadPanel = ({ scanLabel, orLabel, qrImage, logo, stores }: Props) => (
    <div className='mt-6 rounded-2xl border border-white/20 bg-[#1E1B3A]/50 p-6 shadow-lg backdrop-blur-md' data-animate='panel'>
        <p className='hidden text-sm text-white/80 md:block'>{scanLabel}</p>
        <div className='flex items-center gap-6 md:mt-3'>
            {/* QR: hidden on mobile */}
            <div className='relative hidden h-[120px] w-[120px] shrink-0 rounded-lg bg-white dark:bg-[#14111F] p-2 md:block' data-animate='qr'>
                <Image src={qrImage} alt='' fill sizes='120px' className='object-contain p-2' />
                <span className='absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-md bg-white dark:bg-[#14111F] p-1'>
                    <Image src={logo} alt='' fill sizes='36px' className='object-contain p-1' />
                </span>
            </div>

            {/* Divider with "Or" */}
            <div className='hidden h-[120px] flex-col items-center md:flex' aria-hidden='true'>
                <span className='w-px flex-1 bg-white/30 dark:bg-[#14111F]/30' />
                <span className='py-2 text-sm text-white/80'>{orLabel}</span>
                <span className='w-px flex-1 bg-white/30 dark:bg-[#14111F]/30' />
            </div>

            <div className='flex flex-col gap-3'>
                <StoreButton icon={<AppleIcon />} {...stores.apple} />
                <StoreButton icon={<PlayIcon />} {...stores.google} />
            </div>
        </div>
    </div>
);

export default DownloadPanel;
