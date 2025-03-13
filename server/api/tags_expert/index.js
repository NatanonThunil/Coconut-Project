import mysql from 'mysql2/promise';
import { dbConfig } from '../../config/poom_db_config';
import { readBody, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        if (event.req.method === 'GET') {
            const queryParams = getQuery(event);
            const { expert_id } = queryParams;
            if (!expert_id) {
                setResponseStatus(event, 400);
                return { error: 'Expert ID is required.' };
            }

            let query = `
                SELECT t.*
                FROM tags_for_experts t
                JOIN expertstags et ON t.id = et.tag_id
                WHERE et.expert_id = ?
            `;
            const values = [expert_id];

            const [rows] = await connection.execute(query, values);
            return rows.length ? rows : [];
        } else if (event.req.method === 'POST') {
            const body = await readBody(event);
            const { expert_id, text, text_en } = body;

            if (!expert_id || !text || !text_en) {
                setResponseStatus(event, 400);
                return { error: 'Expert ID, text, and text_en are required.' };
            }

            const [tagResult] = await connection.execute('SELECT id FROM tags_for_experts WHERE text = ?', [text]);
            let tagId;
            if (tagResult.length > 0) {
                tagId = tagResult[0].id;
            } else {
                const [newTagResult] = await connection.execute('INSERT INTO tags_for_experts (text, text_en) VALUES (?, ?)', [text, text_en]);
                tagId = newTagResult.insertId;
            }

            const query = 'INSERT INTO expertstags (expert_id, tag_id) VALUES (?, ?)';
            const values = [expert_id, tagId];

            const [result] = await connection.execute(query, values);
            return { message: 'Tag added successfully', id: result.insertId };
        }
    } catch (error) {
        console.error('Error handling tags:', error.message, error.stack);
        setResponseStatus(event, 503);
        return { error: 'Failed to handle tags' };
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});
