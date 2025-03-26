export default defineEventHandler(async (event) => {
    let connection;
    try {
        connection = event.context.$scriptdb;

        const [rows] = await connection.execute('SELECT * FROM `new`');

        if (rows.length === 0) {
            return { message: 'No news available.' };
        }

        const newsItems = rows.map((news: any) => {
            let imageBase64 = null;
            if (news.image) {
                const imageBuffer = Buffer.from(news.image);
                let mimeType = 'image/jpeg';

                if (imageBuffer[0] === 0x89 && imageBuffer[1] === 0x50) {
                    mimeType = 'image/png';
                }

                imageBase64 = `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
            }

            return {
                ...news,
                image: imageBase64,
                description: news.description,
            };
        });

        return newsItems;
    } catch (error) {
        console.error('Error fetching news:', error);
        return { error: 'Failed to fetch news' };
    }
});
