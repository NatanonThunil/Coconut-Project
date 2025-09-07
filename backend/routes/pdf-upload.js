// backend/routes/pdf-upload.js
import { Router } from 'express';
import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { PDFDocument } from 'pdf-lib'; // npm i pdf-lib

const router = Router();
router.use(express.json({ limit: '200mb' }));

const MAX_BYTES = 50 * 1024 * 1024; // 50 MB

router.post('/', async (req, res) => {
  try {
    const { pdf, path: pdfPath } = req.body;

    if (!pdf || !pdfPath) {
      return res.status(400).json({
        error: 'PDF data or path is missing',
        code: 'PDF_BODY_MISSING',
      });
    }

    // Accept either data URL or raw base64
    const m = String(pdf).match(/^data:(application\/pdf);base64,(.+)$/);
    const base64 = m ? m[2] : pdf;
    let inputBuf;
    try {
      inputBuf = Buffer.from(base64, 'base64');
    } catch {
      return res.status(400).json({ error: 'Invalid base64 PDF', code: 'PDF_BASE64_INVALID' });
    }

    // Try a small structural recompress using pdf-lib (no image downsampling)
    let bestBuf = inputBuf;
    try {
      const doc = await PDFDocument.load(inputBuf, { ignoreEncryption: true });

      // Optional metadata stripping (can shave a little)
      doc.setCreator('');
      doc.setProducer('');
      doc.setTitle('');
      doc.setSubject('');
      doc.setKeywords([]);
      doc.setAuthor('');
      doc.setCreationDate(undefined);
      doc.setModificationDate(undefined);

      const saved = await doc.save({
        useObjectStreams: true,  // smaller xref/object tables
        addDefaultXref: false,
        objectsPerTick: 50,      // small memory tweak
      });
      if (saved && saved.length < bestBuf.length) {
        bestBuf = Buffer.from(saved);
      }
    } catch (e) {
      // If pdf-lib fails (rare, corrupt PDFs, etc.), just fall back to original bytes.
      console.warn('pdf-lib compression skipped:', e?.message || e);
    }

    // Enforce the 50MB cap
    if (bestBuf.length > MAX_BYTES) {
      return res.status(413).json({
        error: 'PDF too large after compression (requires external downsampling to go smaller)',
        code: 'PDF_TOO_LARGE',
        maxMB: 50,
        originalMB: +(inputBuf.length / 1024 / 1024).toFixed(2),
        bestMB: +(bestBuf.length / 1024 / 1024).toFixed(2),
        hint: 'Re-export at lower DPI, split the PDF, or install a server-side compressor (e.g., Ghostscript/pdfcpu).',
      });
    }

    // Save to your public PDFs directory
    const fileName = path.basename(String(pdfPath).replace(/^\/+/, ''));
    const finalName = fileName.toLowerCase().endsWith('.pdf') ? fileName : `${fileName}.pdf`;

    const baseDir = path.resolve(process.cwd(), process.env.PDF_PATH || '../frontend/.output/public/pdfs');
    await fs.mkdir(baseDir, { recursive: true });
    const fullPath = path.join(baseDir, finalName);

    await fs.writeFile(fullPath, bestBuf);

    console.log('PDF written:', fullPath);
    return res.status(200).json({
      message: 'PDF uploaded successfully',
      sizeMB: +(bestBuf.length / 1024 / 1024).toFixed(2),
      path: `/pdfs/${finalName}`,
    });
  } catch (error) {
    console.error('Error uploading PDF:', error);
    return res.status(500).json({
      error: `Failed to upload/compress PDF: ${error.message}`,
      code: 'PDF_UPLOAD_FAILED',
    });
  }
});

export default router;
