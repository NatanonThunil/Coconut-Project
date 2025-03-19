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
        const { id } = event.context.params;

        if (event.req.method === 'GET') {
            const [rows] = await connection.execute('SELECT * FROM achievement WHERE id = ?', [id]);

            if (rows.length === 0) {
                return { error: 'Achievement not found' };
            }

            const achievement = rows[0];
            let pdfBase64 = null;
            if (achievement.pdf) {
                pdfBase64 = `data:application/pdf;base64,${achievement.pdf.toString('base64')}`;
            }

            return { achievement: { ...achievement, pdf: pdfBase64 } }; // Ensure the response is structured

        } else if (event.req.method === 'PUT') {
            const body = await readBody(event);

            const { title, author, description, uploadDate, status, pdf , canDownload} = body;

            let pdfBuffer = null;
            if (pdf) {
                pdfBuffer = pdfToBuffer(pdf);
            }

            const [result] = await connection.execute(
                `UPDATE achievement SET 
                    title = ?, author = ?, description = ?, uploadDate = ?, status = ?, pdf = ? , canDownload = ?
                    WHERE id = ?`,
                [title, author, description, uploadDate, status, pdfBuffer, canDownload, id]
            );

            if (result.affectedRows === 0) {
                return { error: 'Achievement not found or no changes made' };
            }

            return { message: 'Achievement updated' };

        } else if (event.req.method === 'DELETE') {
            const [result] = await connection.execute('DELETE FROM achievement WHERE id = ?', [id]);

            if (result.affectedRows === 0) {
                return { error: 'Achievement not found' };
            }

            return { message: 'Achievement deleted' };

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
