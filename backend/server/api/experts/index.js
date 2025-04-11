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

            let query = 'SELECT e.*, GROUP_CONCAT(t.text) AS tags FROM expert e LEFT JOIN expertstags et ON e.id = et.expert_id LEFT JOIN tags_for_experts t ON et.tag_id = t.id';
            const values = [];

            if (tag) {
                query += ' WHERE t.text = ?';
                values.push(tag);
            }

            query += ' GROUP BY e.id';

            const [rows] = await connection.execute(query, values);

            if (rows.length === 0) {
                return { message: 'No experts available.' };
            }

            const expertItems = rows.map((expert) => {
                let imageBase64 = null;
                if (expert.image) {
                    const imageBuffer = Buffer.from(expert.image);
                    let mimeType = 'image/jpeg'; 

                    if (imageBuffer[0] === 0x89 && imageBuffer[1] === 0x50) {
                        mimeType = 'image/png';
                    }

                    imageBase64 = `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
                }

                return {
                    ...expert,
                    image: imageBase64,
                    name: expert.name,
                    name_en: expert.name_en,
                    address: expert.address,
                    address_en: expert.address_en,
                    phoneNumber: expert.phoneNumber,
                    email: expert.email, // Add email field
                    description: expert.description,
                    description_en: expert.description_en,
                    status: expert.status,
                    type: expert.type, // Add type field
                    tags: expert.tags ? expert.tags.split(',') : []
                };
            });

            return expertItems;
        } else if (event.req.method === 'POST') {
            const body = await readBody(event);
            const { name, name_en, address, address_en, phoneNumber, email, image, description, description_en, status, type } = body;

            if (!name || !name_en) {
                return { error: 'Name and name_en are required.' };
            }

            let imageBuffer = null;
            if (image) {
                const imageData = image.split(',')[1];
                imageBuffer = Buffer.from(imageData, 'base64');
            }

            const [result] = await connection.execute(
                'INSERT INTO `expert` (name, name_en, address, address_en, phoneNumber, email, image, description, description_en, status, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
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
                    status !== undefined ? status : null,
                    type || null // Add type field
                ]
            );

            return { message: 'Expert created successfully', expertId: result.insertId };
        }
    } catch (error) {
        console.error('Error handling expert:', error);
        return { error: 'Failed to handle expert' };
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});
