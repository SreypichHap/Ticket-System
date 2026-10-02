'use client';

import { useState } from 'react';

type Props = { sources: string[]; poster?: string };

// Plays each video once, then moves to the next one and loops back to the first.
const BannerVideo = ({ sources, poster }: Props) => {
    const [index, setIndex] = useState(0);

    return (
        <video
            key={sources[index]}
            src={sources[index]}
            poster={poster}
            autoPlay
            muted
            playsInline
            preload='auto'
            aria-hidden='true'
            onEnded={() => setIndex((i) => (i + 1) % sources.length)}
            // A single video: loop it instead of waiting on onEnded
            loop={sources.length === 1}
            className='absolute inset-0 h-full w-full object-cover'
        />
    );
};

export default BannerVideo;
