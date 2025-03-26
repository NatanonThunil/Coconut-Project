export default defineEventHandler(async (event) => {
    let connection;
    try {
        connection = event.context.$scriptdb;
        const { id } = event.context.params || {};

        if (!id) {
            setResponseStatus(event, 400);
            return { error: 'News ID is required for deletion.' };
        }

        const query = 'DELETE FROM new WHERE id = ?';
        const [result] = await connection.execute(query, [id]);

        if (result.affectedRows === 0) {
            setResponseStatus(event, 404);
            return { error: 'No news found with the given ID.' };
        }

        return { message: 'News deleted successfully', id };
    } catch (error) {
        console.error('Error deleting news:', error);
        setResponseStatus(event, 500);
        return { error: 'Internal server error' };
    }
});
