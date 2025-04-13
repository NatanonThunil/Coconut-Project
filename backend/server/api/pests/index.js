import mysql from 'mysql2/promise';
import { dbConfig } from '../../config/poom_db_config';

export default defineEventHandler(async () => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM `pest`');

        if (rows.length === 0) {
            return { message: 'No pests available.' };
        }

        const pests = rows.map((pest) => {
            let imageBase64 = null;
            if (pest.image) {
                const imageBuffer = Buffer.from(pest.image);
                let mimeType = 'image/jpeg'; 

                if (imageBuffer[0] === 0x89 && imageBuffer[1] === 0x50) {
                    mimeType = 'image/png';
                }

                imageBase64 = `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
            }

            return {
                ...pest,
                image: imageBase64,
                description: pest.description, 
            };
        });

        return pests;
    } catch (error) {
        console.error('Error fetching pests:', error);
        return { error: 'Failed to fetch pests' };
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});
