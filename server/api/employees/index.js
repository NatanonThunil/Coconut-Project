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

            let query = 'SELECT e.*, GROUP_CONCAT(t.text) AS tags FROM employee e LEFT JOIN employeestags et ON e.id = et.employee_id LEFT JOIN tags_for_employees t ON et.tag_id = t.id';
            const values = [];

            if (tag) {
                query += ' WHERE t.text = ?';
                values.push(tag);
            }

            query += ' GROUP BY e.id';

            const [rows] = await connection.execute(query, values);

            if (rows.length === 0) {
                return { message: 'No employees available.' };
            }

            const employeeItems = rows.map((employee) => {
                let imageBase64 = null;
                if (employee.image) {
                    const imageBuffer = Buffer.from(employee.image);
                    let mimeType = 'image/jpeg'; 

                    if (imageBuffer[0] === 0x89 && imageBuffer[1] === 0x50) {
                        mimeType = 'image/png';
                    }

                    imageBase64 = `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
                }

                return {
                    ...employee,
                    image: imageBase64,
                    name: employee.name,
                    name_en: employee.name_en,
                    address: employee.address,
                    address_en: employee.address_en,
                    phoneNumber: employee.phoneNumber,
                    email: employee.email, // Add email field
                    description: employee.description,
                    description_en: employee.description_en,
                    status: employee.status,
                    tags: employee.tags ? employee.tags.split(',') : []
                };
            });

            return employeeItems;
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
                'INSERT INTO `employee` (name, name_en, address, address_en, phoneNumber, email, image, description, description_en, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
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

            return { message: 'Employee created successfully', employeeId: result.insertId };
        }
    } catch (error) {
        console.error('Error handling employee:', error);
        return { error: 'Failed to handle employee' };
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});