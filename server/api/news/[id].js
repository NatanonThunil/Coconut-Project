import mysql from 'mysql2/promise';
import { dbConfig } from '../../config/poom_db_config';

const pool = mysql.createPool(dbConfig);

export default defineEventHandler(async (event) => {
    let connection;
    try {
        connection = await pool.getConnection();

        if (event.req.method === 'PUT') {
            // Read request body
            const body = await readBody(event);
            const { id, title, description, author, upload_date, image, hot_new, summerize, status } = body;

            if (!id) {
                return { error: 'News ID is required for updating.' };
            }

            let updateFields = [];
            let values = [];

            if (title) {
                updateFields.push('title = ?');
                values.push(title);
            }
            if (description) {
                updateFields.push('description = ?');
                values.push(description);
            }
            if (author) {
                updateFields.push('author = ?');
                values.push(author);
            }
            if (upload_date) {
                const formattedDate = new Date(upload_date).toISOString().slice(0, 19).replace('T', ' ');
                updateFields.push('upload_date = ?');
                values.push(formattedDate);
            }
            if (typeof hot_new !== 'undefined') {
                updateFields.push('hot_new = ?');
                values.push(hot_new ? 1 : 0);
            }
            if (summerize) {
                updateFields.push('summerize = ?');
                values.push(summerize);
            }
            if (typeof status !== 'undefined') {
                updateFields.push('status = ?');
                values.push(status ? 1 : 0);
            }

            // Handling image upload
            if (image) {
                try {
                    const imageData = image.split(',')[1]; // Extract base64 data
                    const imageBuffer = Buffer.from(imageData, 'base64');

                    updateFields.push('image = ?');
                    values.push(imageBuffer);
                } catch (err) {
                    return { error: 'Invalid image format.' };
                }
            }

            if (updateFields.length === 0) {
                return { error: 'No fields to update were provided.' };
            }

            values.push(id);
            const query = `UPDATE new SET ${updateFields.join(', ')} WHERE id = ?`;

            const [result] = await connection.execute(query, values);

            if (result.affectedRows === 0) {
                return { error: 'No news found with the given ID or no changes made.' };
            }

            return { message: 'News updated successfully', id: id };

        } else if (event.req.method === 'GET') {
            // Fetch all news
            const [rows] = await connection.execute('SELECT id, title, description, author, upload_date, hot_new, summerize, status FROM new');
            return rows;

        } else if (event.req.method === 'POST') {
            // Insert new news article
            const body = await readBody(event);
            const { title, description, author, upload_date, image, hot_new, summerize, status } = body;

            if (!title || !author) {
                return { error: 'Title and author are required.' };
            }

            const formattedDate = new Date(upload_date).toISOString().slice(0, 19).replace('T', ' ');
            const query = 'INSERT INTO new (title, description, author, upload_date, image, hot_new, summerize, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            const values = [title, description, author, formattedDate, image, hot_new ? 1 : 0, summerize, status ? 1 : 0];

            const [result] = await connection.execute(query, values);

            return { message: 'News added successfully', id: result.insertId };

        } else if (event.req.method === 'DELETE') {
            // Delete news
            const body = await readBody(event);
            const { id } = body;

            if (!id) {
                return { error: 'News ID is required for deletion.' };
            }

            const query = 'DELETE FROM new WHERE id = ?';
            const [result] = await connection.execute(query, [id]);

            if (result.affectedRows === 0) {
                return { error: 'No news found with the given ID.' };
            }

            return { message: 'News deleted successfully', id: id };
        }

        return { error: 'Method Not Allowed' };

    } catch (error) {
        console.error('Error handling news request:', error);
        return { error: error.message || 'Failed to handle request' };
    } finally {
        if (connection) connection.release();
    }
});
