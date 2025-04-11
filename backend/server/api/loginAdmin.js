import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbConfig } from '../config/poom_db_config';

const pool = mysql.createPool(dbConfig);
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // Use environment variable

export default defineEventHandler(async (event) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const body = await readBody(event);
        const { email, password } = body;

        if (!email || !password) {
            setResponseStatus(event, 400);
            return { error: 'Email and password are required.' };
        }

        // Check if administrator exists
        const [rows] = await connection.execute(
            'SELECT * FROM administrators WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            setResponseStatus(event, 401);
            return { error: 'Administrator not found' };
        }

        const admin = rows[0];

        // Verify password securely
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            setResponseStatus(event, 401);
            return { error: 'Invalid credentials' };
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: admin.id, email: admin.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return { token, admin: { id: admin.id, email: admin.email } };

    } catch (error) {
        setResponseStatus(event, 500);
        return { error: 'Internal server error. Please try again later.' };
    } finally {
        if (connection) connection.release();
    }
});
