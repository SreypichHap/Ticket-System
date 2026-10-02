import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/component/public/navbar';
import EventHero from '@/component/event/EventHero';
import EventDescription from '@/component/event/EventDescription';
import TicketZoneList from '@/component/event/TicketZoneList';
import PurchaseConditions from '@/component/event/PurchaseConditions';
import ShareCard from '@/component/event/ShareCard';
import OrganizerCard from '@/component/event/OrganizerCard';
import PoweredByFooter from '@/component/event/PoweredByFooter';
import { getEventBySlug } from '@/lib/events';

type Props = { params: Promise<{ id: string }> };

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const event = await getEventBySlug((await params).id);
  return { title: event?.title ?? 'Event' };
};

// The route param is named [id] (not [slug]) because the booking/checkout routes below it already use it.
const Page = async ({ params }: Props) => {
  const { id } = await params;
  const event = await getEventBySlug(id);
  if (!event) notFound();

  return (
    <div className='event-page-bg min-h-screen text-[#1A1530] dark:text-[#E7E5F3]'>
      <Navbar />
      <main className='mx-auto w-full max-w-[1120px] px-4 pt-16'>
        <EventHero event={event} />
        <div className='mt-8 grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr] md:items-start'>
          <div className='flex flex-col gap-4'>
            <EventDescription html={event.descriptionHtml} />
            <TicketZoneList zones={event.zones} selectHref={`/events/${id}/tickets`} />
          </div>
          <div className='flex flex-col gap-4 md:sticky md:top-6'>
            {event.conditions.items.length > 0 && <PurchaseConditions intro={event.conditions.intro} items={event.conditions.items} />}
            <ShareCard title={event.title} />
            {event.organizer.name && <OrganizerCard organizer={event.organizer} />}
          </div>
        </div>
        <PoweredByFooter />
      </main>
    </div>
  );
}

export default Page;
