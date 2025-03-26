export default defineEventHandler(async (event) => {
    let connection;
    try {
        connection = event.context.$scriptdb;
        const body = await readBody(event);
        const { title, description, title_en, description_en, author, upload_date, image, hot_new, summerize, summerize_en, status } = body;

        if (!title || !description) {
            return { error: 'Title and description are required.' };
        }

        // Format date for MySQL
        const formattedDate = upload_date ? new Date(upload_date).toISOString().slice(0, 19).replace('T', ' ') : null;

        // Convert base64 image
        let imageBuffer = null;
        if (image) {
            try {
                imageBuffer = Buffer.from(image.split(',')[1], 'base64');
            } catch (err) {
                return { error: 'Invalid image format.' };
            }
        }

        // Insert data into the database
        const query = `
            INSERT INTO new (title, description, title_en, description_en, author, upload_date, image, hot_new, summerize, summerize_en, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [title, description, title_en, description_en, author, formattedDate, imageBuffer, hot_new ? 1 : 0, summerize, summerize_en, status ? 1 : 0];

        const [result] = await connection.execute(query, values);
        if (result.affectedRows === 0) {
            return { error: 'Failed to add news.' };
        }

        return { message: 'News item added successfully.', id: result.insertId };
    } catch (error) {
        console.error('Error adding news:', error);
        return { error: 'Failed to add news' };
    }
});
