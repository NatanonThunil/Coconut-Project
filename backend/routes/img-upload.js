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

    // Get filename and sanitize it
    const fileName = path.basename(imagePath.replace(/^\/+/, ''));

    // Absolute path to the images folder
    const baseDir = path.resolve(process.cwd(), '../frontend/.output/public/images');
    const fullPath = path.join(baseDir, fileName);

    // Ensure directory exists
    await fs.mkdir(baseDir, { recursive: true });

    // Convert base64 to buffer and save file
    const buffer = Buffer.from(image, 'base64');
    await fs.writeFile(fullPath, buffer);

    // Verify the file exists
    try {
      await fs.access(fullPath);
      console.log('Image file written successfully:', fullPath);
    } catch {
      console.error('Image file not found after write:', fullPath);
      return res.status(500).json({ error: 'File write failed' });
    }

    return res.status(200).json({ message: 'Image uploaded successfully', path: `/images/${fileName}` });
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json({ error: `Failed to upload image: ${error.message}` });
  }
});

export default router;
