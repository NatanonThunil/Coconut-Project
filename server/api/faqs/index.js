import mysql from 'mysql2/promise';
import { dbConfig } from '@/server/config/poom_db_config';

const pool = mysql.createPool(dbConfig);

export default defineEventHandler(async (event) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const method = event.req.method;

        if (method === 'PUT') {
            const body = await readBody(event);
            const { ids, status } = body;

            if (!Array.isArray(ids) || typeof status !== 'boolean') {
                return { success: false, message: 'Invalid input.' };
            }

            const query = 'UPDATE faq SET status = ? WHERE id IN (?)';
            const [result] = await connection.execute(query, [status ? 1 : 0, ids]);

            return { success: true, affectedRows: result.affectedRows };
        }

        const [rows] = await connection.execute('SELECT * FROM `faq`');

        if (!rows.length) {
            console.warn("Database Query: No active FAQs found.");
            return { success: false, message: 'No active FAQs available.' };
        }

        return {
            faqs: rows.map(faq => ({
                id: faq.id,
                question: faq.question,
                answer: faq.answer,
                question_en: faq.question_en,
                answer_en: faq.answer_en,
                status: faq.status,
                isadvice: faq.isadvice
            }))
        };

    } catch (error) {
        console.error('Error fetching FAQs:', error);
        return { success: false, error: 'Failed to fetch FAQs' };
    } finally {
        if (connection) connection.release();
    }
});
