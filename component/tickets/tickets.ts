export type Ticket = {
    id: string;
    title: string;
    imageSrc: string;
    imageAlt: string;
    type?: string;
    location?: string;
    price: number;
    currency?: string;
    min?: number;
    max?: number;
};

