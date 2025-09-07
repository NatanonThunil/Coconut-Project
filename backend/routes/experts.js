import { Router } from 'express';
const router = Router();
import { config } from 'dotenv';
config();
import db from '../db.js';

// ดึง API_KEY จาก .env (/backend/.env)
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
        const [rows] = await db.query('SELECT * FROM expert');
        // Image is just a path, no base64 conversion
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/////////////////////////////// GET BY ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM expert WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Expert not found' });
        }
        res.json(rows[0]);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/////////////////////////////// POST
router.post('/', async (req, res) => {
    try {
        const {
            image,
            name,
            name_en,
            address,
            address_en,
            phoneNumber,
            status,
            description,
            description_en,
            type,
            email
        } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Name is required.' });
        }

        const [result] = await db.query(
            `INSERT INTO expert 
             (image, name, name_en, address, address_en, phoneNumber, status, description, description_en, type, email)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [image, name, name_en, address, address_en, phoneNumber, status, description, description_en, type, email]
        );

        res.status(201).json({
            id: result.insertId,
            image,
            name,
            name_en,
            address,
            address_en,
            phoneNumber,
            status,
            description,
            description_en,
            type,
            email
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/////////////////////////////// PUT (UPDATE)
router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' });

    const body = req.body ?? {};
    const fields = [
      'image','name','name_en','address','address_en','phoneNumber',
      'status','description','description_en','type','email'
    ];

    const setParts = [];
    const params = [];
    for (const key of fields) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        if (key === 'status') {
          const s = (body.status === true || body.status === 1 || body.status === '1') ? 1 : 0;
          setParts.push(`status = ?`); params.push(s);
        } else if (key === 'type') {
          const t = Number.isFinite(Number(body.type)) ? Number(body.type) : null;
          setParts.push(`type = ?`); params.push(t);
        } else if (key === 'image') {
          // keep existing if null/undefined not provided
          setParts.push(`image = COALESCE(?, image)`); params.push(body.image ?? null);
        } else {
          setParts.push(`${key} = ?`); params.push(body[key] ?? null);
        }
      }
    }

    if (setParts.length === 0) {
      return res.status(400).json({ error: 'No updatable fields provided' });
    }

    const sql = `UPDATE expert SET ${setParts.join(', ')} WHERE id = ?`;
    const [result] = await db.query(sql, [...params, id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Expert not found' });
    res.json({ id, ...body });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal error while updating expert' });
  }
});

/////////////////////////////// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM expert WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Expert not found' });
        }
        res.json({ message: 'Expert deleted successfully' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
