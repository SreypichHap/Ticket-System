'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CheckoutHeader from './CheckoutHeader';
import BookingDetailsCard from './BookingDetailsCard';
import ContactSummaryCard from './ContactSummaryCard';
import PaymentMethodList from './PaymentMethodList';
import ReservedCard from './ReservedCard';
import CheckoutBar from '../tickets/CheckoutBar';
import { hasSavedContact, useSavedContact } from './contactStorage';
import type { PaymentMethod } from './paymentMethods';
import { startPayment } from '../booking/bookingApi';
import { labels } from '../booking/labels';
import { PAGE_CONTAINER } from '../layout';

type Props = { eventId: string; bookingId: string; placedAt: number; count: number; total: number; methods: PaymentMethod[]; paid: boolean };

const PaymentPage = ({ eventId, bookingId, placedAt, count, total, methods, paid }: Props) => {
    const router = useRouter();
    const contact = useSavedContact();
    // Default to the first method that can actually be used
    const [method, setMethod] = useState<string | null>(() => methods.find((m) => m.available)?.id ?? null);
    const [paying, setPaying] = useState(false);
    const [error, setError] = useState('');

    // Opened directly (or storage was cleared): there is no contact to pay for, so start over
    useEffect(() => {
        if (!hasSavedContact()) router.replace(`/events/${eventId}/tickets`);
    }, [eventId, router]);

    // Creates the payment and sends the buyer to the gateway page to complete it
    const pay = async () => {
        if (!method || paying) return;
        setPaying(true);
        setError('');
        try {
            window.location.assign(await startPayment(method));
        } catch {
            setError(labels.booking.genericError);
            setPaying(false);
        }
    };

    if (!contact) return <div className='min-h-screen bg-[#FBF7FF] dark:bg-[#190E24]' />;

    return (
        <div className='min-h-screen bg-[#FBF7FF] dark:bg-[#190E24]'>
            <CheckoutHeader title={labels.checkout.paymentTitle} onBack={() => router.back()} />
            <main className={`${PAGE_CONTAINER} flex flex-col gap-4 pb-36 pt-4`}>
                <BookingDetailsCard masterId={bookingId} placedAt={placedAt} />
                <ContactSummaryCard contact={contact} />
                {paid ? (
                    <ReservedCard name={contact.firstName.trim()} email={contact.email.trim()} onBack={() => router.push(`/events/${eventId}/tickets`)} />
                ) : (
                    <>
                        <PaymentMethodList methods={methods} value={method} onChange={setMethod} />
                        {error && (
                            <p role='alert' className='text-sm text-red-600'>
                                {error}
                            </p>
                        )}
                    </>
                )}
            </main>
            {!paid && <CheckoutBar totalQuantity={count} totalPrice={total} disabled={method === null || paying} buttonLabel={labels.checkout.payNow} onContinue={pay} />}
        </div>
    );
};

export default PaymentPage;
