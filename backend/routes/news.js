import { Router } from 'express';
import { config } from 'dotenv';
import db from '../db.js';

config();
const router = Router();
const API_KEY = process.env.API_SECRET;

// Middleware to validate API key
router.use((req, res, next) => {
  const apiKey = req.headers['cocon-key'];
  if (apiKey !== API_KEY) {
    return res.status(403).json({ error: 'Forbidden: Invalid API key' });
  }
  next();
});

/////////////////////////////// GET ALL
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM new ORDER BY upload_date DESC');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/////////////////////////////// GET BY ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM new WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'News item not found' });
    }
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/////////////////////////////// POST (CREATE)
router.post('/', async (req, res) => {
  try {
    let {
      title,
      image,
      author,
      upload_date,
      description,
      summerize,
      hot_new,
      status,
      title_en,
      description_en,
      summerize_en,
    } = req.body;

    if (!title || !author) {
      return res.status(400).json({ error: 'Title and author are required.' });
    }

    // Ensure upload_date is a valid string
    if (!upload_date) upload_date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const [result] = await db.query(
      `INSERT INTO new 
       (title, image, author, upload_date, description, summerize, hot_new, status, title_en, description_en, summerize_en) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        image || null,
        author,
        upload_date,
        description || null,
        summerize || null,
        hot_new || 0,
        status || 1,
        title_en || null,
        description_en || null,
        summerize_en || null,
      ]
    );

    res.status(201).json({
      id: result.insertId,
      title,
      image,
      author,
      upload_date,
      description,
      summerize,
      hot_new,
      status,
      title_en,
      description_en,
      summerize_en,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/////////////////////////////// PUT (UPDATE)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      image,
      author,
      upload_date,
      description,
      summerize,
      hot_new,
      status,
      title_en,
      description_en,
      summerize_en,
    } = req.body;

    // Convert upload_date if it's a Date object
    let dateValue = upload_date;
    if (upload_date && typeof upload_date === 'object' && upload_date instanceof Date) {
      dateValue = upload_date.toISOString().slice(0, 19).replace('T', ' ');
    }

    const [result] = await db.query(
      `UPDATE new SET 
         title = COALESCE(?, title), 
         image = COALESCE(?, image), 
         author = COALESCE(?, author), 
         upload_date = COALESCE(?, upload_date), 
         description = COALESCE(?, description), 
         summerize = COALESCE(?, summerize), 
         hot_new = COALESCE(?, hot_new), 
         status = COALESCE(?, status), 
         title_en = COALESCE(?, title_en), 
         description_en = COALESCE(?, description_en), 
         summerize_en = COALESCE(?, summerize_en)
       WHERE id = ?`,
      [
        title,
        image,
        author,
        dateValue,
        description,
        summerize,
        hot_new,
        status,
        title_en,
        description_en,
        summerize_en,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'News item not found or no changes made' });
    }

    res.json({ message: 'News updated successfully' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/////////////////////////////// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM new WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'News item not found' });
    }
    res.json({ message: 'News deleted successfully' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
