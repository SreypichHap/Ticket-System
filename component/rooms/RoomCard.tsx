import Image from 'next/image';
import Link from 'next/link';
import type { Room } from '@/lib/types';
import RoomAttributes from './RoomAttributes';
import RoomPerks from './RoomPerks';
import RoomPriceBox from './RoomPriceBox';
import { HEADING } from '../stay/fonts';

type Props = { room: Room; href: string; nights: number; priority?: boolean; className?: string };

const RoomCard = ({ room, href, nights, priority = false, className = '' }: Props) => {
    const dim = room.soldOut ? 'opacity-60' : '';
    const cover = room.images[0];

    return (
        <article
            data-state={room.soldOut ? 'sold-out' : 'default'}
            className={`relative flex flex-wrap overflow-hidden rounded-3xl border border-[#E7E2F3] bg-white hover:border-[#C9BDEB] ${className}`}
        >
            <div className={`relative aspect-[16/10] min-h-[220px] w-full bg-[#EDE7FB] md:aspect-auto md:flex-[0_0_300px] ${dim}`}>
                {cover && <Image src={cover.src} alt={cover.alt} fill sizes='(min-width: 768px) 300px, 100vw' priority={priority} className='object-cover' />}
            </div>

            <div className={`flex flex-[1_1_300px] flex-col gap-3 px-6 py-[22px] ${dim}`}>
                <h3 className={`${HEADING} text-xl leading-tight text-[#1A1530]`}>{room.name}</h3>
                <RoomAttributes attributes={room.attributes} />
                <RoomPerks perks={room.perks} />
                <Link href={href}
                    className='mt-auto flex min-h-11 items-center self-start text-sm after:absolute after:inset-0 after:content-[""] font-semibold text-[#5B21B6] hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#EDE7FB]'
                >
                    Room details ›
                </Link>
            </div>

            <RoomPriceBox room={room} nights={nights} href={href} />

        </article>
    );
};

export default RoomCard;
