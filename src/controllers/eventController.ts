import { Request, Response } from 'express';
import { EventService } from '../services/eventService';
import { EventsQuery } from '../types';

export class EventController {
    constructor(private eventService: EventService) { }

    getAllEvents = async (req: Request, res: Response) => {
        try {
            const query: EventsQuery = {
                page: req.query.page ? parseInt(req.query.page as string) : 1,
                limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
                search: req.query.search as string,
                sortBy: req.query.sortBy as string,
                sortOrder: req.query.sortOrder as 'asc' | 'desc',
                organizer: req.query.organizer as string,
                venue: req.query.venue as string,
                tags: req.query.tags as string,
                dateFrom: req.query.dateFrom as string,
                dateTo: req.query.dateTo as string,
            };

            const result = await this.eventService.getAllEvents(query); res.json({
                success: true,
                events: result.events,
                pagination: {
                    page: query.page,
                    limit: query.limit,
                    total: result.total,
                    totalPages: Math.ceil(result.total / query.limit!)
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch events',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    getEventById = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid event ID'
                });
            }

            const event = await this.eventService.getEventById(id);

            if (!event) {
                return res.status(404).json({
                    success: false,
                    message: 'Event not found'
                });
            }

            res.json({
                success: true,
                data: event
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch event',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }; createEvent = async (req: Request, res: Response) => {
        try {
            const event = await this.eventService.createEvent(req.body);

            res.status(201).json({
                success: true,
                data: event,
                message: 'Event created successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Failed to create event',
                error: error instanceof Error ? error.message : 'Unknown error',
                details: error instanceof Error ? error.stack : undefined
            });
        }
    };

    updateEvent = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid event ID'
                });
            }

            const event = await this.eventService.updateEvent(id, req.body);

            res.json({
                success: true,
                data: event,
                message: 'Event updated successfully'
            });
        } catch (error) {
            const statusCode = error instanceof Error && error.message === 'Event not found' ? 404 : 400;
            res.status(statusCode).json({
                success: false,
                message: 'Failed to update event',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    deleteEvent = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid event ID'
                });
            }

            await this.eventService.deleteEvent(id);

            res.json({
                success: true,
                message: 'Event deleted successfully'
            });
        } catch (error) {
            const statusCode = error instanceof Error && error.message === 'Event not found' ? 404 : 400;
            res.status(statusCode).json({
                success: false,
                message: 'Failed to delete event',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    getVenues = async (req: Request, res: Response) => {
        try {
            const venues = await this.eventService.getVenues(); res.json({
                success: true,
                data: venues
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch venues',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    getOrganizers = async (req: Request, res: Response) => {
        try {
            const organizers = await this.eventService.getOrganizers();

            res.json({
                success: true,
                data: organizers
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch organizers',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };
}
