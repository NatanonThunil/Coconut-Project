import mysql from 'mysql2/promise';
import { dbConfig } from '../config/poom_db_config';

const pool = mysql.createPool(dbConfig);

const createConnection = async () => {
    const connection = await pool.getConnection();
    return connection;
};

const detectMimeType = (imageBuffer) => {
    const signature = imageBuffer.slice(0, 4).toString('hex');
    switch (signature) {
        case '89504e47': return 'image/png';
        case 'ffd8ffe0': return 'image/jpeg';
        case '47494638': return 'image/gif';
        default: return 'image/jpeg';
    }
};

export default defineEventHandler(async (event) => {
    let connection;
    try {
        connection = await createConnection();

        if (event.req.method === 'PUT') {
            const body = await readBody(event);
            const { id, title, description, author, upload_date, image, hot_new, summerize } = body;

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
                updateFields.push('upload_date = ?');
                values.push(upload_date);
            }
            if (hot_new !== undefined) {
                updateFields.push('hot_new = ?');
                values.push(hot_new);
            }
            if (summerize) {
                updateFields.push('summerize = ?');
                values.push(summerize);
            }

            if (image) {
                try {
                    // Remove 'data:image/png;base64,' prefix before decoding
                    const imageData = image.split(',')[1];
                    const imageBuffer = Buffer.from(imageData, 'base64');
                    const mimeType = detectMimeType(imageBuffer);

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
                return { error: 'No news found with the given ID.' };
            }

            return {
                message: 'News updated successfully',
                id: id,
            };
        } else {
            return { error: 'Method Not Allowed' };
        }

    } catch (error) {
        console.error('Error handling news update request:', error);
        return { error: error.message || 'Failed to handle request' };
    } finally {
        if (connection) connection.release();
    }
});
