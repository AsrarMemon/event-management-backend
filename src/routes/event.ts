import { Router } from 'express';
import { EventController } from '../controllers/eventController';

export function createEventRoutes(eventController: EventController): Router {
    const router = Router();

    router.get('/', eventController.getAllEvents);
    router.get('/:id', eventController.getEventById);
    router.post('/', eventController.createEvent);
    router.put('/:id', eventController.updateEvent);

    return router;
}
