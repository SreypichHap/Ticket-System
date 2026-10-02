import type { ComponentPropsWithRef } from 'react';
import { ChevronDown } from 'lucide-react';
import FieldError from './FieldError';

type Props = Omit<ComponentPropsWithRef<'input'>, 'type'> & {
    id: string;
    error?: string;
    // Only Cambodia for now; the button is where a country picker would hook in
    dialCode?: string;
    flag?: string;
    onCountryClick?: () => void;
    className?: string;
};

// One 48px field: country-code button on the left, number input on the right. Spread react-hook-form's register() onto it.
const PhoneInput = ({ id, error, dialCode = '+855', flag = '🇰🇭', onCountryClick, className = '', ...input }: Props) => {
    const errorId = `${id}-error`;

    return (
        <div className={className}>
            <div
                className={`flex h-12 overflow-hidden rounded-[14px] border bg-white dark:bg-[#14111F] ${
                    error
                        ? 'border-[#B4123A] focus-within:shadow-[0_0_0_1px_#B4123A,0_0_0_5px_#FBE4EA]'
                        : 'border-[#CFC7E3] dark:border-[#3F394F] focus-within:border-[#5B21B6] focus-within:shadow-[0_0_0_1px_#5B21B6,0_0_0_5px_#EDE7FB]'
                }`}
            >
                <button
                    type='button'
                    onClick={onCountryClick}
                    aria-label={`Country code ${dialCode}`}
                    className='flex shrink-0 items-center gap-1.5 border-r border-[#CFC7E3] dark:border-[#3F394F] bg-[#F6F4FB] dark:bg-[#181420] px-3 text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#5B21B6]'
                >
                    <span aria-hidden='true'>{flag}</span>
                    {dialCode}
                    <ChevronDown size={16} aria-hidden='true' />
                </button>
                <input
                    id={id}
                    type='tel'
                    inputMode='tel'
                    autoComplete='tel-national'
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? errorId : undefined}
                    placeholder='12 345 678'
                    className='min-w-0 flex-1 bg-transparent px-4 text-base text-[#1A1530] dark:text-[#E7E5F3] outline-none placeholder:text-[#7A7292] dark:placeholder:text-[#B3AEC1]'
                    {...input}
                />
            </div>
            <FieldError id={errorId} message={error} />
        </div>
    );
};

export default PhoneInput;
