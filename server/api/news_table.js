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

  try {
    // Create a connection to MySQL database
    const connection = await mysql.createConnection(dbConfig);

    // Fetch all news from the database
    const [rows] = await connection.execute('SELECT * FROM news_table ORDER BY news_id DESC');

    // Convert each row's image BLOB to a Base64 data URL
    const newsItems = rows.map((news) => {
      let imageBase64 = null;
      if (news.image) {
        imageBase64 = `data:image/jpeg;base64,${Buffer.from(news.image).toString('base64')}`;
      }

      return {
        ...news,
        image: imageBase64,
      };
    });

    // Close the connection
    await connection.end();

    // Return the news items with Base64-encoded images
    return newsItems;
  } catch (error) {
    console.error('Error fetching news:', error);
    return {
      statusCode: 500,
      body: { error: 'Failed to fetch news' },
    };
  }
});
