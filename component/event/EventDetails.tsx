import RichText from '../common/RichText';
import EventInfoList from './EventInfoList';

type Props = {
    description?: string;
    format?: 'html' | 'markdown' | 'text';
    date?: string;
    time?: string;
    location?: string;
    mapUrl?: string;
};

// Sits inside the page's PAGE_CONTAINER (see ../layout.ts), inset by px-3.5 like the Tickets tab.
const EventDetails = ({ description, format = 'html', date, time, location, mapUrl }: Props) => {
    const hasDescription = Boolean(description?.trim());

    return (
        <div className='px-3.5 pb-16 pt-8' data-animate='details-content'>
            <div className='max-w-3xl'>
                <EventInfoList date={date} time={time} location={location} mapUrl={mapUrl} />
                {hasDescription ? (
                    <RichText content={description!} format={format} />
                ) : (
                    <p className='text-center text-sm text-gray-400'>No details available / មិនមានព័ត៌មានលម្អិត</p>
                )}
            </div>
        </div>
    );
};

export default EventDetails;
