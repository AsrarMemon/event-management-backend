import { Router } from 'express';
import { EventController } from '../controllers/eventController';

export function createVenueRoutes(eventController: EventController): Router {
    const router = Router();
    router.get('/', eventController.getVenues);
    return router;
}