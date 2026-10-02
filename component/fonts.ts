import { Poppins, Kantumruy_Pro } from 'next/font/google';

// Latin text uses Poppins (all weights, upright and italic); Khmer glyphs fall back to Kantumruy Pro through the font stack.
export const poppins = Poppins({
    variable: '--font-poppins',
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
    display: 'swap',
});
export const kantumruy = Kantumruy_Pro({ variable: '--font-kantumruy', subsets: ['khmer', 'latin'] });
