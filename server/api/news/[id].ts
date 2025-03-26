export default defineEventHandler(async (event) => {
    let connection;
    try {

        connection = event.context.$scriptdb;
        if (!connection) {
            setResponseStatus(event, 500);
            return { error: 'Database connection not available.' };
        }
        const { id } = event.context.param || {};

        if (!id) {
            setResponseStatus(event, 400);
            return { error: 'News ID is required.' };
        }

        const [rows] = await connection.execute(
            'SELECT id, title, description, title_en, description_en, author, upload_date, image, hot_new, summerize, summerize_en, status FROM new WHERE id = ?',
            [id]
        );

        if (rows.length === 0) {
            setResponseStatus(event, 404);
            return { error: 'News not found.' };
        }

        let newsItem = rows[0];

        if (newsItem.image) {
            newsItem.image = `data:image/jpeg;base64,${newsItem.image.toString('base64')}`;
        }

        return newsItem;
    } catch (error) {
        console.error('Error fetching news by ID:', error);
        setResponseStatus(event, 500);
        return { error: 'Internal server error' };
    }
});
