// server/api/news_table.js
import mysql from 'mysql2/promise';

export default defineEventHandler(async (event) => {
  // Database connection configuration
  const dbConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: 'asd123asd',
    database: 'news',
    port: 3306,
  };

  try {
    // Create a connection to the database
    const connection = await mysql.createConnection(dbConfig);

    // Query to fetch news data
    const [rows] = await connection.execute(
      'SELECT news_id, image, author, upload_date, description, summerize, hot_new FROM news_table'
    );

    // Close the connection
    await connection.end();

    // Return the news data as a JSON response
    return rows;
  } catch (error) {
    console.error('Error fetching news data:', error);
    return {
      statusCode: 500,
      body: { error: 'Database query error' },
    };
  }
});
