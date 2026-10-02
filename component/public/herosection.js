import BannerSlides from '../app-banner/BannerSlides';
import img1 from '../../asset/more-to-explore/image/img1.jpg';
import img2 from '../../asset/more-to-explore/image/img2.jpg';
import img3 from '../../asset/more-to-explore/image/img3.jpg';
import img4 from '../../asset/more-to-explore/image/img4.jpg';

const slides = [img1, img2, img3, img4];

// Cross-fades through the images every 3s (see BannerSlides)
const HeroSection = () => {
    return (
        <div className='relative w-full h-[180px] sm:h-[280px] md:h-[420px] overflow-hidden bg-[#1E1B3A]'>
            <BannerSlides images={slides} intervalMs={3000} sizes='100vw' priorityFirst />
        </div>
    );
}

export default HeroSection;
