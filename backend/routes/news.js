import { Router } from 'express';
const router = Router();
// import db from '../db'; 

/////////////////////////////// GET
router.get('/', async (req, res) => {
    try {
        //ลอง
        const rows = [
            { id: 1, name: 'Mock Item 1', description: 'This is mock data 1' },
            { id: 2, name: 'Mock Item 2', description: 'This is mock data 2' },
            { id: 3, name: 'Mock Item 3', description: 'This is mock data 3' },
        ];

        //db จริงใช้อันนี้
        // const [rows] = await db.query('SELECT * FROM new');


        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
