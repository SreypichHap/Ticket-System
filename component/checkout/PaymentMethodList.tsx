import SectionCard from './SectionCard';
import PaymentMethodOption from './PaymentMethodOption';
import { groupPaymentMethods } from './groupPaymentMethods';
import type { PaymentMethod } from './paymentMethods';
import { labels } from '../booking/labels';

type Props = { methods: PaymentMethod[]; value: string | null; onChange: (id: string) => void };

const PaymentMethodList = ({ methods, value, onChange }: Props) => (
    <SectionCard title={labels.checkout.choosePayment}>
        <div role='radiogroup' aria-label={labels.checkout.choosePayment}>
            {groupPaymentMethods(methods).map((group, i) => (
                <div key={group.provider} className={i > 0 ? 'mt-4' : ''}>
                    {/* A provider with a single method needs no heading */}
                    {group.methods.length > 1 && <p className='mb-2 text-xs font-medium uppercase tracking-wide text-gray-400'>{group.provider}</p>}
                    <div className='flex flex-col gap-3'>
                        {group.methods.map((method) => (
                            <PaymentMethodOption key={method.id} method={method} selected={value === method.id} disabled={!method.available} onSelect={() => onChange(method.id)} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </SectionCard>
);

export default PaymentMethodList;
