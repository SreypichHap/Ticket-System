import { AlertCircle } from 'lucide-react';

type Props = { id: string; message?: string };

const FieldError = ({ id, message }: Props) =>
    message ? (
        <p id={id} className='mt-1.5 flex items-center gap-1.5 text-sm text-[#B4123A] dark:text-[#F59CB2]'>
            <AlertCircle size={16} className='shrink-0' aria-hidden='true' />
            {message}
        </p>
    ) : null;

export default FieldError;
