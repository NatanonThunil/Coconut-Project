export default defineEventHandler(async (event) => {
    const method = event.node.req.method;
    let connection;

    try {
        connection = event.context.$scriptdb;

        if (!connection) {
            console.error('Database connection is not established.');
            setResponseStatus(event, 500);
            return { error: 'Database connection failed.' };
        }

        if (method === 'GET') {
    
            const query = 'SELECT * FROM new';
            const [rows] = await connection.execute(query);


            const processedRows = rows.map((row: { image: { toString: (arg0: string) => any; }; }) => ({
                ...row,
                image: row.image ? `data:image/jpeg;base64,${row.image.toString('base64')}` : null,
            }));

            return processedRows;
        } else if (method === 'POST') {
     
            const body = await readBody(event);
            const { title, description, title_en, description_en, author, image, hot_new, summerize, summerize_en, status } = body;


            if (!title || !author || typeof status === 'undefined') {
                setResponseStatus(event, 400);
                return { error: 'Missing required fields: title, author, or status.' };
            }

            const imageBuffer = image ? Buffer.from(image.split(',')[1], 'base64') : null;

        
            const uploadDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

            const query = `
                INSERT INTO new (title, description, title_en, description_en, author, image, hot_new, summerize, summerize_en, status, upload_date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const values = [
                title,
                description || null,
                title_en || null,
                description_en || null,
                author,
                imageBuffer,
                hot_new ? 1 : 0,
                summerize || null,
                summerize_en || null,
                status ? 1 : 0,
                uploadDate,
            ];

            const [result] = await connection.execute(query, values);
            return { message: 'News created successfully', id: result.insertId };
        } else {
            setResponseStatus(event, 405);
            return { error: 'Method not allowed.' };
        }
    } catch (error) {
        console.error('Error handling request:', (error as Error).message);
        console.error('Stack trace:', (error as Error).stack);
        setResponseStatus(event, 500);
        return { error: 'Internal server error' };
    }
});
