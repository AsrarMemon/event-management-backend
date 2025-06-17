import { Knex } from 'knex';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

const config: Knex.Config = {
    client: 'pg',
    connection: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'event_management',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'admin',
    },
    pool: {
        min: 2,
        max: 10
    },
    migrations: {
        directory: './migrations',
        tableName: 'knex_migrations'
    },
    seeds: {
        directory: './seeds'
    }
};

export default config;
