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
            const [rows] = await connection.execute('SELECT * FROM coconut WHERE id = ?', [id]);

            if (rows.length === 0) {
                return { error: 'Coconut not found' };
            }

            const coconut = rows[0];
            let imageBase64 = null;
            if (coconut.image) {
                const mimeType = detectMimeType(coconut.image);
                imageBase64 = `data:${mimeType};base64,${coconut.image.toString('base64')}`;
            }

            return { coconut: { ...coconut, image: imageBase64 } }; // Ensure the response is structured

        } else if (event.req.method === 'PUT') {
            const body = await readBody(event);

            const { description, origin, name_eng, name_th, sci_name_f, sci_name_m, sci_name_l, characteristics, youngold, image, status } = body;

            let imageBuffer = null;
            if (image) {
                imageBuffer = imageToBuffer(image);
            }

            const [result] = await connection.execute(
                `UPDATE coconut SET 
                    description = ?, origin = ?, name_eng = ?, name_th = ?, sci_name_f = ?, sci_name_m = ?, sci_name_l = ?, characteristics = ?, youngold = ?, image = ?, status = ? 
                    WHERE id = ?`,
                [description, origin, name_eng, name_th, sci_name_f, sci_name_m, sci_name_l, characteristics, youngold, imageBuffer, status, id]
            );

            if (result.affectedRows === 0) {
                return { error: 'Coconut not found or no changes made' };
            }

            return { message: 'Coconut updated' };

        } else if (event.req.method === 'DELETE') {
            const [result] = await connection.execute('DELETE FROM coconut WHERE id = ?', [id]);

            if (result.affectedRows === 0) {
                return { error: 'Coconut not found' };
            }

            return { message: 'Coconut deleted' };

        } else {
            return { error: 'Method Not Allowed' };
        }

    } catch (error) {
        console.error('Error handling coconut API request:', error);
        return { error: error.message || 'Failed to handle request' };
    } finally {
        if (connection) connection.release();
    }
});
