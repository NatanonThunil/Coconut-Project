import { Router } from 'express';
const router = Router();
import db from '../db.js';

const API_KEY = 'Cocon541986'; // Replace with your actual API key

// Middleware to validate API key
router.use((req, res, next) => {
    const apiKey = req.headers['cocon-key'];
    if (apiKey !== API_KEY) {
        return res.status(403).json({ error: 'Forbidden: Invalid API key' });
    }
    next();
});

/////////////////////////////// GET
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM new');
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

/////////////////////////////// POST
router.post('/', async (req, res) => {
    try {
        const { title, images, author, upload_date, description, summerize, hot_new, status, title_en, description_en, summerize_en } = req.body;
        const [result] = await db.query(
            'INSERT INTO new (title, images, author, upload_date, description, summerize, hot_new, status, title_en, description_en, summerize_en) VALUES (?, ?,?,?,?,?,?,?,?,?,?)',
            [title, images, author, upload_date, description, summerize, hot_new, status, title_en, description_en, summerize_en]
        );

        res.status(201).json({
            id: result.insertId,
            title,
            images,
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

export default router;