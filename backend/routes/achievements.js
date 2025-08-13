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

// Helper to convert ISO string to MySQL DATETIME
const toMysqlDatetime = (isoString) => {
    if (!isoString) return null;
    const date = new Date(isoString);
    return date.toISOString().slice(0, 19).replace('T', ' ');
};

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
        if (rows.length === 0) return res.status(404).json({ error: 'Achievement not found' });
        res.json(rows[0]);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/////////////////////////////// POST
router.post('/', async (req, res) => {
    try {
        if (!req.body) return res.status(400).json({ error: 'Request body is missing' });

        const {
            title,
            title_en,
            author,
            description,
            description_en,
            uploadDate,
            status,
            pdf,
            canDownload
        } = req.body;

        const mysqlDate = toMysqlDatetime(uploadDate);

        const [result] = await db.query(
            `INSERT INTO achievement (
                title, title_en, author, description, description_en, uploadDate, status, pdf, canDownload
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, title_en, author, description, description_en, mysqlDate, status, pdf, canDownload]
        );

        res.status(201).json({
            id: result.insertId,
            title,
            title_en,
            author,
            description,
            description_en,
            uploadDate: mysqlDate,
            status,
            pdf,
            canDownload
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/////////////////////////////// PUT 
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.body) return res.status(400).json({ error: 'Request body is missing' });

        const {
            title,
            title_en,
            author,
            description,
            description_en,
            uploadDate,
            status,
            pdf,
            canDownload
        } = req.body;

        const [existing] = await db.query('SELECT * FROM achievement WHERE id = ?', [id]);
        if (existing.length === 0) return res.status(404).json({ error: 'Achievement not found' });

        const mysqlDate = toMysqlDatetime(uploadDate);

        await db.query(
            `UPDATE achievement SET
                title = ?, title_en = ?, author = ?, description = ?, description_en = ?, uploadDate = ?, status = ?, pdf = ?, canDownload = ?
             WHERE id = ?`,
            [title, title_en, author, description, description_en, mysqlDate, status, pdf, canDownload, id]
        );

        res.json({
            id,
            title,
            title_en,
            author,
            description,
            description_en,
            uploadDate: mysqlDate,
            status,
            pdf,
            canDownload
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/////////////////////////////// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [existing] = await db.query('SELECT * FROM achievement WHERE id = ?', [id]);
        if (existing.length === 0) return res.status(404).json({ error: 'Achievement not found' });

        await db.query('DELETE FROM achievement WHERE id = ?', [id]);
        res.json({ message: `Achievement with ID ${id} deleted successfully.` });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
