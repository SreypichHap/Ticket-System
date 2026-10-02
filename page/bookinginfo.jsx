import BookingPage from '../component/booking/BookingPage';

const BookingInfo = ({ eventId, booking }) => {
  return <BookingPage eventId={eventId} booking={booking} />;
}

export default BookingInfo;
