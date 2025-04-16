import { Router } from 'express';
const router = Router();
import db from '../db.js'; 

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

export default router;
