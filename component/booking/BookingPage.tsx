'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingTotals, type Booking } from '@/lib/booking';
import CheckoutHeader from '../checkout/CheckoutHeader';
import { saveContact } from '../checkout/contactStorage';
import CheckoutBar from '../tickets/CheckoutBar';
import { PAGE_CONTAINER } from '../layout';
import { labels } from './labels';
import BookingDetailsCard from './BookingDetailsCard';
import ContactForm from './ContactForm';
import CouponCard from './CouponCard';
import OrderSummaryCard from './OrderSummaryCard';
import { contactSchema, type ContactValues } from './contactSchema';
import { saveContactDetails, type CouponResult } from './bookingApi';

type Props = { eventId: string; booking: Booking };

const BookingPage = ({ eventId, booking }: Props) => {
    const router = useRouter();
    // Coupon state comes from the order itself, so a coupon applied earlier is still there after a refresh
    const [coupon, setCoupon] = useState<{ code: string; discount: number } | null>(booking.couponCode ? { code: booking.couponCode, discount: booking.discount } : null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const form = useForm<ContactValues>({
        resolver: zodResolver(contactSchema),
        mode: 'onBlur',
        defaultValues: { firstName: '', lastName: '', phone: '', email: '' },
    });

    const { count, subtotal } = bookingTotals(booking.items);
    const total = subtotal - (coupon?.discount ?? 0);
    const onCoupon = (result: CouponResult) => setCoupon(result.code ? { code: result.code, discount: result.discount } : null);

    // Always clickable: an invalid form shows every error and focuses the first bad field (react-hook-form does both)
    // The contact goes onto the order; it is also kept in sessionStorage so the payment step can show it back
    const reserve = form.handleSubmit(async (contact) => {
        if (saving) return;
        setSaving(true);
        setError('');
        try {
            await saveContactDetails(contact);
            saveContact(contact);
            router.push(`/events/${eventId}/payment`);
        } catch {
            setError(labels.booking.genericError);
            setSaving(false);
        }
    });

    return (
        <div className={`min-h-screen bg-[#FBF7FF] dark:bg-[#190E24] text-[#1A1530] dark:text-[#E7E5F3]`}>
            <CheckoutHeader title={labels.checkout.title} onBack={() => router.push(`/events/${eventId}/tickets`)} />
            <FormProvider {...form}>
                <main className={`${PAGE_CONTAINER} flex flex-col gap-4 pb-36 pt-4`}>
                    <OrderSummaryCard event={booking.event} items={booking.items} />
                    <BookingDetailsCard masterId={booking.masterId} placedAt={booking.placedAt} />
                    <ContactForm />
                    <CouponCard coupon={coupon} onChange={onCoupon} />
                    {error && (
                        <p role='alert' className='text-sm text-[#B4123A]'>
                            {error}
                        </p>
                    )}
                </main>
            </FormProvider>
            <CheckoutBar totalQuantity={count} totalPrice={total} buttonLabel={labels.checkout.reserve} disabled={saving} onContinue={reserve} />
        </div>
    );
};

export default BookingPage;
