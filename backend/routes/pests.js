import { Router } from 'express';
const router = Router();
import { config } from 'dotenv';
config();
import db from '../db.js';

// ดึง API_KEY จาก .env (/backend/.env)
const API_KEY = process.env.API_SECRET

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
        const [rows] = await db.query('SELECT * FROM pest');
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/////////////////////////////// GET BY ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM pest WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Pest not found' });
        }
        res.json(rows[0]);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/////////////////////////////// POST
router.post('/', async (req, res) => {
    try {
        const { image, name, name_en, sci_name, lifecycle, prevent, lifecycle_en, prevent_en, status, type } = req.body;

        if (!image) {
            return res.status(400).json({ error: 'Image is required.' });
        }

        const [result] = await db.query(
            `INSERT INTO pest (image, name, name_en, sci_name, lifecycle, prevent, lifecycle_en, prevent_en, status, type)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [image, name, name_en, sci_name, lifecycle, prevent, lifecycle_en, prevent_en, status, type]
        );

        res.status(201).json({
            id: result.insertId,
            image,
            name,
            name_en,
            sci_name,
            lifecycle,
            prevent,
            lifecycle_en,
            prevent_en,
            status,
            type
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/////////////////////////////// PUT (UPDATE)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { image, name, name_en, sci_name, lifecycle, prevent, lifecycle_en, prevent_en, status, type } = req.body;

        const [result] = await db.query(
            `UPDATE pest
             SET image = COALESCE(?, image), name = ?, name_en = ?, sci_name = ?, lifecycle = ?, prevent = ?, lifecycle_en = ?, prevent_en = ?, status = ?, type = ?
             WHERE id = ?`,
            [image || null, name, name_en, sci_name, lifecycle, prevent, lifecycle_en, prevent_en, status, type, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Pest not found or no changes made' });
        }

        res.json({ message: 'Pest updated successfully' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/////////////////////////////// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM pest WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Pest not found' });
        }
        res.json({ message: 'Pest deleted successfully' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;