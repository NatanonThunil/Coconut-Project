import mysql from 'mysql2/promise';
import { dbConfig } from '../../config/poom_db_config';

const pool = mysql.createPool(dbConfig);

export default defineEventHandler(async (event) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const method = event.req.method;

        if (method === 'PUT') {
            const body = await readBody(event);
            const {
                id, title, organizer, date_start, date_end, location_name, location_url,
                register_url, description, event_category, image, status
            } = body;

            if (!id) return { error: 'Event ID is required for updating.' };

            let imageBuffer = image ? Buffer.from(image.split(',')[1], 'base64') : null;
            const formattedDateStart = date_start ? new Date(date_start).toISOString().slice(0, 19).replace('T', ' ') : null;
            const formattedDateEnd = date_end ? new Date(date_end).toISOString().slice(0, 19).replace('T', ' ') : null;

            const query = `
                UPDATE event 
                SET title = ?, organizer = ?, date_start = ?, date_end = ?, location_name = ?, 
                    location_url = ?, register_url = ?, description = ?, event_category = ?, image = ?, status = ?
                WHERE id = ?
            `;
            const values = [title, organizer, formattedDateStart, formattedDateEnd, location_name,
                location_url, register_url, description, event_category, imageBuffer, status ? 1 : 0, id];

            const [result] = await connection.execute(query, values);
            if (result.affectedRows === 0) return { error: 'No event found or no changes made.' };

            return { message: 'Event updated successfully', id };

        } else if (method === 'POST') {
            const body = await readBody(event);
            const {
                title, organizer, date_start, date_end, location_name, location_url,
                register_url, description, event_category, image, status
            } = body;

            if (!title || !organizer) return { error: 'Title and organizer are required.' };

            let imageBuffer = image ? Buffer.from(image.split(',')[1], 'base64') : null;
            const formattedDateStart = date_start ? new Date(date_start).toISOString().slice(0, 19).replace('T', ' ') : null;
            const formattedDateEnd = date_end ? new Date(date_end).toISOString().slice(0, 19).replace('T', ' ') : null;

            const query = `
                INSERT INTO event (title, organizer, date_start, date_end, location_name, location_url,
                    register_url, description, event_category, image, status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const values = [title, organizer, formattedDateStart, formattedDateEnd, location_name,
                location_url, register_url, description, event_category, imageBuffer, status ? 1 : 0];

            const [result] = await connection.execute(query, values);
            return { message: 'Event added successfully', id: result.insertId };

        } else if (method === 'GET') {
            // Fetch all events
            const [rows] = await connection.execute(
                `SELECT id, image, title, organizer, date_start, date_end, location_name, location_url, 
                        register_url, description, event_category, status FROM event`
            );

            // Convert binary image data to base64
            const eventsWithImages = rows.map(row => {
                if (row.image) {
                    row.image = `data:image/jpeg;base64,${row.image.toString('base64')}`;
                }
                return row;
            });

            return eventsWithImages;

        } else if (method === 'DELETE') {
            const body = await readBody(event);
            console.log("Received DELETE Request:", body);

            const { id } = body;
            if (!id) {
                setResponseStatus(event, 400);
                return { error: 'Event ID is required for deletion.' };
            }

            try {
                console.log("Attempting to delete event with ID:", id);
                const query = 'DELETE FROM event WHERE id = ?';
                const [result] = await connection.execute(query, [id]);

                console.log("Delete Query Result:", result);

                if (result.affectedRows === 0) {
                    setResponseStatus(event, 404);
                    return { error: 'No event found with the given ID.' };
                }

                setResponseHeader(event, 'Content-Type', 'application/json');
                setResponseStatus(event, 200);
                return { message: 'Event deleted successfully', id };

            } catch (error) {
                console.error("Error deleting event:", error);
                setResponseStatus(event, 500);
                return { error: 'Internal server error' };
            }
        }

    } catch (error) {
        console.error("Database error:", error);
        return { error: 'Database connection failed' };
    } finally {
        if (connection) connection.release();
    }
});
