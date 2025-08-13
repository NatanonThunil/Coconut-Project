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
        // Convert image buffer to base64
        const coconuts = rows.map(coconut => {
            let imageBase64 = null;
            if (coconut.image) {
                imageBase64 = `data:image/jpeg;base64,${coconut.image.toString('base64')}`;
            }
            return { ...coconut, image: imageBase64 };
        });
        res.json(coconuts);
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
        let coconut = rows[0];
        let imageBase64 = null;
        if (coconut.image) {
            imageBase64 = `data:image/jpeg;base64,${coconut.image.toString('base64')}`;
        }
        res.json({ ...coconut, image: imageBase64 });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/////////////////////////////// POST
router.post('/', async (req, res) => {
    try {
        const { description, origin, name_eng, name_th, sci_name_f, sci_name_m, sci_name_l, characteristics, youngold, image } = req.body;
        if (!image) {
            return res.status(400).json({ error: 'Image is required.' });
        }
        const imageBuffer = Buffer.from(image, 'base64');
        const [result] = await db.query(
            `INSERT INTO coconut (image, description, origin, name_eng, name_th, sci_name_f, sci_name_m, sci_name_l, characteristics, youngold) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [imageBuffer, description, origin, name_eng, name_th, sci_name_f, sci_name_m, sci_name_l, characteristics, youngold]
        );
        res.status(201).json({
            id: result.insertId,
            description,
            origin,
            name_eng,
            name_th,
            sci_name_f,
            sci_name_m,
            sci_name_l,
            characteristics,
            youngold,
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
        const { description, origin, name_eng, name_th, sci_name_f, sci_name_m, sci_name_l, characteristics, youngold, image, status } = req.body;
        let imageBuffer = null;
        if (image) {
            imageBuffer = Buffer.from(image, 'base64');
        }
        const [result] = await db.query(
            `UPDATE coconut SET description=?, origin=?, name_eng=?, name_th=?, sci_name_f=?, sci_name_m=?, sci_name_l=?, characteristics=?, youngold=?, status=?, image=COALESCE(?, image) WHERE id=?`,
            [description, origin, name_eng, name_th, sci_name_f, sci_name_m, sci_name_l, characteristics, youngold, status, imageBuffer, id]
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