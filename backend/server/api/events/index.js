import mysql from 'mysql2/promise';
import { dbConfig } from '../../config/poom_db_config';
import { readBody } from 'h3';

export default defineEventHandler(async (event) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        if (event.req.method === 'GET') {
            const [rows] = await connection.execute('SELECT * FROM `event`');

            if (rows.length === 0) {
                return { message: 'No events available.' };
            }

            const eventItems = rows.map((event) => {
                let imageBase64 = null;
                if (event.image) {
                    const imageBuffer = Buffer.from(event.image);
                    let mimeType = 'image/jpeg';

                    if (imageBuffer[0] === 0x89 && imageBuffer[1] === 0x50) {
                        mimeType = 'image/png';
                    }

                    imageBase64 = `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
                }

                const toBangkokTime = (dateStr) => {
                    const date = new Date(dateStr);
                    const bangkokOffset = 7 * 60 * 60 * 1000;
                    return new Date(date.getTime() + bangkokOffset).toISOString().slice(0, 19).replace('T', ' ');
                };

                return {
                    ...event,
                    image: imageBase64,
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
                imageBuffer = Buffer.from(imageData, 'base64');
            }

            const [result] = await connection.execute(
                'INSERT INTO `event` (title, title_en, organizer, date_start, date_end, location_name, location_name_en, location_url, register_url, description, description_en, event_category, image, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
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
