import { Knex } from "knex";
import { faker } from "@faker-js/faker";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("event_tags").del();
    await knex("events").del();
    await knex("venues").del();
    await knex("organizers").del();

    console.log("Starting to seed database...");

    // Generate organizers
    const organizers = [];
    for (let i = 0; i < 100; i++) {
        organizers.push({
            name: faker.person.fullName(),
            contact: faker.internet.email(),
        });
    }

    const insertedOrganizers = await knex("organizers").insert(organizers).returning("id");
    console.log(`Inserted ${insertedOrganizers.length} organizers`);

    // Generate venues
    const venues = [];
    for (let i = 0; i < 200; i++) {
        venues.push({
            name: faker.company.name() + " " + faker.helpers.arrayElement(["Center", "Hall", "Arena", "Theater", "Auditorium"]),
            location: faker.location.city() + ", " + faker.location.state(),
        });
    }

    const insertedVenues = await knex("venues").insert(venues).returning("id");
    console.log(`Inserted ${insertedVenues.length} venues`);

    // Generate events
    const events = [];
    const eventTags = [];
    const tags = ["Tech", "Music", "Art", "Business", "Sports", "Education", "Health", "Food", "Fashion", "Gaming", "Science", "Culture"];

    for (let i = 0; i < 8000; i++) {
        const eventDate = faker.date.between({
            from: new Date('2024-01-01'),
            to: new Date('2025-12-31')
        });

        const event = {
            title: faker.helpers.arrayElement([
                "Annual", "International", "Global", "Regional", "Local", "Premium", "Exclusive", "Ultimate"
            ]) + " " + faker.helpers.arrayElement([
                "Conference", "Summit", "Workshop", "Seminar", "Symposium", "Convention", "Festival", "Expo", "Meetup", "Forum"
            ]) + " on " + faker.helpers.arrayElement([
                "Technology", "Innovation", "Leadership", "Entrepreneurship", "Digital Transformation", "Sustainability", "AI & Machine Learning", "Blockchain", "Cybersecurity", "Data Science"
            ]),
            description: faker.lorem.paragraphs(2),
            date: eventDate.toISOString(),
            venue_id: faker.helpers.arrayElement(insertedVenues).id || faker.number.int({ min: 1, max: 200 }),
            organizer_id: faker.helpers.arrayElement(insertedOrganizers).id || faker.number.int({ min: 1, max: 100 }),
        };

        events.push(event);
    }

    console.log("Inserting events...");
    const savedEvents = await knex("events").insert(events).returning("id");
    console.log(`Inserted ${savedEvents.length} events`);

    // Generate event tags
    console.log("Generating event tags...");
    for (const eventId of savedEvents) {
        const numTags = faker.number.int({ min: 1, max: 4 });
        const selectedTags = faker.helpers.arrayElements(tags, numTags);

        for (const tag of selectedTags) {
            eventTags.push({
                event_id: eventId.id || eventId,
                tag: tag,
            });
        }
    }

    console.log("Inserting event tags...");
    await knex("event_tags").insert(eventTags);
    console.log(`Inserted ${eventTags.length} event tags`);

    console.log("Database seeding completed!");
}
