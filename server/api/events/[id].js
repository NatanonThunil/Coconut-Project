import mysql from 'mysql2/promise';
import { dbConfig } from '../../config/poom_db_config';
import path from 'path';
import fs from 'fs/promises';

const pool = mysql.createPool(dbConfig);

export default defineEventHandler(async (event) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const { id } = event.context.params;

        if (event.req.method === 'PUT') {
            const body = await readBody(event);
            const { title, organizer, date_start, date_end, location_name, location_url, register_url, description, event_category, image, status } = body;

            if (!id) return { error: 'Event ID is required for updating.' };

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
                UPDATE event 
                SET title = ?, organizer = ?, date_start = ?, date_end = ?, location_name = ?, location_url = ?, register_url = ?, description = ?, event_category = ?, image = ?, status = ?
                WHERE id = ?
            `; // Ensure this is specific to "events"
            const values = [title, organizer, formattedDateStart, formattedDateEnd, location_name, location_url, register_url, description, event_category, imageBuffer, status ? 1 : 0, id];

            const [result] = await connection.execute(query, values);
            if (result.affectedRows === 0) return { error: 'No event found or no changes made.' };

            return { message: 'Event updated successfully', id };
        } else if (event.req.method === 'POST') {
            const body = await readBody(event);
            const { title, organizer, date_start, date_end, location_name, location_url, register_url, description, event_category, image, status } = body;

            if (!title || !organizer) return { error: 'Title and organizer are required.' };

            const isValidDate = (dateStr) => !isNaN(new Date(dateStr).getTime());

            const toBangkokTime = (dateStr) => {
                const date = new Date(dateStr);
                const bangkokOffset = 7 * 60 * 60 * 1000;
                return new Date(date.getTime() + bangkokOffset).toISOString().slice(0, 19).replace('T', ' ');
            };

            const formattedDateStart = isValidDate(date_start) ? toBangkokTime(date_start) : null;
            const formattedDateEnd = isValidDate(date_end) ? toBangkokTime(date_end) : null;

            if (!formattedDateStart || !formattedDateEnd) {
                return { error: 'Invalid start or end date.' };
            }

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

            const query = 'INSERT INTO event (title, organizer, date_start, date_end, location_name, location_url, register_url, description, event_category, image, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            const values = [title, organizer, formattedDateStart, formattedDateEnd, location_name, location_url, register_url, description, event_category, imageBuffer, status ? 1 : 0];

            const [result] = await connection.execute(query, values);
            if (result.affectedRows === 0) return { error: 'Event insertion failed.' };

            return { message: 'Event added successfully', id: result.insertId };
        } else if (event.req.method === 'GET') {
            const [rows] = await connection.execute(
                'SELECT id, title, organizer, date_start, date_end, location_name, location_url, register_url, description, event_category, image, status FROM event WHERE id = ?',
                [id]
            );

            if (rows.length === 0) return { error: 'No event found with the given ID.' };

            const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

            const toBangkokTime = (dateStr) => {
                const date = new Date(dateStr);
                const bangkokOffset = 7 * 60 * 60 * 1000;
                return new Date(date.getTime() + bangkokOffset).toISOString().slice(0, 19).replace('T', ' ');
            };

            const eventWithImage = rows.map(row => ({
                ...row,
                image: row.image ? `${baseUrl}${row.image}` : null, // Add base URL to image path
                date_start: toBangkokTime(row.date_start),
                date_end: toBangkokTime(row.date_end),
            }));

            return eventWithImage[0];
        } else if (event.req.method === 'DELETE') {
            if (!id) {
                setResponseStatus(event, 400);
                return { error: 'Event ID is required for deletion.' };
            }

            const query = 'DELETE FROM event WHERE id = ?'; // Ensure this is specific to "events"
            const [result] = await connection.execute(query, [id]);

            if (result.affectedRows === 0) {
                setResponseStatus(event, 404);
                return { error: 'No event found with the given ID.' };
            }

            setResponseHeader(event, 'Content-Type', 'application/json');
            setResponseStatus(event, 200);
            return { message: 'Event deleted successfully', id };
        }
    } finally {
        if (connection) connection.release();
    }
});
