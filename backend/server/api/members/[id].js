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
            const { name, name_en, address, address_en, phoneNumber, email, image, description, description_en, status, tags } = body;

            if (!id) return { error: 'Member ID is required for updating.' };
            if (!name) return { error: 'Name is required for updating.' };
            if (!name_en) return { error: 'Name (English) is required for updating.' };
            if (!address) return { error: 'Address is required for updating.' };

            let imageBuffer = null;
            if (image) {
                const imageData = image.split(',')[1];
                imageBuffer = Buffer.from(imageData, 'base64');
            }

            const query = `
                UPDATE member 
                SET name = ?, name_en = ?, address = ?, address_en = ?, phoneNumber = ?, email = ?, image = ?, description = ?, description_en = ?, status = ?
                WHERE id = ?
            `;
            const values = [
                name || null,
                name_en || null,
                address || null,
                address_en || null,
                phoneNumber || null,
                email || null,
                imageBuffer || null,
                description || null,
                description_en || null,
                status !== undefined ? status : null,
                id
            ];

            const [result] = await connection.execute(query, values);
            if (result.affectedRows === 0) return { error: 'No member found or no changes made.' };

            await connection.execute('DELETE FROM memberstags WHERE member_id = ?', [id]);
            if (tags && tags.length > 0) {
                const tagInsertPromises = tags.map(async tag => {
                    const [tagResult] = await connection.execute('SELECT id FROM tags_for_members WHERE text = ?', [tag]);
                    let tagId;
                    if (tagResult.length > 0) {
                        tagId = tagResult[0].id;
                    } else {
                        const [newTagResult] = await connection.execute('INSERT INTO tags_for_members (text, text_en) VALUES (?, ?)', [tag, tag]);
                        tagId = newTagResult.insertId;
                    }
                    await connection.execute('INSERT INTO memberstags (member_id, tag_id) VALUES (?, ?)', [id, tagId]);
                });
                await Promise.all(tagInsertPromises);
            }

            return { message: 'Member updated successfully', id };
        } else if (event.req.method === 'GET') {
            const [rows] = await connection.execute(`
                SELECT m.*, GROUP_CONCAT(t.text) AS tags
                FROM member m
                LEFT JOIN memberstags mt ON m.id = mt.member_id
                LEFT JOIN tags_for_members t ON mt.tag_id = t.id
                WHERE m.id = ?
                GROUP BY m.id
            `, [id]);

            if (rows.length === 0) return { error: 'No member found with the given ID.' };

            const memberWithImage = rows.map(row => {
                if (row.image) {
                    row.image = `data:image/jpeg;base64,${row.image.toString('base64')}`;
                }
                return {
                    ...row,
                    tags: row.tags ? row.tags.split(',') : []
                };
            });

            return memberWithImage[0];
        } else if (event.req.method === 'DELETE') {
            if (!id) {
                setResponseStatus(event, 400);
                return { error: 'Member ID is required for deletion.' };
            }

            const query = 'DELETE FROM member WHERE id = ?';
            const [result] = await connection.execute(query, [id]);

            if (result.affectedRows === 0) {
                setResponseStatus(event, 404);
                return { error: 'No member found with the given ID.' };
            }

            setResponseHeader(event, 'Content-Type', 'application/json');
            setResponseStatus(event, 200);
            return { message: 'Member deleted successfully', id };
        }
    } catch (error) {
        console.error('Error handling member:', error);
        return { error: 'Failed to handle member' };
    } finally {
        if (connection) connection.release();
    }
});
