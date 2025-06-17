import { Router } from 'express';
import { createEventRoutes } from './event';
import { createVenueRoutes } from './venue';
import { createOrganizerRoutes } from './organizer';
import { EventController } from '../controllers/eventController';

export function createMainRouter(eventController: EventController): Router {
    const router = Router();

    router.use('/events', createEventRoutes(eventController));
    router.use('/venues', createVenueRoutes(eventController));
    router.use('/organizers', createOrganizerRoutes(eventController));

    return router;
}