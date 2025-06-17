import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import knex from 'knex';
import knexConfig from './database/knexfile';

import { EventController } from './controllers/eventController';
import { KnexEventRepository } from './repositories/eventRepository';
import { createMainRouter } from './routes/index';
import { EventService } from './services/eventService';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const db = knex(knexConfig);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const eventRepository = new KnexEventRepository(db);
const eventService = new EventService(eventRepository);
const eventController = new EventController(eventService);

app.use('/api', createMainRouter(eventController));


app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Event Management API is running' });
});

app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Health check: http://localhost:${port}/api/health`);
});
