import { useEffect } from 'react';

// Calls `onEscape` when Escape is pressed, only while `active` is true.
export const useEscapeKey = (active: boolean, onEscape: () => void) => {
    useEffect(() => {
        if (!active) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onEscape();
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [active, onEscape]);
};
