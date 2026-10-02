import { useSyncExternalStore } from 'react';
import type { ContactValues } from '../booking/contactSchema';

// The contact details travel to the payment step in sessionStorage, not the URL, so they never show up in history or logs.
const KEY = 'bookme:contact';

export const saveContact = (contact: ContactValues) => {
    try {
        sessionStorage.setItem(KEY, JSON.stringify(contact));
    } catch {
        // Storage can be blocked; the payment step then sends the user back to the event
    }
};

const read = () => {
    try {
        return sessionStorage.getItem(KEY);
    } catch {
        return null;
    }
};

const subscribe = () => () => {};

// null on the server and while hydrating, or when nothing was saved
export const useSavedContact = (): ContactValues | null => {
    const raw = useSyncExternalStore(subscribe, read, () => null);
    return raw ? (JSON.parse(raw) as ContactValues) : null;
};

export const hasSavedContact = () => read() !== null;
