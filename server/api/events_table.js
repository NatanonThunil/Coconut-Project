import mysql from 'mysql2/promise';

export default defineEventHandler(async () => {
  const dbConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: 'asd123asd',
    database: 'events',
    port: 3306,
  };

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM events_table ORDER BY event_id DESC');

    const events = rows.map(event => {
      let imageBase64 = null;
      if (event.image) {
        imageBase64 = `data:image/jpeg;base64,${Buffer.from(event.image).toString('base64')}`;
      }

      return {
        ...event,
        image: imageBase64,
      };
    });

    await connection.end();

    return events;  // Return events directly
  } catch (error) {
    console.error('Error fetching events:', error);
    return { error: 'Failed to fetch events' };
  }
});
