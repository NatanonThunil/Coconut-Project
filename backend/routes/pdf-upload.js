// backend/routes/pdf-upload.js
import { Router } from 'express';
import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import multer from 'multer';

const router = Router();

// JSON parser only for the legacy JSON/base64 fallback (kept generous)
router.use(express.json({ limit: '200mb' }));

// --- Multipart handler (preferred path) ---
const MAX_BYTES = 50 * 1024 * 1024; // 50 MB hard cap
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES }, // Reject >50MB at multer layer
});

// Accept both:
// - multipart/form-data with field name "pdf" (preferred)
// - application/json with { pdf: <dataURL|base64>, path: <name> } (legacy)
router.post('/', upload.single('pdf'), async (req, res) => {
  try {
    // 1) Collect bytes + target path from either multipart or JSON
    let inputBuf;
    let logicalPath;

    if (req.file) {
      // multipart path comes from text field "path"
      logicalPath = String(req.body?.path || '').trim();
      if (!logicalPath) {
        return res.status(400).json({ error: 'Missing "path" field', code: 'PDF_BODY_MISSING_PATH' });
      }
      inputBuf = req.file.buffer;

      // Redundant (multer already enforces), but explicit:
      if (inputBuf.length > MAX_BYTES) {
        return res.status(413).json({ error: 'PDF too large', code: 'PDF_TOO_LARGE', maxMB: 50 });
      }
    } else {
      // Legacy JSON/base64 path
      const { pdf, path: pdfPath } = req.body || {};
      if (!pdf || !pdfPath) {
        return res.status(400).json({ error: 'PDF data or path is missing', code: 'PDF_BODY_MISSING' });
      }
      logicalPath = String(pdfPath).trim();

      // Accept data URL or raw base64
      const m = String(pdf).match(/^data:(application\/pdf);base64,(.+)$/);
      const base64 = m ? m[2] : String(pdf);
      try {
        inputBuf = Buffer.from(base64, 'base64');
      } catch {
        return res.status(400).json({ error: 'Invalid base64 PDF', code: 'PDF_BASE64_INVALID' });
      }
      if (inputBuf.length > MAX_BYTES) {
        return res.status(413).json({
          error: 'PDF too large before compression',
          code: 'PDF_TOO_LARGE',
          maxMB: 50,
          originalMB: +(inputBuf.length / 1024 / 1024).toFixed(2),
        });
      }
    }

    // 2) Optional structural recompress/metadata strip (no downsampling)
    let bestBuf = inputBuf;
    try {
      const doc = await PDFDocument.load(inputBuf, { ignoreEncryption: true });

      // strip metadata (saves a little)
      doc.setCreator('');
      doc.setProducer('');
      doc.setTitle('');
      doc.setSubject('');
      doc.setKeywords([]);
      doc.setAuthor('');
      doc.setCreationDate(undefined);
      doc.setModificationDate(undefined);

      const saved = await doc.save({
        useObjectStreams: true,
        addDefaultXref: false,
        objectsPerTick: 50,
      });
      if (saved && saved.length < bestBuf.length) {
        bestBuf = Buffer.from(saved);
      }
    } catch (e) {
      console.warn('pdf-lib compression skipped:', e?.message || e);
    }

    if (bestBuf.length > MAX_BYTES) {
      return res.status(413).json({
        error: 'PDF too large after compression (requires external downsampling to go smaller)',
        code: 'PDF_TOO_LARGE',
        maxMB: 50,
        bestMB: +(bestBuf.length / 1024 / 1024).toFixed(2),
        hint: 'Re-export at lower DPI, split the PDF, or install a server-side compressor (e.g., Ghostscript/pdfcpu).',
      });
    }

    // 3) Save to public PDFs directory
    const fileName = path.basename(logicalPath.replace(/^\/+/, ''));
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
