export default defineEventHandler(async (event) => {
    const method = event.node.req.method;
    let connection;
    try {
        connection = event.context.$scriptdb; 
        const id = event.context.params?.id;

        if (!id) return { error: 'Invalid or missing ID' };

        if (method === 'GET') {
            const [rows] = await connection.execute('SELECT * FROM achievement WHERE id = ?', [id]);

            if (!rows.length) {
                return { error: 'Achievement not found' };
            }

            const achievement = rows[0];
            return { 
                achievement: { 
                    ...achievement, 
                    pdf: achievement.pdf && Buffer.isBuffer(achievement.pdf)
                        ? `data:application/pdf;base64,${achievement.pdf.toString('base64')}`
                        : null 
                } 
            };

        } else if (method === 'PUT') {
            const body = await readBody(event);
            if (!body) return { error: 'Invalid request body' };

            const { title, title_en, author, description, description_en, uploadDate, status, pdf } = body;

            let pdfBuffer = pdf ? Buffer.from(pdf.split(',')[1], 'base64') : null;

            const [result] = await connection.execute(
                `UPDATE achievement SET 
                    title = ?, title_en = ?, author = ?, description = ?, 
                    description_en = ?, uploadDate = ?, status = ?, pdf = ?
                WHERE id = ?`,
                [title ?? null, title_en ?? null, author ?? null, description ?? null, 
                 description_en ?? null, uploadDate ?? null, status ?? null, pdfBuffer, id]
            );

            return result.affectedRows > 0 
                ? { message: 'Achievement updated' } 
                : { error: 'Achievement not found or no changes made' };

        } else if (method === 'DELETE') {
            const [result] = await connection.execute('DELETE FROM achievement WHERE id = ?', [id]);
            return result.affectedRows > 0 
                ? { message: 'Achievement deleted' } 
                : { error: 'Achievement not found' };

        } else {
            return { error: 'Method Not Allowed' };
        }

    } catch (error) {
        console.error('Error handling achievement API request:', error);
        return { error: error instanceof Error ? error.message : 'Failed to handle request' };
    }
});
