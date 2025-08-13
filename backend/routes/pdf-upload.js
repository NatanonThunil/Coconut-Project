import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

const router = Router();

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const baseDir = path.resolve(process.cwd(), '../frontend/.output/public/pdf');
    await fs.mkdir(baseDir, { recursive: true });
    cb(null, baseDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const pdfPath = `/pdf/${req.file.filename}`;
    console.log('PDF uploaded successfully:', pdfPath);

    res.status(200).json({ url: pdfPath });
  } catch (error) {
    console.error('Error uploading PDF:', error);
    res.status(500).json({ error: 'Failed to upload PDF' });
  }
});

export default router;
