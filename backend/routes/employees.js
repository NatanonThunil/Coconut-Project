import { Router } from 'express';
const router = Router();
import { config } from 'dotenv';
config();
import db from '../db.js';

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
        const [rows] = await db.query('SELECT * FROM employee');
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/////////////////////////////// GET BY ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM employee WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.json(rows[0]);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/////////////////////////////// POST
router.post('/', async (req, res) => {
    try {
        let {
            name,
            name_en,
            image,
            address,
            address_en,
            phoneNumber,
            status,
            description,
            description_en,
            email
        } = req.body;

        // image is optional, default to null
        image = image || null;

        const [result] = await db.query(
            `INSERT INTO employee 
            (name, name_en, image, address, address_en, phoneNumber, status, description, description_en, email) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, name_en, image, address, address_en, phoneNumber, status, description, description_en, email]
        );

        res.status(201).json({
            id: result.insertId,
            name,
            name_en,
            image,
            address,
            address_en,
            phoneNumber,
            status,
            description,
            description_en,
            email
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/////////////////////////////// PUT (Update)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            name_en,
            image,
            address,
            address_en,
            phoneNumber,
            status,
            description,
            description_en,
            email
        } = req.body;

        const [result] = await db.query(
            `UPDATE employee 
             SET name = COALESCE(?, name), name_en = COALESCE(?, name_en), image = COALESCE(?, image), address = COALESCE(?, address), address_en = COALESCE(?, address_en), 
                 phoneNumber = COALESCE(?, phoneNumber), status = COALESCE(?, status), description = COALESCE(?, description), description_en = COALESCE(?, description_en), email = COALESCE(?, email)
             WHERE id = ?`,
            [name, name_en, image, address, address_en, phoneNumber, status, description, description_en, email, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Employee not found or no changes made' });
        }

        res.json({ message: 'Employee updated successfully' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/////////////////////////////// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query('DELETE FROM employee WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.json({ success: true, message: 'Employee deleted successfully' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
