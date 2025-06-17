import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // Create organizers table
    await knex.schema.createTable('organizers', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('contact').notNullable();
        table.timestamps(true, true);
    });

    // Create venues table
    await knex.schema.createTable('venues', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('location').notNullable();
        table.timestamps(true, true);
    });

    // Create events table
    await knex.schema.createTable('events', (table) => {
        table.increments('id').primary();
        table.string('title').notNullable();
        table.text('description');
        table.datetime('date').notNullable();
        table.integer('venue_id').unsigned().references('id').inTable('venues').onDelete('CASCADE');
        table.integer('organizer_id').unsigned().references('id').inTable('organizers').onDelete('CASCADE');
        table.timestamps(true, true);
    });

    // Create event_tags table (many-to-many)
    await knex.schema.createTable('event_tags', (table) => {
        table.increments('id').primary();
        table.integer('event_id').unsigned().references('id').inTable('events').onDelete('CASCADE');
        table.string('tag').notNullable();
        table.unique(['event_id', 'tag']);
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('event_tags');
    await knex.schema.dropTableIfExists('events');
    await knex.schema.dropTableIfExists('venues');
    await knex.schema.dropTableIfExists('organizers');
}
