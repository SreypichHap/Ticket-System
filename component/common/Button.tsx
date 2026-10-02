import type { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' };

const base = 'h-[43px] rounded-full px-10 text-[13px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 disabled:cursor-not-allowed disabled:opacity-50';

const variants = {
    primary: 'bg-[#5B47D0] text-white hover:brightness-110 focus-visible:ring-offset-2 disabled:hover:brightness-100',
    ghost: 'text-violet-700 hover:bg-violet-50',
};

// Shared pill button. Pass `className` to adjust size or spacing for a specific spot.
const Button = ({ variant = 'primary', type = 'button', className = '', ...props }: Props) => (
    <button type={type} className={`${base} ${variants[variant]} ${className}`} {...props} />
);

export default Button;
