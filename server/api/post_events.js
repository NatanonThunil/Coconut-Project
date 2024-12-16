import mysql from 'mysql2/promise';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
  const dbConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: 'asd123asd',
    database: 'events',  // Your database name
    port: 3306,
  };

  const form = formidable({
    uploadDir: path.join(process.cwd(), 'uploads'),
    keepExtensions: true,
    multiples: false,
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

    // Extract form fields
    const { event_id, title, organizer, date_start, date_end, location_url, register_url, description, event_category } = fields;
    const image = files.image;
    
    if (!event_id || !title || !organizer || !date_start || !date_end || !description || !image || !event_category) {
      throw new Error('Missing required fields');
    }

    // Read the image file as a buffer
    const imageBuffer = fs.readFileSync(image[0].filepath);
    fs.unlinkSync(image[0].filepath); // Clean up the temporary file

    // Create connection to MySQL database
    const connection = await mysql.createConnection(dbConfig);
    console.log('Database connection established successfully.');

    const location_name = fields.location_name ? fields.location_name[0] : 'Default Location';


    // Insert the data into the database
    const [result] = await connection.execute(
      `INSERT INTO events_table (event_id, image, title, organizer, date_start, date_end, location_name, location_url, register_url, description, event_category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        event_id[0],
        imageBuffer,
        title[0],
        organizer[0],
        date_start[0],
        date_end[0],
        location_name ? location_name[0] : null, // Handle optional location_name
        location_url[0],
        register_url[0],
        description[0],
        event_category[0],
      ]
    );
    
    

    console.log('Insert result:', result);

    // Close the database connection
    await connection.end();

    // Return success response
    return {
      statusCode: 201,
      body: {
        message: 'Event added successfully',
        eventId: result.insertId,
      },
    };
  } catch (error) {
    console.error('Error adding event:', error);
    return {
      statusCode: 500,
      body: { error: error.message || 'Failed to add event' },
    };
  }
});
