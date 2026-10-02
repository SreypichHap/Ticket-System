// "Free" for 0, otherwise always 2 decimals
export const formatPrice = (price: number) =>
    price === 0 ? 'Free' : `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
