import Navbar from '../component/public/navbar';
import HeroSection from '../component/public/herosection';
import Event from '../component/homepage/event';
import EventCategoriesSection from '../component/sections/EventCategoriesSection';
import WorkflowSection from '../component/sections/WorkflowSection';
import GoGreenSection from '../component/sections/GoGreenSection';
import { getHomeSections } from '../lib/api';
import Footer from '../component/footer/Footer';
import AppBanner from '../component/app-banner/AppBanner';

const HomePage = async () => {
  const sections = await getHomeSections();

  return (
    <div>
      <Navbar />
      <HeroSection />
      {/* Everything inside <Event sections={sections}> is hidden while a category filter is active */}
      <Event sections={sections}>
        <EventCategoriesSection />
        <WorkflowSection />
        <AppBanner />
        <GoGreenSection />
      </Event>
      {/* Space between the last section / event list and the footer */}
      <div className='pt-32'>
        <Footer />
      </div>
    </div>
  );
}

export default HomePage;
