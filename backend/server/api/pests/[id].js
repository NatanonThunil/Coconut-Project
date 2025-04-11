import mysql from 'mysql2/promise';
import { dbConfig } from '../../config/poom_db_config';

const pool = mysql.createPool(dbConfig);

const createConnection = async () => {
    const connection = await pool.getConnection();
    return connection;
};

const imageToBuffer = (imageData) => {
    return Buffer.from(imageData, 'base64');
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
        const { id } = event.context.params;

        if (event.req.method === 'GET') {
            const [rows] = await connection.execute('SELECT * FROM pest WHERE id = ?', [id]);

            if (rows.length === 0) {
                return { error: 'Pest not found' };
            }

            const pest = rows[0];
            let imageBase64 = null;
            if (pest.image) {
                const mimeType = detectMimeType(pest.image);
                imageBase64 = `data:${mimeType};base64,${pest.image.toString('base64')}`;
            }

            return { pest: { ...pest, image: imageBase64 } };

        } else if (event.req.method === 'PUT') {
            const body = await readBody(event);

            const { name, name_en, sci_name, lifecycle, prevent, lifecycle_en, prevent_en, image } = body;

            let imageBuffer = null;
            if (image) {
                imageBuffer = imageToBuffer(image);
            }

            const [result] = await connection.execute(
                `UPDATE pest SET 
                    name = ?, name_en = ?, sci_name = ?, lifecycle = ?, prevent = ?, lifecycle_en = ?, prevent_en = ?, image = ?
                    WHERE id = ?`,
                [name, name_en, sci_name, lifecycle, prevent, lifecycle_en, prevent_en, imageBuffer, id]
            );

            if (result.affectedRows === 0) {
                return { error: 'Pest not found or no changes made' };
            }

            return { message: 'Pest updated' };

        } else if (event.req.method === 'DELETE') {
            const [result] = await connection.execute('DELETE FROM pest WHERE id = ?', [id]);

            if (result.affectedRows === 0) {
                return { error: 'Pest not found' };
            }

            return { message: 'Pest deleted' };

        } else {
            return { error: 'Method Not Allowed' };
        }

    } catch (error) {
        console.error('Error handling pest API request:', error);
        return { error: error.message || 'Failed to handle request' };
    } finally {
        if (connection) connection.release();
    }
});
