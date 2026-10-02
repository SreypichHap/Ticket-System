import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { Archivo_Black } from 'next/font/google';
import PricePill from './PricePill';
import QuantityStepper from './QuantityStepper';

const archivoBlack = Archivo_Black({ weight: '400', subsets: ['latin'] });

type Props = {
    id: string;
    title: string;
    imageSrc: string;
    imageAlt: string;
    location?: string;
    price: number;
    currency?: string;
    quantity: number;
    min?: number;
    max?: number;
    onQuantityChange: (id: string, quantity: number) => void;
    variant?: 'flat' | 'card';
};

const TicketCard = ({ id, title, imageSrc, imageAlt, location, price, currency = 'USD', quantity, min = 0, max = 10, onQuantityChange, variant = 'flat' }: Props) => (
    <article
        data-animate='ticket-card'
        className={`flex h-[120px] w-full flex-row overflow-hidden rounded-2xl bg-white dark:bg-[#14111F] md:h-[170px] ${variant === 'card' ? 'rounded-2xl shadow-md' : ''}`}
    >
        <div className='relative h-full w-[40%] shrink-0'>
            <Image src={imageSrc} alt={imageAlt} fill sizes='(min-width: 768px) 25vw, 40vw' className='object-cover' />
        </div>
        <div className='flex min-w-0 flex-1 flex-col justify-between gap-2 pb-3 pl-3 pr-4 pt-2 md:gap-4 md:pb-5 md:pl-5 md:pr-8 md:pt-4'>
            <div className='min-w-0'>
                <h3 className={`${archivoBlack.className} line-clamp-2 text-xl leading-tight text-black dark:text-white`}>{title}</h3>
                {location && (
                    <p className='mt-1 flex items-center gap-1 text-sm text-gray-500'>
                        <MapPin size={14} className='shrink-0' aria-hidden='true' />
                        <span className='truncate'>{location}</span>
                    </p>
                )}
            </div>
            <div className='flex flex-wrap items-center justify-between gap-2'>
                <PricePill price={price} currency={currency} />
                <QuantityStepper value={quantity} min={min} max={max} onChange={(q) => onQuantityChange(id, q)} />
            </div>
        </div>
    </article>
);

export default TicketCard;
