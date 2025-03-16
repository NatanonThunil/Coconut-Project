import mysql from 'mysql2/promise';
import { dbConfig } from '../../config/poom_db_config';

const pool = mysql.createPool(dbConfig);

const createConnection = async () => {
    const connection = await pool.getConnection();
    return connection;
};

const pdfToBuffer = (pdfData) => {
    return Buffer.from(pdfData.split(',')[1], 'base64');
};

export default defineEventHandler(async (event) => {
    let connection;
    try {
        connection = await createConnection();

        if (event.req.method === 'GET') {
            const [rows] = await connection.execute('SELECT * FROM achievement');

            const achievements = rows.map((achievement) => {
                let pdfBase64 = null;
                if (achievement.pdf) {
                    pdfBase64 = `data:application/pdf;base64,${achievement.pdf.toString('base64')}`;
                }

                return {
                    ...achievement,
                    pdf: pdfBase64,
                };
            });

            return { achievements }; // Ensure the response is structured

        } else if (event.req.method === 'POST') {
            const body = await readBody(event);

            const { title, author, description, uploadDate, status, pdf } = body;

            if (!pdf) {
                return { error: 'PDF is required.' };
            }

            const pdfBuffer = pdfToBuffer(pdf);

            const [result] = await connection.execute(
                `INSERT INTO achievement
                    (title, author, description, uploadDate, status, pdf) 
                    VALUES (?, ?, ?, ?, ?, ?)`,
                [title, author, description, uploadDate, status, pdfBuffer]
            );

            return {
                message: 'Achievement added',
                id: result.insertId,
            };

        } else {
            return { error: 'Method Not Allowed' };
        }

    } catch (error) {
        console.error('Error handling achievement API request:', error);
        return { error: error.message || 'Failed to handle request' };
    } finally {
        if (connection) connection.release();
    }
});
