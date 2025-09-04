import { Router } from 'express';
import { config } from 'dotenv';
import db from '../db.js';

config();

const router = Router();
const API_KEY = process.env.API_SECRET;

// If you already validate the API key globally in server.js (and allow OPTIONS),
// you can remove this local middleware.
router.use((req, res, next) => {
  // Let preflight pass if you keep this
  if (req.method === 'OPTIONS') return res.sendStatus(204);

  const apiKey = req.headers['cocon-key'];
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(403).json({ error: 'Forbidden: Invalid API key' });
  }
  next();
});

/**
 * GET /service
 * returns all services
 */
router.get('/', async (_req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, image, title, description, status, title_en, description_en FROM service ORDER BY id DESC'
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || 'Server error' });
  }
});

/**
 * GET /service/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      'SELECT id, image, title, description, status, title_en, description_en FROM service WHERE id = ?',
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Service not found' });
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || 'Server error' });
  }
});

/**
 * POST /service
 * Expect body:
 * {
 *   image: "/images/xxx.webp",  // path from /img-upload
 *   title, title_en, description, description_en,
 *   status // boolean or 0/1
 * }
 */
router.post('/', async (req, res) => {
  try {
    const {
      image,            // path string (not base64)
      title,
      title_en,
      description,
      description_en,
      status
    } = req.body;

    if (!title || !title_en) {
      return res.status(400).json({ error: 'title and title_en are required' });
    }
    if (!image) {
      return res.status(400).json({ error: 'Image path is required (upload first via /img-upload)' });
    }

    const statusNum = Number(status) ? 1 : 0;

    const [result] = await db.query(
      `INSERT INTO service (image, title, description, status, title_en, description_en)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [image, title, description || '', statusNum, title_en, description_en || '']
    );

    res.status(201).json({
      id: result.insertId,
      image,
      title,
      description: description || '',
      status: statusNum,
      title_en,
      description_en: description_en || ''
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || 'Server error' });
  }
});

/**
 * PUT /service/:id
 * Accepts partial updates; image is optional.
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const {
      image,            // optional path
      title,
      title_en,
      description,
      description_en,
      status
    } = req.body;

    const statusNum = status === undefined ? undefined : (Number(status) ? 1 : 0);

    // Build dynamic update to avoid overwriting with undefined
    const fields = [];
    const values = [];

    if (image !== undefined) { fields.push('image = ?'); values.push(image); }
    if (title !== undefined) { fields.push('title = ?'); values.push(title); }
    if (description !== undefined) { fields.push('description = ?'); values.push(description); }
    if (statusNum !== undefined) { fields.push('status = ?'); values.push(statusNum); }
    if (title_en !== undefined) { fields.push('title_en = ?'); values.push(title_en); }
    if (description_en !== undefined) { fields.push('description_en = ?'); values.push(description_en); }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const sql = `UPDATE service SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Service not found or no changes made' });
    }

    res.json({ message: 'Service updated successfully' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || 'Server error' });
  }
});

/**
 * DELETE /service/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM service WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || 'Server error' });
  }
});

export default router;
