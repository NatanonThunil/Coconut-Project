import mysql from 'mysql2/promise';
import { dbConfig } from '@/server/config/poom_db_config';

const pool = mysql.createPool(dbConfig);

export default defineEventHandler(async () => {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.execute('SELECT * FROM `tag_line` WHERE id = 1');

        if (!rows.length) {
            console.error("Database Query: No rows found in `tag_line` table.");
            return { success: false, message: 'No headlines available.' };
        }

        const headline = rows[0];

        let imageBase64 = null;
        if (headline.image && Buffer.isBuffer(headline.image)) {
            const mimeType = headline.image[0] === 0x89 && headline.image[1] === 0x50 ? 'image/png' : 'image/jpeg';
            imageBase64 = `data:${mimeType};base64,${headline.image.toString('base64')}`;
        }



        return {

            headline: {
                id: headline.id,

                text: headline.text || "Default tagline",  // Ensure fallback
                text_en: headline.text_en || '',
                x: headline.x,
                y: headline.y,
                image: imageBase64,
                description: headline.description || '',
            }
        };
    } catch (error) {
        console.error('Error fetching headline:', error);
        return { success: false, error: 'Failed to fetch headline' };
    } finally {
        if (connection) connection.release();
    }
});
