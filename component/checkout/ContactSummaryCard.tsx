import SectionCard from './SectionCard';
import type { ContactValues } from '../booking/contactSchema';
import { labels } from '../booking/labels';

// Read-only version of the contact form, shown on the payment step
const ContactSummaryCard = ({ contact }: { contact: ContactValues }) => {
    const t = labels.checkout;
    const rows: [string, string][] = [
        [t.contactName, `${contact.firstName} ${contact.lastName}`.trim()],
        [t.contactPhone, `+855 ${contact.phone}`],
        [t.contactEmail, contact.email],
    ];

    return (
        <SectionCard title={t.contact}>
            <dl className='flex flex-col gap-2'>
                {rows.map(([label, value]) => (
                    <div key={label} className='flex justify-between gap-4 text-sm'>
                        <dt className='text-gray-500'>{label}</dt>
                        <dd className='text-right text-gray-900'>{value}</dd>
                    </div>
                ))}
            </dl>
        </SectionCard>
    );
};

export default ContactSummaryCard;
