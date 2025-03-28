const pdfToBuffer = (pdfData: string) => {
    if (!pdfData || !pdfData.includes(',')) {
        throw new Error('Invalid PDF data provided');
    }
    return Buffer.from(pdfData.split(',')[1], 'base64');
};

export default defineEventHandler(async (event) => {
    const method = event.node.req.method;
    let connection;
    try {
        connection = event.context.$scriptdb;

        if (method === 'GET') {
            const [rows] = await connection.execute('SELECT * FROM achievement');

            const achievements = rows.map((achievement: { pdf: Buffer | null }) => {
                let pdfBase64 = null;
                if (achievement.pdf && Buffer.isBuffer(achievement.pdf)) {
                    pdfBase64 = `data:application/pdf;base64,${achievement.pdf.toString('base64')}`;
                }
                return {
                    ...achievement,
                    pdf: pdfBase64,
                };
            });

            return { success: true, achievements };

        } else if (method === 'POST') {
            const body = await readBody(event);
            const { title, title_en, author, description, description_en, uploadDate, status, pdf } = body;

            // Validate required fields. Modify as needed.
            if (!title || !author || !pdf || !uploadDate || !status) {
                return { error: 'Missing required fields: title, author, PDF, uploadDate, and status are required.' };
            }

            const pdfBuffer = pdfToBuffer(pdf);

            const [result] = await connection.execute(
                `INSERT INTO achievement
                    (title, title_en, author, description, description_en, uploadDate, status, pdf) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [title, title_en, author, description, description_en, uploadDate, status, pdfBuffer]
            );

            return {
                success: true,
                message: 'Achievement added',
                id: result.insertId,
            };

        } else {
            return { error: 'Method Not Allowed' };
        }

    } catch (error) {
        console.error('Error handling achievement API request:', error);
        return { error: error instanceof Error ? error.message : 'An unexpected error occurred while handling the request' };
    }
});
