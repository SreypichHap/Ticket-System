import DOMPurify from 'isomorphic-dompurify';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Props = { content: string; format?: 'html' | 'markdown' | 'text' };

const emojiStart = /^\s*\p{Extended_Pictographic}/u;

// Emoji-led list items already carry their own bullet, so drop the marker and the indent.
const proseClass = [
    'prose prose-neutral max-w-none text-sm leading-7',
    'prose-headings:leading-snug prose-h1:mb-4 prose-h1:text-xl prose-h1:font-semibold prose-h2:mb-4 prose-h2:text-xl prose-h2:font-semibold',
    'prose-p:mb-3 prose-p:text-sm prose-p:leading-7 prose-p:text-gray-600 prose-li:text-sm prose-li:leading-7 prose-li:text-gray-600',
    'prose-strong:font-semibold prose-strong:text-gray-900',
    'prose-a:text-violet-600 prose-a:no-underline prose-a:underline-offset-2 hover:prose-a:underline',
    '[&_p]:whitespace-pre-line',
].join(' ');

const textOf = (node: React.ReactNode): string =>
    typeof node === 'string' ? node : Array.isArray(node) ? node.map(textOf).join('') : '';

const RichText = ({ content, format = 'html' }: Props) => {
    if (format === 'text') return <p className='whitespace-pre-line text-sm leading-7 text-gray-600'>{content}</p>;

    if (format === 'markdown') {
        return (
            <div className={proseClass}>
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        li: ({ children, ...props }) => (
                            <li {...props} className={emojiStart.test(textOf(children)) ? 'list-none -ml-5' : undefined}>
                                {children}
                            </li>
                        ),
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        );
    }

    const html = DOMPurify.sanitize(content).replace(/<li>(\s*)(?=\p{Extended_Pictographic})/gu, '<li class="list-none -ml-5">$1');
    return <div className={proseClass} dangerouslySetInnerHTML={{ __html: html }} />;
};

export default RichText;
