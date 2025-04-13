import fs from 'fs/promises';
import path from 'path';
import { readBody, setResponseStatus } from 'h3';

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
      const query = 'SELECT * FROM new'; // Ensure this is specific to "news"
      const [rows] = await connection.execute(query);

      // Add base URL to image path
      const processedRows = rows.map((row: { image: any; }) => ({
        ...row,
        image: row.image ? `${process.env.BASE_URL || ''}${row.image}` : null,
      }));

      return processedRows;
    } else if (method === 'POST') {
      const body = await readBody(event);
      const { title, description, title_en, description_en, author, image, hot_new, summerize, summerize_en, status } = body;

      if (!title || !author || typeof status === 'undefined') {
        setResponseStatus(event, 400);
        return { error: 'Missing required fields: title, author, or status.' };
      }

      let imagePath = null;

      if (image && typeof image === 'string' && image.startsWith('data:image')) {
        try {
          const base64Data = image.split(',')[1];
          const imageName = `news_${Date.now()}.jpg`;
          imagePath = `/images/${imageName}`;
          const fullPath = path.join(process.cwd(), 'public', 'images', imageName);
          await fs.mkdir(path.dirname(fullPath), { recursive: true });
          const buffer = Buffer.from(base64Data, 'base64');
          await fs.writeFile(fullPath, buffer);
          console.log('Image saved to:', fullPath);
        } catch (err) {
          console.error('Error saving image:', err);
          setResponseStatus(event, 500);
          return { error: 'Failed to save image.' };
        }
      } else if (image) {
        console.error('Invalid image format received.');
        setResponseStatus(event, 400);
        return { error: 'Invalid image format.' };
      }

      const uploadDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

      const query = `
        INSERT INTO new 
          (title, description, title_en, description_en, author, image, hot_new, summerize, summerize_en, status, upload_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        title,
        description || null,
        title_en || null,
        description_en || null,
        author,
        imagePath, 
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
    console.error('Error handling request:', (error instanceof Error ? error.message : error));
    console.error('Stack trace:', (error instanceof Error ? error.stack : 'No stack trace available'));
    setResponseStatus(event, 500);
    return { error: 'Internal server error' };
  }
});
