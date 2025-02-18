import mysql from 'mysql2/promise';
import { dbConfig } from '../../config/poom_db_config';

const pool = mysql.createPool(dbConfig);

export default defineEventHandler(async (event) => {
    const method = event.node.req.method;
    const id = event.context.params?.id;

    if (!id) {
        return { success: false, error: "Headline ID is required." };
    }

    let connection;
    try {
        connection = await pool.getConnection();

        if (method === 'PUT') {
            const body = await readBody(event);
            let {  text, text_en, x, y,image } = body;
            
            text = text ?? null;
            text_en = text_en ?? null;
            x = x ?? null;
            y = y ?? null;
           

            if (x !== null && (x < 0 || x > 100) || y !== null && (y < 0 || y > 100)) {
                return { success: false, error: "X and Y values must be between 0 and 100." };
            }

            let imageBuffer = null;
            if (image && image.startsWith("data:image")) {
                const base64Data = image.split(",")[1];
                imageBuffer = Buffer.from(base64Data, "base64");
            }

            const query = `
                UPDATE tag_line 
                SET  text = ?, text_en = ?, x = ?, y = ?, image = ?
                WHERE id = ?
            `;

            await connection.execute(query, [
                , text, text_en, x, y, imageBuffer, id
            ]);

            return { success: true, message: "Headline updated successfully." };
        }

        return { success: false, error: "Invalid request method." };

    } catch (error) {
        console.error("Error updating headline:", error);
        return { success: false, error: "Failed to update headline." };
    } finally {
        if (connection) connection.release();
    }
});
