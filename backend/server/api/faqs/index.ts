import { readBody } from 'h3';



export default defineEventHandler(async (event) => {
    let connection;
    try {
        connection = event.context.$scriptdb;

        if (event.req.method === 'GET') {
            const [rows] = await connection.execute('SELECT * FROM `faq`');

            if (rows.length === 0) {
                return { message: 'No FAQs available.' };
            }

            const faqs = rows.map((faq: { id: any; question: any; answer: any; question_en: any; answer_en: any; status: any; isadvice: any; }) => ({
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

            // Ensure isadvice is parsed as an integer (0 or 1)
            const query = 'INSERT INTO faq (question, answer, question_en, answer_en, status, isadvice) VALUES (?, ?, ?, ?, ?, ?)';
            const values = [
                question,
                answer,
                question_en,
                answer_en,
                status ? 1 : 0,
                isadvice ? 1 : 0 // Ensure isadvice is either 0 or 1
            ];

            const [result] = await connection.execute(query, values);
            const newId = result.insertId;

            return { message: 'FAQ added successfully', id: newId };
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error handling FAQ:', error.message, error.stack); // Log detailed error
        } else {
            console.error('Error handling FAQ:', error); // Log generic error
        }
        return { error: 'Failed to handle FAQ', details: error instanceof Error ? error.message : 'Unknown error' }; // Return detailed error message
    } finally {
        // Ensure the connection is closed or returned to the pool if applicable
        if (connection && typeof connection.release === 'function') {
            connection.release();
        } else if (connection && typeof connection.end === 'function') {
            await connection.end();
        }
    }
});
