export default defineEventHandler(async (event) => {
    let connection;
    try {
        connection = event.context.$scriptdb;

        if (!connection) {
            throw new Error('Database connection is not available.');
        }

        const { id } = event.context.params || {};
        if (!id) {
            console.error('Missing event ID in the request.');
            return { error: 'Event ID is required for updating.' };
        }

        if (event.req.method === 'PUT') {
            const body = await readBody(event);
            console.log('Received PUT payload:', body); // Debug log

            const { status } = body;

            if (typeof status === 'undefined' || status === null) { // Ensure status is checked for null/undefined
                console.error('Missing status in the payload.');
                return { error: 'Status is required.' };
            }

            const query = 'UPDATE event SET status = ? WHERE id = ?';
            const values = [status ? 1 : 0, id];

            console.log('Executing query:', query, 'with values:', values); // Debug log

            const [result] = await connection.execute(query, values);
            console.log('Query result:', result); // Debug log

            if (result.affectedRows === 0) {
                console.error('No event found with the given ID:', id);
                return { error: 'No event found with the given ID.' };
            }

            // Handle cases where no rows were changed but the query was successful
            if (result.changedRows === 0) {
                console.log('No changes made as the status is already set to the same value.');
                return { message: 'No changes made. Status is already up-to-date.', id };
            }

            return { message: 'Event status updated successfully', id };
        } else if (event.req.method === 'POST') {
            const body = await readBody(event);
            const { title, title_en, organizer, date_start, date_end, location_name, location_name_en, location_url, register_url, description, description_en, event_category, image, status } = body;

            if (!title || !organizer) return { error: 'Title and organizer are required.' };

            const isValidDate = (dateStr: string | number | Date) => !isNaN(new Date(dateStr).getTime());

            const toBangkokTime = (dateStr: string | number | Date) => {
                const date = new Date(dateStr);
                const bangkokOffset = 7 * 60 * 60 * 1000;
                return new Date(date.getTime() + bangkokOffset).toISOString().slice(0, 19).replace('T', ' ');
            };

            const formattedDateStart = isValidDate(date_start) ? toBangkokTime(date_start) : null;
            const formattedDateEnd = isValidDate(date_end) ? toBangkokTime(date_end) : null;

            if (!formattedDateStart || !formattedDateEnd) {
                return { error: 'Invalid start or end date.' };
            }

            let imageBuffer = image ? Buffer.from(image.split(',')[1], 'base64') : null;

            const query = `
                INSERT INTO event (title, title_en, organizer, date_start, date_end, location_name, location_name_en, location_url, register_url, description, description_en, event_category, image, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const values = [
                title || null,
                title_en || null,
                organizer || null,
                formattedDateStart || null,
                formattedDateEnd || null,
                location_name || null,
                location_name_en || null,
                location_url || null,
                register_url || null,
                description || null,
                description_en || null,
                event_category || null,
                imageBuffer || null,
                status !== undefined ? (status ? 1 : 0) : null
            ];

            const [result] = await connection.execute(query, values);
            if (result.affectedRows === 0) return { error: 'Event insertion failed.' };

            return { message: 'Event added successfully', id: result.insertId };
        } else if (event.req.method === 'GET') {
            const [rows] = await connection.execute(
                'SELECT id, title, organizer, date_start, date_end, location_name, location_url, register_url, description, event_category, image, status FROM event WHERE id = ?',
                [id]
            );

            if (rows.length === 0) return { error: 'No event found with the given ID.' };

            const toBangkokTime = (dateStr: string | number | Date) => {
                const date = new Date(dateStr);
                const bangkokOffset = 7 * 60 * 60 * 1000;
                return new Date(date.getTime() + bangkokOffset).toISOString().slice(0, 19).replace('T', ' ');
            };

            const eventWithImage = rows.map((row: { image: string; date_start: any; date_end: any; }) => {
                if (row.image) {
                    row.image = `data:image/jpeg;base64,${row.image}`;
                }
                return {
                    ...row,
                    date_start: toBangkokTime(row.date_start),
                    date_end: toBangkokTime(row.date_end)
                };
            });

            return eventWithImage[0];
        } else if (event.req.method === 'DELETE') {
            if (!id) {
                setResponseStatus(event, 400);
                return { error: 'Event ID is required for deletion.' };
            }

            const query = 'DELETE FROM event WHERE id = ?';
            const [result] = await connection.execute(query, [id]);

            if (result.affectedRows === 0) {
                setResponseStatus(event, 404);
                return { error: 'No event found with the given ID.' };
            }

            setResponseHeader(event, 'Content-Type', 'application/json');
            setResponseStatus(event, 200);
            return { message: 'Event deleted successfully', id };
        }
    } catch (error) {
        console.error('Error:', (error as Error).message);
        setResponseStatus(event, 500);
        return { error: 'Internal server error' };
    } finally {
        if (connection) {
            if (typeof connection.release === 'function') {
                connection.release();
            } else if (typeof connection.end === 'function') {
                await connection.end();
            }
        }
    }
});
