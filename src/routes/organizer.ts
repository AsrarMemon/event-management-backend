import { Router } from 'express';
import { EventController } from '../controllers/eventController';

export function createOrganizerRoutes(eventController: EventController): Router {
    const router = Router();
    router.get('/', eventController.getOrganizers);
    return router;
}