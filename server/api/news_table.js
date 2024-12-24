import mysql from 'mysql2/promise';

export default defineEventHandler(async () => {
  // Database connection configuration
  const dbConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: 'asd123asd',
    database: 'news',
    port: 3306,
  };

  let connection;

  try {
    // Create a connection to MySQL database
    connection = await mysql.createConnection(dbConfig);

    // Fetch all news from the database
    const [rows] = await connection.execute('SELECT * FROM news_table ORDER BY id DESC');

    console.log('Fetched rows:', rows); // Debugging log

    if (rows.length === 0) {
      return { message: 'No news available.' };
    }

      // Convert each row's image BLOB to a Base64 data URL
      const newsItems = rows.map((news) => {
        let imageBase64 = null;
        if (news.image) {
          // Determine the MIME type by checking the first few bytes of the image
          const imageBuffer = Buffer.from(news.image);
          let mimeType = 'image/jpeg'; // Default to JPEG
  
          if (
            imageBuffer[0] === 0x89 &&
            imageBuffer[1] === 0x50 &&
            imageBuffer[2] === 0x4E &&
            imageBuffer[3] === 0x47
          ) {
            mimeType = 'image/png'; // PNG file signature
          }
  
          imageBase64 = `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
        }
        
      return {
        ...news,
        image: imageBase64,
      };
    });

    // Return the news items with Base64-encoded images
    return newsItems;
  } catch (error) {
    console.error('Error fetching news:', error);
    return {
      statusCode: 500,
      body: { error: 'Failed to fetch news' },
    };
  } finally {
    // Ensure the connection is closed even if an error occurs
    if (connection) {
      await connection.end();
    }
  }
});
