import { Router } from 'express';
import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';


const router = Router();
router.use(express.json({ limit: '200mb' }));

router.post('/', async (req, res) => {
  try {
    const { image, path: imagePath } = req.body;

    if (!image || !imagePath) {
      return res.status(400).json({ error: 'Image data or path is missing' });
    }

    // Sanitize filename (remove slashes, only keep safe chars)
    const safeFileName = path.basename(imagePath);

    let mimeType = '';
    let base64Data = '';

    const matches = image.match(/^data:(image\/\w+);base64,(.+)$/);
    if (matches) {
      mimeType = matches[1].toLowerCase();
      base64Data = matches[2];
    } else {
      mimeType = 'image/jpeg';
      base64Data = image;
    }

    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(mimeType)) {
      return res.status(400).json({ error: 'Only JPEG, JPG, PNG, and WEBP are allowed' });
    }

    const buffer = Buffer.from(base64Data, 'base64');

    let ext = mimeType.split('/')[1];
    if (ext === 'jpg') ext = 'jpeg';

    // Force extension to match MIME type
    const finalFileName = safeFileName.endsWith(`.${ext}`) ? safeFileName : `${safeFileName}.${ext}`;

    const baseDir = path.resolve(process.cwd(), '../frontend/.output/public/images');
    const fullPath = path.join(baseDir, finalFileName);
    await fs.mkdir(baseDir, { recursive: true });

    let quality = 85;
    let optimizedBuffer = await sharp(buffer)
      .resize({ width: 2000, withoutEnlargement: true })
      .toFormat(ext === 'png' ? 'png' : ext === 'webp' ? 'webp' : 'jpeg', { quality })
      .toBuffer();

    const maxSize = 50 * 1024 * 1024;
    let attempts = 0;
    while (optimizedBuffer.length > maxSize && attempts < 5) {
      quality -= 10;
      optimizedBuffer = await sharp(buffer)
        .resize({ width: 2000, withoutEnlargement: true })
        .toFormat(ext === 'png' ? 'png' : ext === 'webp' ? 'webp' : 'jpeg', { quality })
        .toBuffer();
      attempts++;
    }

    if (optimizedBuffer.length > maxSize) {
      return res.status(400).json({ error: 'Cannot compress image under 50MB' });
    }

    await fs.writeFile(fullPath, optimizedBuffer);

    return res.status(200).json({
      message: 'Image uploaded and optimized successfully',
      size: (optimizedBuffer.length / (1024 * 1024)).toFixed(2) + ' MB',
      path: `/images/${finalFileName}` // matches your output folder
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json({ error: `Failed to upload image: ${error.message}` });
  }
});


export default router;
