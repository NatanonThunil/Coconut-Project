import path from 'path';
import fs from 'fs/promises';

export default defineEventHandler(async (event) => {
    const method = event.node.req.method;
    let connection;

    try {
        connection = event.context.$scriptdb;

        if (!connection) {
            setResponseStatus(event, 500);
            return { error: 'Database connection not available.' };
        }

        const { id } = event.context.params || {};
        if (!id) {
            setResponseStatus(event, 400);
            return { error: 'News ID is required.' };
        }

        if (method === 'GET') {
            
            const [rows] = await connection.execute(
                'SELECT id, title, description, title_en, description_en, author, upload_date, image, hot_new, summerize, summerize_en, status FROM new WHERE id = ? AND status = 1',
                [id]
            );

            if (rows.length === 0) {
                setResponseStatus(event, 404);
                return { error: 'News not found.' };
            }

            let newsItem = rows[0];
       

            return newsItem;
        } else if (method === 'PUT') {
          
            const body = await readBody(event);

      
            const fields = [];
            const values = [];

            if (body.title !== undefined) {
                fields.push('title = ?');
                values.push(body.title || null);
            }
            if (body.description !== undefined) {
                fields.push('description = ?');
                values.push(body.description || null);
            }
            if (body.title_en !== undefined) {
                fields.push('title_en = ?');
                values.push(body.title_en || null);
            }
            if (body.description_en !== undefined) {
                fields.push('description_en = ?');
                values.push(body.description_en || null);
            }
            if (body.author !== undefined) {
                fields.push('author = ?');
                values.push(body.author || null);
            }
            if (body.image !== undefined) {
                if (typeof body.image === 'string' && body.image.startsWith('data:image')) {
                    try {
                        const base64Data = body.image.split(',')[1];
                        const imageName = `news_${Date.now()}.jpg`;
                        const imagePath = `/images/${imageName}`;
                        const fullPath = path.join(process.cwd(), 'public', 'images', imageName);
                        await fs.mkdir(path.dirname(fullPath), { recursive: true });
                        const buffer = Buffer.from(base64Data, 'base64');
                        await fs.writeFile(fullPath, buffer);
                        fields.push('image = ?');
                        values.push(imagePath);
                    } catch (err) {
                        console.error('Error saving image:', err);
                        setResponseStatus(event, 500);
                        return { error: 'Failed to save image.' };
                    }
                } else if (body.image) {
                    console.error('Invalid image format received.');
                    setResponseStatus(event, 400);
                    return { error: 'Invalid image format.' };
                }
            }
            if (body.hot_new !== undefined) {
                fields.push('hot_new = ?');
                values.push(body.hot_new ? 1 : 0);
            }
            if (body.summerize !== undefined) {
                fields.push('summerize = ?');
                values.push(body.summerize || null);
            }
            if (body.summerize_en !== undefined) {
                fields.push('summerize_en = ?');
                values.push(body.summerize_en || null);
            }
            if (body.status !== undefined) {
                fields.push('status = ?');
                values.push(body.status ? 1 : 0);
            }

            if (fields.length === 0) {
                setResponseStatus(event, 400);
                return { error: 'No fields provided for update.' };
            }

            const query = `
                UPDATE new 
                SET ${fields.join(', ')}
                WHERE id = ?
            `;
            values.push(id);

            const [result] = await connection.execute(query, values);
            if (result.affectedRows === 0) {
                setResponseStatus(event, 404);
                return { error: 'No news found or no changes made.' };
            }

            return { message: 'News updated successfully', id };
        } else if (method === 'DELETE') {
       
            const query = 'DELETE FROM new WHERE id = ?';
            const [result] = await connection.execute(query, [id]);

            if (result.affectedRows === 0) {
                setResponseStatus(event, 404);
                return { error: 'No news found with the given ID.' };
            }

            return { message: 'News deleted successfully', id };
        } else {
            setResponseStatus(event, 405);
            return { error: 'Method not allowed.' };
        }
    } catch (error) {
        console.error('Error handling request:', error);
        setResponseStatus(event, 500);
        return { error: 'Internal server error' };
    }
});
