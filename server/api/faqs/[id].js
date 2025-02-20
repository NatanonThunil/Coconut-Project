import mysql from 'mysql2/promise';
import { dbConfig } from '@/server/config/poom_db_config';

const pool = mysql.createPool(dbConfig);

export default defineEventHandler(async (event) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const method = event.req.method;
        const id = event.context.params.id;
        if (!id) {
            return { error: 'FAQ ID is required.' };
        }
        if (method === 'GET') {
            const [rows] = await connection.execute(
                'SELECT * FROM faq WHERE id = ?',
                [id]
            );

            if (rows.length === 0) {
                return { error: 'FAQ not found.' };
            }

            return { success: true, faq: rows[0] };

        } else if (method === 'PUT') {
            // Update an existing FAQ
            const body = await readBody(event);
            const { question, answer, status } = body;

            if (!question || !answer) {
                return { error: 'Question and answer are required.' };
            }

            const query = `
                UPDATE faq
                SET question = ?, answer = ?, status = ? ,isadvice = ?
                WHERE id = ?
            `;
            const values = [question, answer, status ? 1 : 0, id];

            const [result] = await connection.execute(query, values);
            if (result.affectedRows === 0) {
                return { error: 'No FAQ found or no changes made.' };
            }

            return { message: 'FAQ updated successfully', id };

        } else if (method === 'DELETE') {
            // Delete an FAQ by ID
            const query = 'DELETE FROM faq WHERE id = ?';
            const [result] = await connection.execute(query, [id]);

            if (result.affectedRows === 0) {
                return { error: 'No FAQ found with the given ID.' };
            }

            return { message: 'FAQ deleted successfully', id };

        } else {
            return { error: 'Method not allowed.' };
        }

    } catch (error) {
        console.error('Database error:', error);
        return { error: 'Database connection failed' };
    } finally {
        if (connection) connection.release();
    }
});
