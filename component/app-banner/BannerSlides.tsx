'use client';

import { useEffect, useState } from 'react';
import Image, { type StaticImageData } from 'next/image';

type Props = { images: (StaticImageData | string)[]; intervalMs?: number; sizes?: string; priorityFirst?: boolean; fitClassName?: string };

// Cross-fades through the background images; stays on the first one for reduced-motion users.
const BannerSlides = ({ images, intervalMs = 3000, sizes = "(min-width: 1280px) 1160px, 100vw", priorityFirst = false, fitClassName = "object-cover" }: Props) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (images.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const timer = setInterval(() => setIndex((i) => (i + 1) % images.length), intervalMs);
        return () => clearInterval(timer);
    }, [images.length, intervalMs]);

    return (
        <div aria-hidden='true' className='absolute inset-0'>
            {images.map((src, i) => (
                <Image
                    key={i}
                    src={src}
                    alt=''
                    fill
                    sizes={sizes}
                    priority={priorityFirst && i === 0}
                    className={`${fitClassName} transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0'}`}
                />
            ))}
        </div>
    );
};

export default BannerSlides;
