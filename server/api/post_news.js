import mysql from 'mysql2/promise';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
  const dbConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: 'asd123asd',
    database: 'news',
    port: 3306,
  };

  const form = formidable({
    uploadDir: path.join(process.cwd(), 'uploads'),
    keepExtensions: true,
    multiples: false, // Set to false to only allow one file upload at a time
  });

  try {
    // Parse the form data (including file)
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(event.node.req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    console.log('Received fields:', fields);
    console.log('Received files:', files);

    // Destructure required fields from the parsed form
    const { title, author, description, summerize, hotNew } = fields;
    const image = files.image;

    // Validate required fields
    if (!title || !author || !description || !image) {
      throw new Error('Missing required fields');
    }

    // Read the image file as a buffer
    const imageBuffer = fs.readFileSync(image[0].filepath);
    fs.unlinkSync(image[0].filepath); // Clean up the temporary file

    // Create connection to MySQL database
    const connection = await mysql.createConnection(dbConfig);
    console.log('Database connection established successfully.');

    // Insert the data into the database
    const [result] = await connection.execute(
      `INSERT INTO news_table (title, image, author, upload_date, description, summerize, hot_new)
       VALUES (?, ?, ?, NOW(), ?, ?, ?)`,
      [
        title[0],            // Title
        imageBuffer,         // Image as Buffer
        author[0],           // Author
        description[0],      // Description
        summerize ? summerize[0] : null, // Summary (optional)
        hotNew ? 1 : 0,      // Hot News (1 for true, 0 for false)
      ]
    );

    console.log('Insert result:', result);

    // Close the database connection
    await connection.end();

    // Return success response
    return {
      statusCode: 201,
      body: {
        message: 'News added successfully',
        newsId: result.insertId, // Return the auto-generated ID
      },
    };
  } catch (error) {
    console.error('Error adding news:', error);
    return {
      statusCode: 500,
      body: { error: error.message || 'Failed to add news' },
    };
  }
});
