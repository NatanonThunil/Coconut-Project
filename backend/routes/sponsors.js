// backend/routes/sponsors.js
import { Router } from 'express';
import express from 'express';
import { config } from 'dotenv';
import db from '../db.js';

config();
const router = Router();

router.use(express.json());

// API key guard
const API_KEY = process.env.API_SECRET;
router.use((req, res, next) => {
  const apiKey = req.headers['cocon-key'];
  if (apiKey !== API_KEY) {
    return res.status(403).json({ error: 'Forbidden: Invalid API key' });
  }
  next();
});

// OPTIONAL: บังคับจำนวนสูงสุดต่อ footer (ใช้ .env)
// ENFORCE_SPONSOR_MAX=true  และ  SPONSOR_MAX=4 (ค่าเริ่มต้น 4 ถ้าไม่ตั้ง)
const ENFORCE_MAX = true
const SPONSOR_MAX = 4

/////////////////////////////// GET ALL SPONSORS BY FOOTER (ordered)
router.get('/footer/:footerId', async (req, res) => {
  try {
    const { footerId } = req.params;
    const [rows] = await db.query(
      // เรียงตาม position ก่อน แล้วค่อย id
      'SELECT * FROM sponsors WHERE footer_id = ? ORDER BY position ASC, id ASC',
      [footerId]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/////////////////////////////// GET SPONSOR BY ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM sponsors WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Sponsor not found' });
    }

    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/////////////////////////////// POST CREATE (accepts optional position)
router.post('/', async (req, res) => {
  try {
    const { footer_id, logo, url, alt = null, position } = req.body;

    if (!footer_id || !logo || !url) {
      return res.status(400).json({ error: 'footer_id, logo, and url are required' });
    }

    // บังคับจำนวนสูงสุด (ถ้าเปิดใช้)
    if (ENFORCE_MAX) {
      const [[{ cnt }]] = await db.query(
        'SELECT COUNT(*) AS cnt FROM sponsors WHERE footer_id = ?',
        [footer_id]
      );
      if (cnt >= SPONSOR_MAX) {
        return res.status(400).json({ error: `Limit reached (${SPONSOR_MAX}) for this footer_id` });
      }
    }

    // ถ้าไม่ส่ง position มา → ตั้งเป็นท้ายสุดของ footer นั้น ๆ
    let finalPosition = position;
    if (finalPosition === undefined || finalPosition === null) {
      const [[{ maxPos }]] = await db.query(
        'SELECT COALESCE(MAX(position), -1) AS maxPos FROM sponsors WHERE footer_id = ?',
        [footer_id]
      );
      finalPosition = (maxPos ?? -1) + 1;
    }

    const [result] = await db.query(
      'INSERT INTO sponsors (footer_id, logo, url, alt, position) VALUES (?, ?, ?, ?, ?)',
      [footer_id, logo, url, alt, finalPosition]
    );

    res.status(201).json({
      id: result.insertId,
      footer_id,
      logo,
      url,
      alt,
      position: finalPosition
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/////////////////////////////// PUT UPDATE (partial; supports position)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { logo, url, alt, position } = req.body;

    // สร้าง SET clause แบบ dynamic เฉพาะฟิลด์ที่ส่งมา
    const fields = [];
    const params = [];

    if (logo !== undefined) {
      fields.push('logo = ?');
      params.push(logo);
    }
    if (url !== undefined) {
      fields.push('url = ?');
      params.push(url);
    }
    if (alt !== undefined) {
      fields.push('alt = ?');
      params.push(alt);
    }
    if (position !== undefined) {
      // รองรับอัปเดต position รายตัว
      fields.push('position = ?');
      params.push(position);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    params.push(id);

    const [result] = await db.query(
      `UPDATE sponsors SET ${fields.join(', ')} WHERE id = ?`,
      params
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Sponsor not found' });
    }

    const [rows] = await db.query('SELECT * FROM sponsors WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/////////////////////////////// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM sponsors WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Sponsor not found' });
    }

    res.json({ message: 'Sponsor deleted successfully' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
