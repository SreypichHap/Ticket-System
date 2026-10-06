import ClampedText from '../stay/ClampedText';
import HtmlContent from '../event/HtmlContent';
import { HEADING } from '../stay/fonts';

type Props = { html: string; className?: string };

const AboutRoomCard = ({ html, className = '' }: Props) => (
    <section className={`rounded-3xl border border-[#E7E2F3] bg-white px-7 py-6 ${className}`}>
        <h2 className={`${HEADING} mb-2.5 text-xl text-[#1A1530]`}>About this room</h2>
        <ClampedText>
            <HtmlContent html={html} className='!text-sm !leading-7 text-[#3F3A52]' />
        </ClampedText>
    </section>
);

export default AboutRoomCard;
