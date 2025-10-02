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

/////////////////////////////// GET ALL SPONSORS BY FOOTER
router.get('/footer/:footerId', async (req, res) => {
  try {
    const { footerId } = req.params;
    const [rows] = await db.query(
      'SELECT * FROM sponsors WHERE footer_id = ? ORDER BY id ASC',
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

/////////////////////////////// POST CREATE
router.post('/', async (req, res) => {
  try {
    const { footer_id, logo, url, alt } = req.body;

    if (!footer_id || !logo || !url) {
      return res.status(400).json({ error: 'footer_id, logo, and url are required' });
    }

    const [result] = await db.query(
      'INSERT INTO sponsors (footer_id, logo, url, alt) VALUES (?, ?, ?, ?)',
      [footer_id, logo, url, alt]
    );

    res.status(201).json({
      id: result.insertId,
      footer_id,
      logo,
      url,
      alt
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/////////////////////////////// PUT UPDATE
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { logo, url, alt } = req.body;

    const [result] = await db.query(
      'UPDATE sponsors SET logo = ?, url = ?, alt = ? WHERE id = ?',
      [logo, url, alt, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Sponsor not found' });
    }

    res.json({ id, logo, url, alt });
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
