import Navbar from '../component/public/navbar';
import TicketPurchasePage from '../component/ticket-purchase/TicketPurchasePage';

const EventDetail = ({ event }) => {
  return (
    <div>
      <Navbar />
      <TicketPurchasePage event={event} />
    </div>
  );
}

export default EventDetail;
