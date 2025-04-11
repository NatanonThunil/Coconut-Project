import mysql from 'mysql2/promise';
import { dbConfig } from '../../config/poom_db_config';
import { readBody } from 'h3';

const pool = mysql.createPool(dbConfig);

export default defineEventHandler(async (event) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const { id } = event.context.params;

        if (event.req.method === 'PUT') {
            const body = await readBody(event);
            const { name, name_en, address, address_en, phoneNumber, email, image, description, description_en, status, tags, type } = body;

            if (!id) return { error: 'Expert ID is required for updating.' };

            let imageBuffer = null;
            if (image) {
                const imageData = image.split(',')[1];
                imageBuffer = Buffer.from(imageData, 'base64');
            }

            const query = `
                UPDATE expert 
                SET name = ?, name_en = ?, address = ?, address_en = ?, phoneNumber = ?, email = ?, image = ?, description = ?, description_en = ?, status = ?, type = ?
                WHERE id = ?
            `;
            const values = [name, name_en, address, address_en, phoneNumber, email, imageBuffer, description, description_en, status ? 1 : 0, type, id];

            const [result] = await connection.execute(query, values);
            if (result.affectedRows === 0) return { error: 'No expert found or no changes made.' };

            await connection.execute('DELETE FROM expertstags WHERE expert_id = ?', [id]);
            if (tags && tags.length > 0) {
                const tagInsertPromises = tags.map(async tag => {
                    const [tagResult] = await connection.execute('SELECT id FROM tags_for_experts WHERE text = ?', [tag]);
                    let tagId;
                    if (tagResult.length > 0) {
                        tagId = tagResult[0].id;
                    } else {
                        const [newTagResult] = await connection.execute('INSERT INTO tags_for_experts (text, text_en) VALUES (?, ?)', [tag, tag]);
                        tagId = newTagResult.insertId;
                    }
                    await connection.execute('INSERT INTO expertstags (expert_id, tag_id) VALUES (?, ?)', [id, tagId]);
                });
                await Promise.all(tagInsertPromises);
            }

            return { message: 'Expert updated successfully', id };
        } else if (event.req.method === 'GET') {
            const [rows] = await connection.execute(`
                SELECT e.*, GROUP_CONCAT(t.text) AS tags
                FROM expert e
                LEFT JOIN expertstags et ON e.id = et.expert_id
                LEFT JOIN tags_for_experts t ON et.tag_id = t.id
                WHERE e.id = ?
                GROUP BY e.id
            `, [id]);

            if (rows.length === 0) return { error: 'No expert found with the given ID.' };

            const expertWithImage = rows.map(row => {
                if (row.image) {
                    row.image = `data:image/jpeg;base64,${row.image.toString('base64')}`;
                }
                return {
                    ...row,
                    tags: row.tags ? row.tags.split(',') : []
                };
            });

            return expertWithImage[0];
        } else if (event.req.method === 'DELETE') {
            if (!id) {
                setResponseStatus(event, 400);
                return { error: 'Expert ID is required for deletion.' };
            }

            const query = 'DELETE FROM expert WHERE id = ?';
            const [result] = await connection.execute(query, [id]);

            if (result.affectedRows === 0) {
                setResponseStatus(event, 404);
                return { error: 'No expert found with the given ID.' };
            }

            setResponseHeader(event, 'Content-Type', 'application/json');
            setResponseStatus(event, 200);
            return { message: 'Expert deleted successfully', id };
        }
    } catch (error) {
        console.error('Error handling expert:', error);
        return { error: 'Failed to handle expert' };
    } finally {
        if (connection) connection.release();
    }
});
