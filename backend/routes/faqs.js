import { Router } from 'express';
const router = Router();
import { config } from 'dotenv';
config();
import db from '../db.js';

// Add this line to parse JSON bodies
import express from 'express';
router.use(express.json());

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
        const [rows] = await db.query('SELECT * FROM faq');
        res.json({ faqs: rows });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


/////////////////////////////// POST
router.post('/', async (req, res) => {
    try {

        const { question, answer, status, isadvice, question_en, answer_en } = req.body; console.log('Params:', [question, answer, status, isadvice, question_en, answer_en]);
        const [result] = await db.query(
            'INSERT INTO faq (question, answer, status, isadvice, question_en, answer_en) VALUES (?,?,?,?,?,?)',
            [question, answer, status, isadvice, question_en, answer_en]
        );
        res.status(201).json({
            id: result.insertId,
            question, answer, status, isadvice, question_en, answer_en
        });
    } catch (e) {
        console.error('Error in POST /faqs:', e);
        res.status(500).json({ error: e.message });
    }
});
/////////////////////////////// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM faq WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'FAQ not found' });
        }
        res.json({ message: 'FAQ deleted successfully' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
/////////////////////////////// PUT
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { question, answer, status, isadvice, question_en, answer_en } = req.body;
        const [result] = await db.query(
            'UPDATE faq SET question=?, answer=?, status=?, isadvice=?, question_en=?, answer_en=? WHERE id=?',
            [question, answer, status, isadvice, question_en, answer_en, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'FAQ not found' });
        }
        res.json({
            id,
            question, answer, status, isadvice, question_en, answer_en,
            message: 'FAQ updated successfully'
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;