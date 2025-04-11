import mysql from 'mysql2/promise';
import { dbConfig } from '../../config/poom_db_config';

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
            let imageBuffer = image ? Buffer.from(image.split(',')[1], 'base64') : null;

            const query = `
                UPDATE event 
                SET title = ?, organizer = ?, date_start = ?, date_end = ?, location_name = ?, location_url = ?, register_url = ?, description = ?, event_category = ?, image = ?, status = ?
                WHERE id = ?
            `;
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

            let imageBuffer = image ? Buffer.from(image.split(',')[1], 'base64') : null;

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

            const toBangkokTime = (dateStr) => {
                const date = new Date(dateStr);
                const bangkokOffset = 7 * 60 * 60 * 1000;
                return new Date(date.getTime() + bangkokOffset).toISOString().slice(0, 19).replace('T', ' ');
            };

            const eventWithImage = rows.map(row => {
                if (row.image) {
                    row.image = `data:image/jpeg;base64,${row.image.toString('base64')}`;
                }
                return {
                    ...row,
                    date_start: toBangkokTime(row.date_start),
                    date_end: toBangkokTime(row.date_end)
                };
            });

            return eventWithImage[0];
        } else if (event.req.method === 'DELETE') {
            if (!id) {
                setResponseStatus(event, 400);
                return { error: 'Event ID is required for deletion.' };
            }

            const query = 'DELETE FROM event WHERE id = ?';
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
