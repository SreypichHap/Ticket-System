export type TicketTier = 'standard' | 'premium' | 'standing' | 'vip';

export type Ticket = {
    id: string;
    name: string;
    price: number;
    currency: string;
    image: string;
    soldOut: boolean;
    // Most tickets one order may hold (the API's max_quantity_per_order); null when the organizer set no limit
    maxPerOrder: number | null;
    // The variant the cart is filled with; the booking route looks it up itself, the browser only sends the ticket id
    variantId: string;
    // Zone label ("Zone A" or the ticket group name) and the venue it is held at
    zone: string;
    venue: string;
    tier: TicketTier;
    // Tier color, used as the dot in the ticket page's order summary
    color: string;
    // Gold "VIP · ZONE x" pill on the ticket card
    vip?: boolean;
};

export type TicketZone = { id: string; title: string; tickets: Ticket[] };

export type EventDetail = {
    slug: string;
    title: string;
    subtitle: string;
    banner: string;
    startAt: string;
    endAt: string;
    venue: { name: string; address: string; mapUrl: string };
    descriptionHtml: string;
    conditions: { intro: string; items: string[] };
    organizer: { name: string; logo: string; url: string };
    zones: TicketZone[];
};

export type Photo = { src: string; alt: string };

export type ThingToKnow = { type: 'notice'; text: string } | { type: 'rule'; icon: 'ban' | 'moon' | 'info'; label: string };

export type Stay = {
    slug: string;
    name: string;
    stars: number;
    area: string;
    hotline: string;
    photos: Photo[];
    description: string[];
    thingsToKnow: ThingToKnow[];
};

// Room booking: a stay's rooms are the vendor's products in the "Accommodations" taxon
export type RoomAttribute = { kind: 'guests' | 'bed' | 'size' | 'view'; label: string };

export type Room = {
    id: string;
    name: string;
    images: Photo[];
    attributes: RoomAttribute[];
    perks: string[];
    // Every property the API lists for the room (shown in the details sheet)
    amenities: string[];
    description: string;
    instantBooking: boolean;
    // Only set when the API reports a count
    roomsLeft?: number;
    soldOut: boolean;
    pricePerNight: number;
    currency: string;
};

export type StaySearch = { checkIn: string; checkOut: string; rooms: number; guests: number };
