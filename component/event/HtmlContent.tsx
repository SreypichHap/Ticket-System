import DOMPurify from 'isomorphic-dompurify';

type Props = { html: string; className?: string };

// Sanitized rich text. Text keeps its line breaks, so emoji lists and Khmer paragraphs render as written.
const HtmlContent = ({ html, className = '' }: Props) => (
    <div
        className={`text-sm leading-6 [&_a]:text-[#5B3FD9] dark:[&_a]:text-[#927FE6] [&_a]:underline [&_p]:mb-3 [&_p]:whitespace-pre-line ${className}`}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
    />
);

export default HtmlContent;
