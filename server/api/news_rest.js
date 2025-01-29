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

        if (event.req.method === 'POST') {
            const body = await readBody(event);
            const { title, description, author, upload_date, image, hot_new } = body;

            if (!title || !author || !upload_date) {
                return { error: 'Title, author, and upload date are required.' };
            }

            if (!image) {
                return { error: 'Image is required.' };
            }

            try {
                // Remove the 'data:image/png;base64,' prefix before decoding
                const imageData = image.split(',')[1]; 
                const imageBuffer = Buffer.from(imageData, 'base64');
                const mimeType = detectMimeType(imageBuffer);

                const [result] = await connection.execute(
                    `INSERT INTO new (title, description, author, upload_date, image, hot_new) VALUES (?, ?, ?, ?, ?,?)`,
                    [title, description, author, upload_date, imageBuffer, hot_new]
                );

                return {
                    message: 'News added successfully',
                    id: result.insertId,
                };
            } catch (err) {
                return { error: 'Invalid image format.' };
            }
        } else {
            return { error: 'Method Not Allowed' };
        }

    } catch (error) {
        console.error('Error handling news API request:', error);
        return { error: error.message || 'Failed to handle request' };
    } finally {
        if (connection) connection.release();
    }
});
