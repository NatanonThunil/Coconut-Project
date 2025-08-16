import { Router } from 'express';
import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { PDFDocument } from 'pdf-lib'; // npm i pdf-lib

const router = Router();
router.use(express.json({ limit: '200mb' }));

router.post('/', async (req, res) => {
  try {
    const { pdf, path: pdfPath } = req.body;

    if (!pdf || !pdfPath) {
      return res.status(400).json({ error: 'PDF data or path is missing' });
    }

    const safeFileName = path.basename(pdfPath);
    const matches = pdf.match(/^data:(application\/pdf);base64,(.+)$/);
    const base64Data = matches ? matches[2] : pdf;

    const buffer = Buffer.from(base64Data, 'base64');

    // Optional: compress PDF by rewriting pages
    const pdfDoc = await PDFDocument.load(buffer);
    const compressedPdf = await pdfDoc.save({ useObjectStreams: true });

    const finalBuffer = compressedPdf.length <= 50 * 1024 * 1024 ? compressedPdf : buffer;
    if (finalBuffer.length > 50 * 1024 * 1024) {
      return res.status(400).json({ error: 'PDF exceeds 50MB limit' });
    }

    const baseDir = path.resolve(process.cwd(), process.env.PDF_PATH);
    await fs.mkdir(baseDir, { recursive: true });

    const finalFileName = safeFileName.endsWith('.pdf') ? safeFileName : `${safeFileName}.pdf`;
    const fullPath = path.join(baseDir, finalFileName);
    await fs.writeFile(fullPath, finalBuffer);

    return res.status(200).json({
      message: 'PDF uploaded and compressed successfully',
      size: (finalBuffer.length / (1024 * 1024)).toFixed(2) + ' MB',
      path: `/pdfs/${finalFileName}`,
    });
  } catch (error) {
    console.error('Error uploading PDF:', error);
    return res.status(500).json({ error: `Failed to upload PDF: ${error.message}` });
  }
});

export default router;
