import ExpandableContent from './ExpandableContent';
import { CARD, CARD_TITLE } from './styles';

type Props = { intro: string; items: string[]; className?: string };

const PurchaseConditions = ({ intro, items, className = '' }: Props) => (
    <section data-animate='purchase-conditions' className={`${CARD} ${className}`}>
        <h2 className={`${CARD_TITLE} mb-3`}>Ticket Purchase Conditions</h2>
        <ExpandableContent collapsedClassName='max-h-48'>
            <div className='text-sm leading-6'>
                <p className='mb-3'>{intro}</p>
                <ul className='list-disc space-y-1 pl-5'>
                    {items.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            </div>
        </ExpandableContent>
    </section>
);

export default PurchaseConditions;
