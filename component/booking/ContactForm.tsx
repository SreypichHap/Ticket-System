'use client';

import type { ComponentPropsWithRef, ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';
import FieldError from './FieldError';
import PhoneInput from './PhoneInput';
import type { ContactValues } from './contactSchema';
import { CARD, CARD_TITLE, FIELD, FIELD_ERROR, MUTED } from './styles';

type Props = { className?: string };

const Label = ({ htmlFor, children }: { htmlFor: string; children: ReactNode }) => (
    <label htmlFor={htmlFor} className='mb-1.5 block text-sm font-medium'>
        {children}
        <span aria-hidden='true' className='ml-0.5 text-[#B4123A] dark:text-[#F59CB2]'>
            *
        </span>
    </label>
);

type TextFieldProps = ComponentPropsWithRef<'input'> & { id: string; label: string; error?: string };

const TextField = ({ id, label, error, ...input }: TextFieldProps) => (
    <div>
        <Label htmlFor={id}>{label}</Label>
        <input id={id} required aria-required='true' aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined} className={`${FIELD} ${error ? FIELD_ERROR : ''}`} {...input} />
        <FieldError id={`${id}-error`} message={error} />
    </div>
);

// Reads the form from the page's FormProvider so the Reserve button can stay disabled until it is valid.
const ContactForm = ({ className = '' }: Props) => {
    const {
        register,
        formState: { errors },
    } = useFormContext<ContactValues>();

    return (
        <section data-animate='contact-form' aria-labelledby='contact-title' className={`${CARD} ${className}`}>
            <h2 id='contact-title' className={CARD_TITLE}>
                Contact information
            </h2>
            <p className={`mb-5 mt-1 text-sm ${MUTED}`}>Your e-tickets will be sent to this email and phone number.</p>
            <form noValidate onSubmit={(e) => e.preventDefault()} className='flex flex-col gap-4'>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    <TextField id='firstName' label='First name' autoComplete='given-name' error={errors.firstName?.message} {...register('firstName')} />
                    <TextField id='lastName' label='Last name' autoComplete='family-name' error={errors.lastName?.message} {...register('lastName')} />
                </div>
                <div>
                    <Label htmlFor='phone'>Phone number</Label>
                    <PhoneInput id='phone' required aria-required='true' error={errors.phone?.message} {...register('phone')} />
                </div>
                <TextField id='email' label='Email' type='email' autoComplete='email' error={errors.email?.message} {...register('email')} />
            </form>
        </section>
    );
};

export default ContactForm;
