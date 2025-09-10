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

/////////////////////////////// GET ALL members
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM member ORDER BY id DESC');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/////////////////////////////// GET BY ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM member WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/////////////////////////////// POST new member
router.post('/', async (req, res) => {
  try {
    let {
      image,
      name,
      name_en,
      email,
      address,
      address_en,
      phoneNumber,
      status,
      description,
      description_en,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and Email are required.' });
    }

    const [result] = await db.query(
      `INSERT INTO member 
       (image, name, name_en, email, address, address_en, phoneNumber, status, description, description_en) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        image || null,
        name,
        name_en || null,
        email,
        address || null,
        address_en || null,
        phoneNumber || null,
        status ?? 1,
        description || null,
        description_en || null,
      ]
    );

    res.status(201).json({
      id: result.insertId,
      image,
      name,
      name_en,
      email,
      address,
      address_en,
      phoneNumber,
      status,
      description,
      description_en,
    });
  } catch (e) {
    console.error('Error in POST /member:', e);
    res.status(500).json({ error: e.message });
  }
});

/////////////////////////////// PUT update member
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      name,
      name_en,
      email,
      address,
      address_en,
      phoneNumber,
      status,
      description,
      description_en,
    } = req.body;

    const [result] = await db.query(
      `UPDATE member SET 
         image = COALESCE(?, image),
         name = COALESCE(?, name),
         name_en = COALESCE(?, name_en),
         email = COALESCE(?, email),
         address = COALESCE(?, address),
         address_en = COALESCE(?, address_en),
         phoneNumber = COALESCE(?, phoneNumber),
         status = COALESCE(?, status),
         description = COALESCE(?, description),
         description_en = COALESCE(?, description_en)
       WHERE id = ?`,
      [
        image,
        name,
        name_en,
        email,
        address,
        address_en,
        phoneNumber,
        status,
        description,
        description_en,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Member not found or no changes made' });
    }

    res.json({ message: 'Member updated successfully' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/////////////////////////////// DELETE member
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM member WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json({ message: 'Member deleted successfully' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
