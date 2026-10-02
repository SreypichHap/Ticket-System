import ExpandableContent from './ExpandableContent';
import HtmlContent from './HtmlContent';
import { CARD, CARD_TITLE } from './styles';

type Props = { html: string; className?: string };

const EventDescription = ({ html, className = '' }: Props) => (
    <section data-animate='event-description' className={`${CARD} ${className}`}>
        <h2 className={`${CARD_TITLE} mb-3`}>Event Description</h2>
        <ExpandableContent>
            <HtmlContent html={html} />
        </ExpandableContent>
    </section>
);

export default EventDescription;
