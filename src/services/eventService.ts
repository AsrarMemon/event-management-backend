import { EventRepository } from '../repositories/interfaces';
import { CreateEventRequest, Event, EventsQuery, UpdateEventRequest } from '../types';

export class EventService {
    constructor(private eventRepository: EventRepository) { }

    async getAllEvents(query: EventsQuery) {
        return await this.eventRepository.findAll(query);
    }

    async getEventById(id: number): Promise<Event | null> {
        return await this.eventRepository.findById(id);
    }

    async createEvent(eventData: CreateEventRequest): Promise<Event> {
        if (!eventData.title || !eventData.date) {
            throw new Error('Title and date are required');
        }

        return await this.eventRepository.create(eventData);
    }

    async updateEvent(id: number, eventData: UpdateEventRequest): Promise<Event | null> {
        const existingEvent = await this.eventRepository.findById(id);
        if (!existingEvent) {
            throw new Error('Event not found');
        }

        return await this.eventRepository.update(id, eventData);
    }

    async deleteEvent(id: number): Promise<boolean> {
        const existingEvent = await this.eventRepository.findById(id);
        if (!existingEvent) {
            throw new Error('Event not found');
        }

        return await this.eventRepository.delete(id);
    }

    async getVenues() {
        return await this.eventRepository.getVenues();
    }

    async getOrganizers() {
        return await this.eventRepository.getOrganizers();
    }
}
