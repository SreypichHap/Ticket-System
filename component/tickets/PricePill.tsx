type Props = { price: number; currency?: string };

const PricePill = ({ price, currency = 'USD' }: Props) => {
    const label =
        price === 0
            ? 'FREE'
            : `PRICE: ${new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(price)}`;

    return (
        <span className='rounded-full rounded-full bg-[#A91FFF] px-3 py-1 text-sm font-extrabold uppercase tracking-widest text-white'>{label}</span>
    );
};

export default PricePill;
