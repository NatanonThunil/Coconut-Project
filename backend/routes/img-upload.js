// backend/routes/img-upload.js
import { Router } from 'express';
import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = Router();

router.use(express.json({ limit: '200mb' }));


const MAX_BYTES = 50 * 1024 * 1024; 

router.post('/', async (req, res) => {
  try {
    const { image, path: imagePath } = req.body;
    if (!image || !imagePath) {
      return res.status(400).json({ error: 'Image data or path is missing', code: 'IMAGE_BODY_MISSING' });
    }


    const buffer = Buffer.from(image, 'base64');
    if (buffer.length > MAX_BYTES) {
      return res.status(413).json({
        error: 'Image too large',
        code: 'IMAGE_TOO_LARGE',
        maxMB: 50,
        receivedMB: +(buffer.length / 1024 / 1024).toFixed(2),
      });
    }

   
    const fileName = path.basename(String(imagePath).replace(/^\/+/, ''));
    const baseDir = path.resolve(process.cwd(), process.env.IMG_PATH || '../frontend/.output/public/images');
    await fs.mkdir(baseDir, { recursive: true });
    const fullPath = path.join(baseDir, fileName);

    await fs.writeFile(fullPath, buffer);

    console.log('Save image at', fullPath);
    return res.status(200).json({ message: 'Image uploaded successfully', path: `/images/${fileName}` });
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json({ error: `Failed to upload image: ${error.message}`, code: 'IMAGE_UPLOAD_FAILED' });
  }
});

export default router;
