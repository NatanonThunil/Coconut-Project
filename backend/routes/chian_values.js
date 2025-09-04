import { Router } from 'express';
const router = Router();
import { config } from 'dotenv';
config();
import db from '../db.js';

// Get API_KEY from .env
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
        const [rows] = await db.query('SELECT * FROM chain_values');
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/////////////////////////////// GET BY ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM chain_values WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Chain value not found' });
        }
        res.json(rows[0]);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/////////////////////////////// POST
router.post('/', async (req, res) => {
    try {
        const { image, title, title_en, description, description_en, status, type, category } = req.body;

        if (!image) {
            return res.status(400).json({ error: 'Image is required.' });
        }

        const [result] = await db.query(
            `INSERT INTO chain_values (image, title, title_en, description, description_en, status, type, category)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [image, title, title_en, description, description_en, status, type, category]
        );

        res.status(201).json({
            id: result.insertId,
            image,
            title,
            title_en,
            description,
            description_en,
            status,
            type,
            category
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/////////////////////////////// PUT (UPDATE)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { image, title, title_en, description, description_en, status, type, category } = req.body;

        const [result] = await db.query(
            `UPDATE chain_values
             SET image = COALESCE(?, image), title = ?, title_en = ?, description = ?, description_en = ?, status = ?, type = ?, category = ?
             WHERE id = ?`,
            [image || null, title, title_en, description, description_en, status, type, category, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Chain value not found or no changes made' });
        }

        res.json({ message: 'Chain value updated successfully' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/////////////////////////////// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM chain_values WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Chain value not found' });
        }
        res.json({ message: 'Chain value deleted successfully' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
