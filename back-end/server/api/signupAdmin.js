import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { dbConfig } from '../config/poom_db_config';

const pool = mysql.createPool(dbConfig);

const createConnection = async () => {
    return await pool.getConnection();
};

export default defineEventHandler(async (event) => {
    let connection;
    try {
        connection = await createConnection();
        const body = await readBody(event);
        const { email, password } = body;

        if (!email || !password) {
            return { error: 'Email and password are required.' };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert administrator into the database
        const [result] = await connection.execute(
            'INSERT INTO administrators (email, password) VALUES (?, ?)',
            [email, hashedPassword]
        );

        return { message: 'Administrator registered successfully', id: result.insertId };

    } catch (error) {
        return { error: error.message || 'Registration failed' };
    } finally {
        if (connection) connection.release();
    }
});
