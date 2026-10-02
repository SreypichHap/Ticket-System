import { ArrowLeft } from 'lucide-react';
import { labels } from '../booking/labels';
import { PAGE_CONTAINER } from '../layout';

type Props = { title: string; onBack: () => void };

const CheckoutHeader = ({ title, onBack }: Props) => (
    <header className='sticky top-0 z-30 h-14 border-b border-gray-100 bg-[#FBF7FF] dark:bg-[#190E24]'>
        <div className={`${PAGE_CONTAINER} flex h-full items-center`}>
            <div className='flex items-center gap-2'>
                <button
                    type='button'
                    onClick={onBack}
                    aria-label={labels.checkout.back}
                    className='flex h-10 w-10 items-center justify-center rounded-full hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400'
                >
                    <ArrowLeft size={20} aria-hidden='true' />
                </button>
                <h1 className='text-lg font-semibold text-gray-900'>{title}</h1>
            </div>
        </div>
    </header>
);

export default CheckoutHeader;
