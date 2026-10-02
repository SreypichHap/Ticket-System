import WorkflowCard, { type WorkflowItem } from './WorkflowCard';
import { poppins } from '../fonts';

export type WorkflowSectionProps = {
    brandName?: string;
    title?: string;
    subtitle?: string;
    items?: WorkflowItem[];
    className?: string;
    cardClassName?: string;
};

const defaultItems: WorkflowItem[] = [
    {
        id: 'pre-event',
        title: 'Pre-event',
        description:
            'Pre-sell your tickets with full communications support to boost your sales, plus a real-time KYC participation tracking dashboard.',
    },
    {
        id: 'during-event',
        title: 'During Event',
        description: 'Smart check-in system to easily verify bookings and tickets, with real-time notification alerts on the event agenda.',
    },
    {
        id: 'after-event',
        title: 'After Event',
        description:
            'Detailed post-event analysis reports covering e-ticket sales, event promotion performance, attendee behaviour, and check-in entry insights.',
    },
];

const WorkflowSection = ({
    brandName = 'BookMe+',
    title = 'Our workflow from start to end',
    subtitle = `${brandName} supports you through every stage of your event journey.`,
    items = defaultItems,
    className = '',
    cardClassName = '',
}: WorkflowSectionProps) => (
    <section aria-labelledby='workflow-title' className={`bg-white dark:bg-[#14111F] px-4 py-8 md:px-40 ${className}`}>
        <div className='mx-auto max-w-[1160px]'>
            <div className='text-center'>
                <h2 id='workflow-title' className={`${poppins.className} text-3xl font-extrabold uppercase tracking-tight text-[#1A1530] dark:text-[#E7E5F3] md:text-5xl`}>
                    {title}
                </h2>
                <p className={`${poppins.className} mt-4 text-base text-[#5E5775] dark:text-[#C3BFCF] md:text-lg`}>{subtitle}</p>
            </div>

            <ol className='mt-14 grid grid-cols-1 gap-6 md:grid-cols-3'>
                {items.map(({ id, ...item }) => (
                    <WorkflowCard key={id} {...item} className={cardClassName} />
                ))}
            </ol>
        </div>
    </section>
);

export default WorkflowSection;
