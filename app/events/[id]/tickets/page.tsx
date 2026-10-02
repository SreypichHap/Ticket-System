import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import EventDetail from '../../../../page/eventdetail';
import { getEventBySlug } from '@/lib/events';

type Props = { params: Promise<{ id: string }> };

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const event = await getEventBySlug((await params).id);
  return { title: event ? `Tickets · ${event.title}` : 'Tickets' };
};

// Same data source as the event page: both call getEventBySlug.
const Page = async ({ params }: Props) => {
  const event = await getEventBySlug((await params).id);
  if (!event) notFound();

  return <EventDetail event={event} />;
}

export default Page;
