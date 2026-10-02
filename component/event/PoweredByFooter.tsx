import Image from 'next/image';
import { MUTED } from './styles';

type Props = { className?: string };

const PoweredByFooter = ({ className = '' }: Props) => (
    <footer className={`flex flex-col items-center gap-2 py-12 ${className}`}>
        <p className={`text-sm ${MUTED}`}>Powered By</p>
        <Image src='/images/logo.png' alt='BookMe' width={120} height={45} className='h-[45px] w-[120px] object-contain dark:[filter:invert(1)_hue-rotate(180deg)]' />
    </footer>
);

export default PoweredByFooter;
