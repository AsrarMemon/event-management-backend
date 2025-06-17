export interface Organizer {
    id: number;
    name: string;
    contact: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface Venue {
    id: number;
    name: string;
    location: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface Event {
    id: number;
    title: string;
    description?: string;
    date: Date;
    venue_id: number;
    organizer_id: number;
    created_at?: Date;
    updated_at?: Date;
    venue?: Venue;
    organizer?: Organizer;
    tags?: string[];
}

export interface EventTag {
    id: number;
    event_id: number;
    tag: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface CreateEventRequest {
    title: string;
    description?: string;
    date: string;
    venue_id: number;
    organizer_id: number;
    tags?: string[];
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> { }

export interface EventsQuery {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    organizer?: string;
    venue?: string;
    tags?: string;
    dateFrom?: string;
    dateTo?: string;
}
