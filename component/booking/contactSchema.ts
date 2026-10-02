import { z } from 'zod';

// National Cambodian number: optional leading 0, then 8-9 digits. A typed +855 / 855 prefix is ignored.
const khPhone = (value: string) => /^0?[1-9]\d{7,8}$/.test(value.replace(/[\s-]/g, '').replace(/^\+?855/, ''));

export const contactSchema = z.object({
    firstName: z.string().trim().min(1, 'This field is required'),
    lastName: z.string().trim().min(1, 'This field is required'),
    phone: z.string().trim().min(1, 'This field is required').refine(khPhone, 'Enter a valid Cambodian phone number'),
    email: z.string().trim().min(1, 'This field is required').email('Enter a valid email address'),
});

export type ContactValues = z.infer<typeof contactSchema>;
