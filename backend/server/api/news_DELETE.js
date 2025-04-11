import mysql from 'mysql2/promise';
import { dbConfig } from '../config/poom_db_config';

export default defineEventHandler(async (event) => {
    let connection;
    try {
        const { id } = await readBody(event);

        if (!id) {
            return {
                statusCode: 400,
                body: { error: 'News ID is required' },
            };
        }

        connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('DELETE FROM `new` WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return {
                statusCode: 404,
                body: { error: 'News not found' },
            };
        }

        return {
            message: 'News deleted successfully',
        };
    } catch (error) {
        console.error('Error deleting news:', error);
        return {
            statusCode: 500,
            body: { error: 'Failed to delete news' },
        };
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});
