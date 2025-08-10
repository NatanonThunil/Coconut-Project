import { Router } from 'express';
import express from 'express'; // Only import once at the top
const router = Router();
import { config } from 'dotenv';
config();
import db from '../db.js';

router.use(express.json());

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


/////////////////////////////// GET BY ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM tag_line WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Tag line not found' });
        }

        res.json(rows[0]);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/////////////////////////////// PUT
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            text,
            text_en,
            x,
            y,
            image
        } = req.body;

        const [result] = await db.query(
            `UPDATE tag_line SET 
                text = ?, 
                text_en = ?, 
                x = ?, 
                y = ?, 
                image = ?
            WHERE id = ?`,
            [
                text,
                text_en,
                x,
                y,
                image,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Tag line not found' });
        }

        res.json({
            id,
            text,
            text_en,
            x,
            y,
            image
        });
    } catch (e) {
        console.error('Error in PUT /herobars/:id:', e);
        res.status(500).json({ error: e.message });
    }
});

export default router;