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
      const query = 'SELECT * FROM new';
      const [rows] = await connection.execute(query);

      // Return the image path as-is (or add your base URL if needed)
      const processedRows = rows.map((row: { image: any; }) => ({
        ...row,
        image: row.image || null,
      }));

      return processedRows;
    } else if (method === 'POST') {
      const body = await readBody(event);
      const { title, description, title_en, description_en, author, image, hot_new, summerize, summerize_en, status } = body;

      if (!title || !author || typeof status === 'undefined') {
        setResponseStatus(event, 400);
        return { error: 'Missing required fields: title, author, or status.' };
      }

      // Set default imagePath to null. It will be updated if an image is provided.
      let imagePath = null;

      // If a new image is provided, process it and store it on disk.
      if (image && image.startsWith('data:image')) {
        // Extract the base64 part from the data URI
        const base64Data = image.split(',')[1];

        // Generate a unique filename
        const imageName = `news_${Date.now()}.jpg`;

        // Define the relative path (this path is stored in the database)
        imagePath = `/images/${imageName}`;

        // Define the full file system path (adjust 'public' if needed)
        const fullPath = path.join(process.cwd(), 'public', 'images', imageName);

        // Ensure the directory exists
        await fs.mkdir(path.dirname(fullPath), { recursive: true });

        // Write the image buffer to disk
        const buffer = Buffer.from(base64Data, 'base64');
        await fs.writeFile(fullPath, buffer);

        console.log('Image saved to:', fullPath);
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
        imagePath, // Save file path instead of binary data
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
