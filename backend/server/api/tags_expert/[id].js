import mysql from 'mysql2/promise';
import { dbConfig } from '../../config/poom_db_config';
import { readBody } from 'h3';

export default defineEventHandler(async (event) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const { id } = event.context.params;

        console.log(`Handling ${event.req.method} request for tag with ID: ${id}`);

        if (event.req.method === 'GET') {
            const [rows] = await connection.execute('SELECT * FROM tags_for_experts WHERE id = ?', [id]);
            if (rows.length === 0) {
                console.log('No tag found with the given ID.');
                return { error: 'No tag found with the given ID.' };
            }
            console.log('Tag found:', rows[0]);
            return rows[0];
        } else if (event.req.method === 'PUT') {
            const body = await readBody(event);
            const { text, text_en } = body;

            if (!text || !text_en) {
                console.log('Text and text_en are required.');
                return { error: 'Text and text_en are required.' };
            }

            const query = 'UPDATE tags_for_experts SET text = ?, text_en = ? WHERE id = ?';
            const values = [text, text_en, id];

            const [result] = await connection.execute(query, values);
            if (result.affectedRows === 0) {
                console.log('No tag found or no changes made.');
                return { error: 'No tag found or no changes made.' };
            }
            console.log('Tag updated successfully');
            return { message: 'Tag updated successfully' };
        } else if (event.req.method === 'DELETE') {
            const query = 'DELETE FROM tags_for_experts WHERE id = ?';
            const [result] = await connection.execute(query, [id]);

            if (result.affectedRows === 0) {
                console.log('No tag found with the given ID.');
                return { error: 'No tag found with the given ID.' };
            }
            console.log('Tag deleted successfully');
            return { message: 'Tag deleted successfully' };
        }
    } catch (error) {
        console.error('Error handling tag:', error);
        return { error: 'Failed to handle tag' };
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});
