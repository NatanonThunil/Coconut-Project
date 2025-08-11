import { Router } from 'express';
import express from 'express';
import fs from 'fs/promises';
import path from 'path';


const router = Router();
router.use(express.json());

router.post('/', async (req, res) => {
  try {
    const { image, path: imagePath } = req.body;

    if (!image || !imagePath) {
      return res.status(400).json({ error: 'Image data or path is missing' });
    }

    // Remove leading slash if present
    const fileName = path.basename(imagePath.replace(/^\/+/, ''));
    // Sanitize path to prevent directory traversal attacks
    const safePath = path.join('../../frontend/.output/public/images', fileName);
    const fullPath = path.join(process.cwd(), safePath);

    try {
      const buffer = Buffer.from(image, 'base64');

      // Debug safepath and fullpath
      console.log('Safe Path:', safePath);
      console.log('Full Path:', fullPath);

      // Ensure directory exists
      await fs.mkdir(path.dirname(fullPath), { recursive: true });

      // Save image
      await fs.writeFile(fullPath, buffer);

      // Check if file exists after writing
      try {
        await fs.access(fullPath);
        console.log('Image file written successfully:', fullPath);
      } catch (err) {
        console.error('Image file not found after write:', fullPath);
        return res.status(500).json({ error: 'File write failed' });
      }

      return res.status(200).json({ message: 'Image uploaded successfully', path: `/images/${fileName}` });
    } catch (error) {
      console.error('Error during image write:', error);
      return res.status(400).json({ error: 'Invalid Base64 image data or file write error' });
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json({ error: `Failed to upload image: ${error.message}` });
  }
});

export default router;