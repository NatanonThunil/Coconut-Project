import mysql from 'mysql2/promise';
import { dbConfig } from '../../config/poom_db_config';
import { readBody, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        if (event.req.method === 'GET') {
            const queryParams = getQuery(event);
            const { tag } = queryParams;

            let query = 'SELECT m.*, GROUP_CONCAT(t.text) AS tags FROM member m LEFT JOIN memberstags mt ON m.id = mt.member_id LEFT JOIN tags_for_members t ON mt.tag_id = t.id';
            const values = [];

            if (tag) {
                query += ' WHERE t.text = ?';
                values.push(tag);
            }

            query += ' GROUP BY m.id';

            const [rows] = await connection.execute(query, values);

            if (rows.length === 0) {
                return { message: 'No members available.' };
            }

            const memberItems = rows.map((member) => {
                let imageBase64 = null;
                if (member.image) {
                    const imageBuffer = Buffer.from(member.image);
                    let mimeType = 'image/jpeg'; 

                    if (imageBuffer[0] === 0x89 && imageBuffer[1] === 0x50) {
                        mimeType = 'image/png';
                    }

                    imageBase64 = `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
                }

                return {
                    ...member,
                    image: imageBase64,
                    name: member.name,
                    name_en: member.name_en,
                    address: member.address,
                    address_en: member.address_en,
                    phoneNumber: member.phoneNumber,
                    email: member.email, // Add email field
                    description: member.description,
                    description_en: member.description_en,
                    status: member.status,
                    tags: member.tags ? member.tags.split(',') : []
                };
            });

            return memberItems;
        } else if (event.req.method === 'POST') {
            const body = await readBody(event);
            const { name, name_en, address, address_en, phoneNumber, email, image, description, description_en, status } = body;

            if (!name || !name_en) {
                return { error: 'Name and name_en are required.' };
            }

            let imageBuffer = null;
            if (image) {
                const imageData = image.split(',')[1];
                imageBuffer = Buffer.from(imageData, 'base64');
            }

            const [result] = await connection.execute(
                'INSERT INTO `member` (name, name_en, address, address_en, phoneNumber, email, image, description, description_en, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    name || null,
                    name_en || null,
                    address || null,
                    address_en || null,
                    phoneNumber || null,
                    email || null, // Add email field
                    imageBuffer || null,
                    description || null,
                    description_en || null,
                    status !== undefined ? status : null
                ]
            );

            return { message: 'Member created successfully', memberId: result.insertId };
        }
    } catch (error) {
        console.error('Error handling member:', error);
        return { error: 'Failed to handle member' };
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});