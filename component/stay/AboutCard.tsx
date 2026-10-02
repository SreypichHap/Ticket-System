import ClampedText from './ClampedText';
import { HEADING } from './fonts';

type Props = { paragraphs: string[]; className?: string };

const AboutCard = ({ paragraphs, className = '' }: Props) => (
    <section className={`rounded-3xl border border-[#E7E2F3] bg-white p-6 ${className}`}>
        <h2 className={`${HEADING} mb-2.5 text-xl text-[#1A1530]`}>About this stay</h2>
        <ClampedText>
            {paragraphs.map((p) => (
                <p key={p} className='text-base leading-relaxed text-[#3F3A52]'>
                    {p}
                </p>
            ))}
        </ClampedText>
    </section>
);

export default AboutCard;
