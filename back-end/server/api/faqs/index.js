import mysql from 'mysql2/promise';
import { dbConfig } from '@/server/config/poom_db_config';
import { readBody } from 'h3';

const pool = mysql.createPool(dbConfig);

export default defineEventHandler(async (event) => {
    let connection;
    try {
        connection = await pool.getConnection();

        if (event.req.method === 'GET') {
            const [rows] = await connection.execute('SELECT * FROM `faq`');

            if (rows.length === 0) {
                return { message: 'No FAQs available.' };
            }

            const faqs = rows.map((faq) => ({
                id: faq.id,
                question: faq.question,
                answer: faq.answer,
                question_en: faq.question_en,
                answer_en: faq.answer_en,
                status: faq.status,
                isadvice: faq.isadvice
            }));

            return { faqs };

        } else if (event.req.method === 'POST') {
            const body = await readBody(event);
            const { question, answer, question_en, answer_en, status, isadvice } = body;

            if (!question || !answer) {
                return { error: 'Question and answer are required.' };
            }

            const query = 'INSERT INTO faq (question, answer, question_en, answer_en, status, isadvice) VALUES (?, ?, ?, ?, ?, ?)';
            const values = [question, answer, question_en, answer_en, status ? 1 : 0, isadvice ? 1 : 0];

            const [result] = await connection.execute(query, values);
            const newId = result.insertId;

            return { message: 'FAQ added successfully', id: newId };
        }
    } catch (error) {
        console.error('Error handling FAQ:', error);
        return { error: 'Failed to handle FAQ' };
    } finally {
        if (connection) connection.release();
    }
});
