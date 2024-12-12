import mysql from 'mysql2/promise';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
  // Database connection configuration
  const dbConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: 'asd123asd',
    database: 'news',
    port: 3306,
  };

  // Prepare the file handling
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(process.cwd(), 'uploads'); // Directory for file uploads
  form.keepExtensions = true;

  try {
    // Parse the form data (including file)
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(event.node.req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    // Destructure and validate fields
    const { newsId, title, author, description, summerize, hotNew } = fields;
    const image = files.image; // Image file from the form

    if (!newsId || !title || !author || !description || !image) {
      throw new Error('Missing required fields');
    }

    // Read the image file as a buffer
    const imageBuffer = fs.readFileSync(image.filepath); // Read file as binary buffer

    // Create connection to MySQL database
    const connection = await mysql.createConnection(dbConfig);

    // Insert the data into the database
    const [result] = await connection.execute(
      `INSERT INTO news_table (news_id, title, image, author, upload_date, description, summerize, hot_new)
       VALUES (?, ?, ?, ?, NOW(), ?, ?, ?)`,
      [
        newsId,
        title,
        imageBuffer, // Store image as binary data (BLOB)
        author,
        description,
        summerize || null,
        hotNew ? 1 : 0,
      ]
    );

    // Close the database connection
    await connection.end();

    // Return success response
    return {
      statusCode: 201,
      body: {
        message: 'News added successfully',
        newsId: result.insertId,
      },
    };
  } catch (error) {
    console.error('Error adding news:', error);
    return {
      statusCode: 500,
      body: { error: 'Failed to add news' },
    };
  }
});
