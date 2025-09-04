import { Router } from 'express';
const router = Router();
import { config } from 'dotenv';
config();
import db from '../db.js';
import express from 'express';

router.use(express.json());

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
        const [rows] = await db.query('SELECT * FROM member WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Member item not found' });
        }

        res.json(rows[0]);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/////////////////////////////// GET all members
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM member');
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/////////////////////////////// POST new member
router.post('/', async (req, res) => {
    try {
        const {
            image, name, name_en, email, address, address_en,
            phoneNumber, status, description, description_en
        } = req.body;

        console.log('Params:', [
            image, name, name_en, email, address, address_en,
            phoneNumber, status, description, description_en
        ]);

        const [result] = await db.query(
            `INSERT INTO member 
            (image, name, name_en, email, address, address_en, phoneNumber, status, description, description_en) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [image, name, name_en, email, address, address_en, phoneNumber, status, description, description_en]
        );

        res.status(201).json({
            id: result.insertId,
            image, name, name_en, email, address, address_en,
            phoneNumber, status, description, description_en
        });

    } catch (e) {
        console.error('Error in POST /member:', e);
        res.status(500).json({ error: e.message });
    }
});

/////////////////////////////// PUT update member
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            image, name, name_en, email, address, address_en,
            phoneNumber, status, description, description_en
        } = req.body;

        const [result] = await db.query(
            `UPDATE member SET 
            image=?, name=?, name_en=?, email=?, address=?, address_en=?, 
            phoneNumber=?, status=?, description=?, description_en=?
            WHERE id=?`,
            [image, name, name_en, email, address, address_en,
             phoneNumber, status, description, description_en, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Member not found' });
        }

        res.json({
            id,
            image, name, name_en, email, address, address_en,
            phoneNumber, status, description, description_en,
            message: 'Member updated successfully'
        });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/////////////////////////////// DELETE member
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM member WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Member not found' });
        }
        res.json({ message: 'Member deleted successfully' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
