import { CheckCircle } from 'lucide-react';
import SectionCard from './SectionCard';
import Button from '../common/Button';
import { labels } from '../booking/labels';

type Props = { name: string; email: string; onBack: () => void };

// Shown in place of the form once the reservation is made
const ReservedCard = ({ name, email, onBack }: Props) => (
    <SectionCard>
        <div role='status' className='flex flex-col items-center gap-3 py-4 text-center'>
            <CheckCircle size={40} className='text-green-500' aria-hidden='true' />
            <h2 className='text-lg font-semibold text-gray-900'>{labels.checkout.reservedTitle}</h2>
            <p className='text-sm text-gray-500'>{labels.checkout.reservedMessage(name, email)}</p>
            <Button variant='ghost' onClick={onBack}>
                {labels.checkout.backToEvent}
            </Button>
        </div>
    </SectionCard>
);

export default ReservedCard;
