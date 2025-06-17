import { Knex } from 'knex';
import { CreateEventRequest, Event, EventsQuery, UpdateEventRequest } from '../types';
import { EventRepository } from './interfaces';

export class KnexEventRepository implements EventRepository {
    constructor(private db: Knex) { }

    async findAll(query: EventsQuery): Promise<{ events: Event[]; total: number }> {
        const {
            page = 1,
            limit = 10,
            search,
            sortBy = 'date',
            sortOrder = 'desc',
            organizer,
            venue,
            tags,
            dateFrom,
            dateTo
        } = query;

        let baseQuery = this.db('events')
            .select(
                'events.*',
                'organizers.name as organizer_name',
                'organizers.contact as organizer_contact',
                'venues.name as venue_name',
                'venues.location as venue_location'
            )
            .leftJoin('organizers', 'events.organizer_id', 'organizers.id')
            .leftJoin('venues', 'events.venue_id', 'venues.id');

        if (search) {
            baseQuery = baseQuery.where(function () {
                this.where('events.title', 'like', `%${search}%`)
                    .orWhere('events.description', 'like', `%${search}%`)
                    .orWhere('organizers.name', 'like', `%${search}%`)
                    .orWhere('venues.name', 'like', `%${search}%`);
            });
        }

        if (organizer) {
            baseQuery = baseQuery.where('organizers.name', 'like', `%${organizer}%`);
        }

        if (venue) {
            baseQuery = baseQuery.where('venues.name', 'like', `%${venue}%`);
        }

        if (dateFrom) {
            baseQuery = baseQuery.where('events.date', '>=', dateFrom);
        } if (dateTo) {
            baseQuery = baseQuery.where('events.date', '<=', dateTo);
        }

        if (tags) {
            const tagArray = tags.split(',').map(tag => tag.trim());
            baseQuery = baseQuery.whereExists(function () {
                this.select('*')
                    .from('event_tags')
                    .whereRaw('event_tags.event_id = events.id')
                    .whereIn('event_tags.tag', tagArray);
            });
        }

        let countQuery = this.db('events');

        if (search) {
            countQuery = countQuery.where(function () {
                this.where('events.title', 'like', `%${search}%`)
                    .orWhere('events.description', 'like', `%${search}%`)
                    .orWhereExists(function () {
                        this.select('*')
                            .from('organizers')
                            .whereRaw('organizers.id = events.organizer_id')
                            .andWhere('organizers.name', 'like', `%${search}%`);
                    })
                    .orWhereExists(function () {
                        this.select('*')
                            .from('venues')
                            .whereRaw('venues.id = events.venue_id')
                            .andWhere('venues.name', 'like', `%${search}%`);
                    });
            });
        }

        if (organizer) {
            countQuery = countQuery.whereExists(function () {
                this.select('*')
                    .from('organizers')
                    .whereRaw('organizers.id = events.organizer_id')
                    .andWhere('organizers.name', 'like', `%${organizer}%`);
            });
        }

        if (venue) {
            countQuery = countQuery.whereExists(function () {
                this.select('*')
                    .from('venues')
                    .whereRaw('venues.id = events.venue_id')
                    .andWhere('venues.name', 'like', `%${venue}%`);
            });
        }

        if (dateFrom) {
            countQuery = countQuery.where('events.date', '>=', dateFrom);
        } if (dateTo) {
            countQuery = countQuery.where('events.date', '<=', dateTo);
        }

        if (tags) {
            const tagArray = tags.split(',').map(tag => tag.trim());
            countQuery = countQuery.whereExists(function () {
                this.select('*')
                    .from('event_tags')
                    .whereRaw('event_tags.event_id = events.id')
                    .whereIn('event_tags.tag', tagArray);
            });
        }

        const [{ count }] = await countQuery.count('* as count');
        const total = parseInt(count as string);

        const events = await baseQuery
            .orderBy(`events.${sortBy}`, sortOrder)
            .limit(limit)
            .offset((page - 1) * limit);
        const eventIds = events.map(event => event.id);
        const eventTags = eventIds.length > 0
            ? await this.db('event_tags').whereIn('event_id', eventIds)
            : [];

        const eventsWithTags = events.map(event => ({
            ...event,
            organizer: {
                id: event.organizer_id,
                name: event.organizer_name,
                contact: event.organizer_contact
            },
            venue: {
                id: event.venue_id,
                name: event.venue_name,
                location: event.venue_location
            },
            tags: eventTags.filter(tag => tag.event_id === event.id).map(tag => tag.tag)
        }));

        return { events: eventsWithTags, total };
    }

    async findById(id: number): Promise<Event | null> {
        const event = await this.db('events')
            .select(
                'events.*',
                'organizers.name as organizer_name',
                'organizers.contact as organizer_contact',
                'venues.name as venue_name',
                'venues.location as venue_location'
            )
            .leftJoin('organizers', 'events.organizer_id', 'organizers.id')
            .leftJoin('venues', 'events.venue_id', 'venues.id')
            .where('events.id', id)
            .first();

        if (!event) return null;

        const tags = await this.db('event_tags')
            .where('event_id', id)
            .pluck('tag');

        return {
            ...event,
            organizer: {
                id: event.organizer_id,
                name: event.organizer_name,
                contact: event.organizer_contact
            },
            venue: {
                id: event.venue_id,
                name: event.venue_name,
                location: event.venue_location
            },
            tags
        };
    } async create(eventData: CreateEventRequest): Promise<Event> {
        const trx = await this.db.transaction();
        try {
            const { tags, ...eventFields } = eventData;

            const [result] = await trx('events').insert(eventFields).returning('id');
            const eventId = typeof result === 'object' ? result.id : result;

            if (tags && tags.length > 0) {
                const eventTags = tags.map(tag => ({
                    event_id: eventId,
                    tag
                }));
                await trx('event_tags').insert(eventTags);
            }

            await trx.commit();

            const event = await this.findById(eventId);
            return event!;
        } catch (error) {
            await trx.rollback();
            throw error;
        }
    }

    async update(id: number, eventData: UpdateEventRequest): Promise<Event | null> {
        const trx = await this.db.transaction();
        try {
            const { tags, ...eventFields } = eventData;

            await trx('events').where('id', id).update(eventFields);

            if (tags !== undefined) {
                await trx('event_tags').where('event_id', id).del();
                if (tags.length > 0) {
                    const eventTags = tags.map(tag => ({
                        event_id: id,
                        tag
                    }));
                    await trx('event_tags').insert(eventTags);
                }
            }

            await trx.commit();

            return await this.findById(id);
        } catch (error) {
            await trx.rollback();
            throw error;
        }
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.db('events').where('id', id).del();
        return result > 0;
    }

    async getVenues(): Promise<{ id: number; name: string }[]> {
        const venues = await this.db('venues')
            .select('id', 'name')
            .orderBy('name');

        return venues;
    }

    async getOrganizers(): Promise<{ id: number; name: string }[]> {
        const organizers = await this.db('organizers')
            .select('id', 'name')
            .orderBy('name');

        return organizers;
    }
}
