import mysql from 'mysql2/promise';
import { dbConfig } from '../config/poom_db_config';
export default defineEventHandler(async () => {


  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM event ORDER BY id DESC');
    
    const events = rows.map((event) => {
      let imageBase64 = null;
      if (event.image) {
        // Determine the MIME type by checking the first few bytes of the image
        const imageBuffer = Buffer.from(event.image);
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
