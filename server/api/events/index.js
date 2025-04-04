import mysql from 'mysql2/promise';
import { dbConfig } from '../../config/poom_db_config';
import { readBody } from 'h3';
import path from 'path';
import fs from 'fs/promises';

export default defineEventHandler(async (event) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        if (event.req.method === 'GET') {
            const [rows] = await connection.execute('SELECT * FROM `event`'); // Ensure this is specific to "events"

            if (rows.length === 0) {
                return { message: 'No events available.' };
            }

            const eventItems = rows.map((event) => {
                const baseUrl = process.env.BASE_URL || '';
                const toBangkokTime = (dateStr) => {
                    const date = new Date(dateStr);
                    const bangkokOffset = 7 * 60 * 60 * 1000;
                    return new Date(date.getTime() + bangkokOffset).toISOString().slice(0, 19).replace('T', ' ');
                };

                return {
                    ...event,
                    image: event.image ? `${baseUrl}${event.image}` : null, // Add base URL to image path
                    description: event.description,
                    date_start: toBangkokTime(event.date_start),
                    date_end: toBangkokTime(event.date_end),
                    organizer: event.organizer,
                    title: event.title,
                    location_name: event.location_name,
                    location_url: event.location_url,
                    register_url: event.register_url,
                    event_category: event.event_category,
                    title_en: event.title_en,
                    description_en: event.description_en,
                    location_name_en: event.location_name_en,
                    status: event.status
                };
            });

            return eventItems;
        } else if (event.req.method === 'POST') {
            const body = await readBody(event);
            const { title, title_en, organizer, date_start, date_end, location_name, location_name_en, location_url, register_url, description, description_en, event_category, image, status } = body;

            const toBangkokTime = (dateStr) => {
                const date = new Date(dateStr);
                const bangkokOffset = 7 * 60 * 60 * 1000;
                return new Date(date.getTime() + bangkokOffset).toISOString().slice(0, 19).replace('T', ' ');
            };

            const formattedDateStart = date_start ? toBangkokTime(date_start) : null;
            const formattedDateEnd = date_end ? toBangkokTime(date_end) : null;

            let imageBuffer = null;
            if (image) {
                const imageData = image.split(',')[1];
                const imageName = `event_${Date.now()}.jpg`;
                const imagePath = `/images/${imageName}`;
                const fullPath = path.join(process.cwd(), 'public', 'images', imageName);
                await fs.mkdir(path.dirname(fullPath), { recursive: true });
                const buffer = Buffer.from(imageData, 'base64');
                await fs.writeFile(fullPath, buffer);
                imageBuffer = imagePath; // Store the image path
            }

            const query = `
                INSERT INTO \`event\` 
                (title, title_en, organizer, date_start, date_end, location_name, location_name_en, location_url, register_url, description, description_en, event_category, image, status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `; // Ensure this is specific to "events"

            const [result] = await connection.execute(
                query,
                [title, title_en, organizer, formattedDateStart, formattedDateEnd, location_name, location_name_en, location_url, register_url, description, description_en, event_category, imageBuffer, status]
            );

            return { message: 'Event created successfully', eventId: result.insertId };
        }
    } catch (error) {
        console.error('Error handling event:', error);
        return { error: 'Failed to handle event' };
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});
