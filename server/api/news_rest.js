import mysql from 'mysql2/promise';
import { dbConfig } from '../config/poom_db_config';


const pool = mysql.createPool(dbConfig);


const createConnection = async () => {
    return await pool.getConnection();
};

// Function to detect the MIME type of the image (for safety)
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
            const { title, description, author, upload_date, image, hot_new, summerize, status } = body;

        
            if (!title) {
                return { error: 'Title is required.' };
            }
            if (!author) {
                return { error: 'Author is required.' };
            }
            if (!upload_date) {
                return { error: 'Upload date is required.' };
            }
            if (!image) {
                return { error: 'Image is required.' };
            }
            if (typeof status !== 'number') {
                return { error: 'Status must be a number (0 or 1).' };
            }

            try {
               
                const imageData = image.split(',')[1];
                const imageBuffer = Buffer.from(imageData, 'base64');

            
                const [result] = await connection.execute(
                    `INSERT INTO new (title, description, author, upload_date, image, hot_new, summerize, status) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [title, description, author, upload_date, imageBuffer, hot_new ? 1 : 0, summerize, status]
                );

                return { message: 'News added successfully', id: result.insertId };
            } catch (err) {
                return { error: 'Invalid image format or database error.' };
            }
        } else {
            return { error: 'Method Not Allowed' };
        }
    } catch (error) {
        return { error: error.message || 'Failed to handle request' };
    } finally {
        if (connection) connection.release();
    }
});
