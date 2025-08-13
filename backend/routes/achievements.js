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

/////////////////////////////// GET
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM achievement');
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/////////////////////////////// GET BY ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM achievement WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Achievement not found' });
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
            title,
            title_en,
            author,
            description,
            description_en,
            uploadDate,
            status,
            pdf,
            canDownload // Add this line
        } = req.body;

        const [result] = await db.query(
            `INSERT INTO achievement (
                title,
                title_en,
                author,
                description,
                description_en,
                uploadDate,
                status,
                pdf,
                canDownload
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                title,
                title_en,
                author,
                description,
                description_en,
                uploadDate,
                status,
                pdf,
                canDownload // Add this value
            ]
        );

        res.status(201).json({
            id: result.insertId,
            title,
            title_en,
            author,
            description,
            description_en,
            uploadDate,
            status,
            pdf,
            canDownload // Add this to response
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;