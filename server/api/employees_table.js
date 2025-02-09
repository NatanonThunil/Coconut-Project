import mysql from 'mysql2/promise';
import { dbConfig } from '../config/poom_db_config';

export default defineEventHandler(async () => {
  let connection;

  try {
    // Create a connection to MySQL database
    connection = await mysql.createConnection(dbConfig);

    // Fetch all news from the database
    const [rows] = await connection.execute('SELECT * FROM employee');

   

    if (rows.length === 0) {
      return { message: 'No members available.' };
    }

      // Convert each row's image BLOB to a Base64 data URL
      const employeen = rows.map((employee) => {
        let imageBase64 = null;
        if (employee.image) {
          // Determine the MIME type by checking the first few bytes of the image
          const imageBuffer = Buffer.from(employee.image);
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
        ...employee,
        image: imageBase64,
      };
    });

    // Return the news items with Base64-encoded images
    return employeen;
  } catch (error) {
    console.error('Error fetching members:', error);
    return {
      statusCode: 500,
      body: { error: 'Failed to fetch members' },
    };
  } finally {
    // Ensure the connection is closed even if an error occurs
    if (connection) {
      await connection.end();
    }
  }
});
