import Image from 'next/image';
import DownloadPanel from './DownloadPanel';
import BannerSlides from './BannerSlides';
import { appBannerContent, type AppBannerContent } from './config';

const AppBanner = ({ content = appBannerContent }: { content?: AppBannerContent }) => (
    <section aria-labelledby='app-banner-title' className='bg-white dark:bg-[#14111F] px-4 py-8 md:px-40'>
        <div className='mx-auto max-w-[1160px]'>
            <h2 id='app-banner-title' className='mb-6 text-3xl font-semibold text-[#1E1B3A] dark:text-[#E1DFF0]'>
                {content.heading}
            </h2>

            <div className='relative min-h-[400px] overflow-hidden rounded-3xl md:aspect-[21/9] md:min-h-0 shadow-[0_16px_40px_rgba(108,75,224,0.2)]' data-animate='banner'>
                <BannerSlides images={content.backgroundImages} />
                <div className='absolute inset-0 bg-gradient-to-r from-[#1E1B3A]/80 via-[#4B2FA8]/40 to-transparent' />

                <div className='relative flex min-h-[400px] items-stretch md:absolute md:inset-0 md:min-h-0 justify-between px-6 md:px-16'>
                    <div className='flex w-full flex-col justify-center py-8 lg:w-[55%]'>
                        <h3 className='flex items-center gap-3 text-3xl font-semibold text-white'>
                            {content.title}
                            <Image src={content.logo} alt='' width={32} height={32} className='h-8 w-8 object-contain' />
                        </h3>
                        <p className='mt-2 max-w-md text-base text-white/90'>{content.subtitle}</p>
                        <DownloadPanel
                            scanLabel={content.scanLabel}
                            orLabel={content.orLabel}
                            qrImage={content.qrImage}
                            logo={content.logo}
                            stores={content.stores}
                        />
                    </div>

                </div>
            </div>
        </div>
    </section>
);

export default AppBanner;
