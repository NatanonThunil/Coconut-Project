import mysql from 'mysql2/promise';
import { dbConfig } from '../config/poom_db_config';


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


        if (event.req.method === 'GET') {
            const [rows] = await connection.execute('SELECT * FROM coconut');

            const coconuts = rows.map((coconut) => {
                let imageBase64 = null;
                if (coconut.image) {
                    const mimeType = detectMimeType(coconut.image);
                    imageBase64 = `data:${mimeType};base64,${coconut.image.toString('base64')}`;
                }

                return {
                    ...coconut,
                    image: imageBase64,
                };
            });

            return coconuts;

        }
        else if (event.req.method === 'POST') {
            const body = await readBody(event);

            const { description, origin, name_eng, name_th, sci_name_f, sci_name_m, sci_name_l, characteristics, youngold, image } = body;


            if (!image) {
                return { error: 'Image is required.' };
            }


            const imageBuffer = imageToBuffer(image);
            const mimeType = detectMimeType(imageBuffer);

            const [result] = await connection.execute(
                `INSERT INTO coconut 
                    (image, description, origin, name_eng, name_th, sci_name_f, sci_name_m, sci_name_l, characteristics, youngold) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [imageBuffer, description, origin, name_eng, name_th, sci_name_f, sci_name_m, sci_name_l, characteristics, youngold]
            );

            return {
                message: 'Coconut added',
                id: result.insertId,
            };

        }

        else {
            return { error: 'Method Not Allowed' };
        }

    } catch (error) {
        console.error('Error handling coconut API request:', error);
        return { error: error.message || 'Failed to handle request' };
    } finally {
        if (connection) connection.release();
    }
});
