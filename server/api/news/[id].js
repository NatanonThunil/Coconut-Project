

import mysql from 'mysql2/promise';
import { dbConfig } from '../../config/poom_db_config';

const pool = mysql.createPool(dbConfig);

export default defineEventHandler(async (event) => {
    let connection;
    try {
        connection = await pool.getConnection();

        if (event.req.method === 'PUT') {
            const body = await readBody(event);
            const { id, title, description, author, upload_date, image, hot_new, summerize, status } = body;

            if (!id) return { error: 'News ID is required for updating.' };

            const formattedDate = upload_date ? new Date(upload_date).toISOString().slice(0, 19).replace('T', ' ') : null;
            let imageBuffer = image ? Buffer.from(image.split(',')[1], 'base64') : null;

            const query = `
                UPDATE new 
                SET title = ?, description = ?, author = ?, upload_date = ?, image = ?, hot_new = ?, summerize = ?, status = ?
                WHERE id = ?
            `;
            const values = [title, description, author, formattedDate, imageBuffer, hot_new ? 1 : 0, summerize, status ? 1 : 0, id];

            const [result] = await connection.execute(query, values);
            if (result.affectedRows === 0) return { error: 'No news found or no changes made.' };

            return { message: 'News updated successfully', id };
        } else if (event.req.method === 'POST') {
            const body = await readBody(event);
            const { title, description, author, upload_date, image, hot_new, summerize, status } = body;

            if (!title || !author) return { error: 'Title and author are required.' };

            const formattedDate = new Date(upload_date).toISOString().slice(0, 19).replace('T', ' ');
            let imageBuffer = image ? Buffer.from(image.split(',')[1], 'base64') : null;

            const query = 'INSERT INTO new (title, description, author, upload_date, image, hot_new, summerize, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            const values = [title, description, author, formattedDate, imageBuffer, hot_new ? 1 : 0, summerize, status ? 1 : 0];

            const [result] = await connection.execute(query, values);
            return { message: 'News added successfully', id: result.insertId };
        } else if (event.req.method === 'GET') {
            // Fetch all news
            const [rows] = await connection.execute(
                'SELECT id, title, description, author, upload_date, image, hot_new, summerize, status FROM new '
            );

            // Convert binary image data to base64
            const newsWithImages = rows.map(row => {
                if (row.image) {
                    row.image = `data:image/jpeg;base64,${row.image.toString('base64')}`;
                }
                return row;
            });

            return newsWithImages;

        } else if (event.req.method === 'DELETE') {
            const body = await readBody(event);
            console.log("Received DELETE Request:", body); // Log incoming request body
        
            const { id } = body;
        
            if (!id) {
                setResponseStatus(event, 400);
                return { error: 'News ID is required for deletion.' };
            }
        
            try {
                console.log("Attempting to delete news with ID:", id);
                const query = 'DELETE FROM new WHERE id = ?';
                const [result] = await connection.execute(query, [id]);
        
                console.log("Delete Query Result:", result);
        
                if (result.affectedRows === 0) {
                    setResponseStatus(event, 404);
                    return { error: 'No news found with the given ID.' };
                }
        
                setResponseHeader(event, 'Content-Type', 'application/json');
                setResponseStatus(event, 200);
                return { message: 'News deleted successfully', id };
        
            } catch (error) {
                console.error("Error deleting news:", error);
                setResponseStatus(event, 500);
                return { error: 'Internal server error' };
            }
        }
        
        
    } finally {
        if (connection) connection.release();
    }
});
