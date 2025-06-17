import { CreateEventRequest, Event, EventsQuery, UpdateEventRequest } from '../types';

export interface EventRepository {
    findAll(query: EventsQuery): Promise<{ events: Event[]; total: number }>;
    findById(id: number): Promise<Event | null>;
    create(event: CreateEventRequest): Promise<Event>;
    update(id: number, event: UpdateEventRequest): Promise<Event | null>;
    delete(id: number): Promise<boolean>;
    getVenues(): Promise<{ id: number; name: string }[]>;
    getOrganizers(): Promise<{ id: number; name: string }[]>;
}

export interface OrganizerRepository {
    findAll(): Promise<any[]>;
    findById(id: number): Promise<any | null>;
    create(organizer: any): Promise<any>;
}

export interface VenueRepository {
    findAll(): Promise<any[]>;
    findById(id: number): Promise<any | null>;
    create(venue: any): Promise<any>;
}
