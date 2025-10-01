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
        const [rows] = await db.query('SELECT * FROM coconut');
        // Image is now just a path, no base64 conversion needed
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


/////////////////////////////// GET BY ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM coconut WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Coconut not found' });
        }
        const coconut = rows[0];
        // Image is now just a path, no base64 conversion needed
        res.json(coconut);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/////////////////////////////// POST
router.post('/', async (req, res) => {
    try {
        const { description, origin, origin_en, name_eng, name_th, sci_name_f, sci_name_m, sci_name_l, characteristics, characteristics_en, youngold, image, status } = req.body;

        if (!image) {
            return res.status(400).json({ error: 'Image path is required.' });
        }

        const [result] = await db.query(
            `INSERT INTO coconut (image, description, origin, origin_en, name_eng, name_th, sci_name_f, sci_name_m, sci_name_l, characteristics, characteristics_en, youngold, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [image, description, origin, origin_en, name_eng, name_th, sci_name_f, sci_name_m, sci_name_l, characteristics, characteristics_en, youngold, status]
        );

        res.status(201).json({
            id: result.insertId,
            description, origin_en,
            origin,
            name_eng,
            name_th,
            sci_name_f,
            sci_name_m,
            sci_name_l,
            characteristics,
            characteristics_en,
            youngold,
            status,
            image
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/////////////////////////////// PUT (UPDATE)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { description, origin, origin_en, name_eng, name_th, sci_name_f, sci_name_m, sci_name_l, characteristics, characteristics_en, youngold, image, status } = req.body;

        // Only update image if a new path is provided
        const [result] = await db.query(
            `UPDATE coconut
             SET description = ?, origin = ?, origin_en = ?, name_eng = ?, name_th = ?, sci_name_f = ?, sci_name_m = ?, sci_name_l = ?, characteristics = ?, characteristics_en = ?, youngold = ?, status = ?, image = COALESCE(?, image)
             WHERE id = ?`,
            [description, origin, origin_en, name_eng, name_th, sci_name_f, sci_name_m, sci_name_l, characteristics, characteristics_en, youngold, status, image || null, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Coconut not found or no changes made' });
        }

        res.json({ message: 'Coconut updated successfully' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/////////////////////////////// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM coconut WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Coconut not found' });
        }
        res.json({ message: 'Coconut deleted successfully' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;