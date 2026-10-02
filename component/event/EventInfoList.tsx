import { Calendar, Clock, MapPin } from 'lucide-react';

type Props = { date?: string; time?: string; location?: string; mapUrl?: string };

const row = 'flex items-start gap-3';
const icon = 'mt-1 shrink-0 text-violet-500';

const EventInfoList = ({ date, time, location, mapUrl }: Props) => {
    if (!date && !time && !location) return null;
    const href = mapUrl ?? (location ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}` : undefined);

    return (
        <ul className='mb-8 flex flex-col gap-3 text-sm leading-7 text-gray-600'>
            {date && (
                <li className={row}>
                    <Calendar size={18} className={icon} aria-hidden='true' />
                    <span>{date}</span>
                </li>
            )}
            {time && (
                <li className={row}>
                    <Clock size={18} className={icon} aria-hidden='true' />
                    <span>{time}</span>
                </li>
            )}
            {location && (
                <li className={row}>
                    <MapPin size={18} className={icon} aria-hidden='true' />
                    <a href={href} target='_blank' rel='noopener noreferrer' className='text-violet-600 underline-offset-2 hover:underline'>
                        {location}
                    </a>
                </li>
            )}
        </ul>
    );
};

export default EventInfoList;
