export default defineEventHandler(async (event) => {
    let connection;
    try {
        connection = event.context.$scriptdb;
        const { id } = event.context.params || {};
        const body = await readBody(event);
        const { title, description, title_en, description_en, author, image, hot_new, summerize, summerize_en, status } = body;

        if (!id) {
            setResponseStatus(event, 400);
            return { error: 'News ID is required for updating.' };
        }

        let imageBuffer = image ? Buffer.from(image.split(',')[1], 'base64') : null;

        const query = `
            UPDATE new 
            SET title = ?, description = ?, title_en = ?, description_en = ?, author = ?, image = ?, hot_new = ?, summerize = ?, summerize_en = ?, status = ?
            WHERE id = ?
        `;
        const values = [
            title,
            description,
            title_en,
            description_en,
            author,
            imageBuffer,
            hot_new ? 1 : 0,
            summerize,
            summerize_en,
            status ? 1 : 0,
            id
        ];

        const [result] = await connection.execute(query, values);
        if (result.affectedRows === 0) {
            setResponseStatus(event, 404);
            return { error: 'No news found or no changes made.' };
        }

        return { message: 'News updated successfully', id };
    } catch (error) {
        console.error('Error updating news:', error);
        setResponseStatus(event, 500);
        return { error: 'Internal server error' };
    }
});
