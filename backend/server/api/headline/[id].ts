import path from 'path';
import fs from 'fs';

export default defineEventHandler(async (event) => {
    const method = event.node.req.method;
    const id = event.context.params?.id;

    if (!id) {
        console.error("Error: Headline ID is missing.");
        return { success: false, error: "Headline ID is required." };
    }

    let connection;
    try {
        const pool = event.context.$scriptdb;

        if (!pool) {
            console.error("Error: Database connection pool is not initialized.");
            return { success: false, error: "Database connection failed." };
        }

        connection = await pool.getConnection();

        if (method === 'GET') {
        
            

            try {
                const [rows] = await connection.execute('SELECT * FROM `tag_line` WHERE id = ?', [id]);

                if (!rows.length) {
                    console.error(`Error: No headline found with ID: ${id}`);
                    return { success: false, error: "Headline not found." };
                }

                const headline = rows[0];
                

                return {
                    success: true,
                    headline: {
                        id: headline.id,
                        text: headline.text || "Default tagline",
                        text_en: headline.text_en || '',
                        x: headline.x,
                        y: headline.y,
                        image: headline.image || '',
                        description: headline.description || '',
                    },
                };
            } catch (error) {
                console.error("Error fetching headline:", (error as Error).message);
                return { success: false, error: "Failed to fetch headline." };
            }
        }

        if (method === 'PUT') {
            const body = await readBody(event);
            let { text, text_en, x, y, image } = body;

            text = text ?? null;
            text_en = text_en ?? null;
            x = x ?? null;
            y = y ?? null;

            // Fetch the current image from the database
            let currentImage = null;
            const [rows] = await connection.execute('SELECT image FROM `tag_line` WHERE id = ?', [id]);
            if (rows.length) {
                currentImage = rows[0].image;
            }

            if (x !== null && (x < 0 || x > 100) || y !== null && (y < 0 || y > 100)) {
                return { success: false, error: "X and Y values must be between 0 and 100." };
            }

            if (image && !image.startsWith('/images/')) {
                return { success: false, error: "Invalid image path." };
            }

            // Delete the old image if a new image is provided
            if (image && image !== currentImage && currentImage && currentImage.startsWith('/images/')) {
                const oldImagePath = path.join(process.cwd(), 'public', currentImage);
                try {
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath); // Delete the old image
                    }
                } catch (error) {
                    console.error("Error deleting old image:", (error as Error).message);
                }
            }

            const query = `
                UPDATE tag_line 
                SET text = ?, text_en = ?, x = ?, y = ?, image = ?
                WHERE id = ?
            `;

            try {
                await connection.execute(query, [
                    text, text_en, x, y, image, id
                ]);
            } catch (error) {
                console.error("Error executing query:", (error as Error).message);
                return { success: false, error: "Failed to update headline in the database." };
            }

            return { success: true, message: "Headline updated successfully." };
        }

        console.error("Error: Invalid request method.");
        return { success: false, error: "Invalid request method." };

    } catch (error) {
        console.error("Error handling request:", error);
        return { success: false, error: "Failed to handle request." };
    } finally {
        if (connection) {
            connection.release(); 
        }
    }
});
