import fs from 'fs/promises';
import path from 'path';
import { readBody } from 'h3';
import multer from 'multer';
import express from 'express';

const app = express();

// Configure multer for file uploads
const upload = multer({ dest: 'uploads' });

// Serve static files from the 'public' directory
app.use('/static', express.static(path.join(process.cwd(), 'public')));

export default eventHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (!body || !body.image || !body.path) {
      return { statusCode: 400, body: { error: 'Image data or path is missing' } };
    }

    const { image, path: imagePath } = body;

    // Sanitize path to prevent directory traversal attacks
    const safePath = path.join('public/images', path.basename(imagePath));
    const fullPath = path.join(process.cwd(), safePath);

    // Decode Base64 image
    try {
      const buffer = Buffer.from(image, 'base64');

      // Debug safepath and fullpath
      console.log('Safe Path:', safePath);
      console.log('Full Path:', fullPath);

      // Ensure directory exists
      await fs.mkdir(path.dirname(fullPath), { recursive: true });

      // Save image
      await fs.writeFile(fullPath, buffer);

      return { statusCode: 200, body: { message: 'Image uploaded successfully', path: safePath } };
    } catch (error) {
      return { statusCode: 400, body: { error: 'Invalid Base64 image data' } };
    }

  } catch (error) {
    if (error instanceof Error) {
      console.error('Error uploading image:', error.message);
    } else {
      console.error('Error uploading image:', error);
    }
    return { statusCode: 500, body: { error: `Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}` } };
  }
});