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
    multiples: false, // Only one file upload at a time
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

    // Destructure the form fields
    const { title, organizer, date_start, date_end, location_url, register_url, description, event_category } = fields;
    const image = files.image;

    // Validate the required fields
    if (!title || !organizer || !date_start || !date_end || !description || !image || !event_category) {
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
      `INSERT INTO events_table (image, title, organizer, date_start, date_end, location_name, location_url, register_url, description, event_category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        imageBuffer,         // Image as Buffer
        title[0],            // Title
        organizer[0],        // Organizer
        date_start[0],       // Start Date
        date_end[0],         // End Date
        location_name,       // Location Name (optional)
        location_url[0],     // Location URL
        register_url[0],     // Registration URL
        description[0],      // Description
        event_category[0],   // Event Category
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
        eventId: result.insertId, // Auto-generated ID by MySQL
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
