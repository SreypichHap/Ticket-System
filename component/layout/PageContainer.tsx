import type { ReactNode } from 'react';
import Navbar from '@/component/public/navbar';

const WIDTHS = { default: 'max-w-[1180px]', narrow: 'max-w-[1080px]' } as const;

type Props = {
    children: ReactNode;
    // Rendered after <main>, still inside the page: sticky booking bars, mobile bars...
    footer?: ReactNode;
    width?: keyof typeof WIDTHS;
    // Extra classes for <main>, e.g. the top / bottom padding that differs per page
    className?: string;
};

// The shared page shell: page background, site navbar, and the centered content column. Use it for every page.
const PageContainer = ({ children, footer, width = 'default', className = 'pt-8' }: Props) => (
    <div className='flex min-h-screen flex-col bg-[#F6F4FB]'>
        <Navbar />
        <main className={`mx-auto w-full flex-1 px-6 ${WIDTHS[width]} ${className}`}>{children}</main>
        {footer}
    </div>
);

export default PageContainer;
