import { Router } from 'express';
const router = Router();
import { config } from 'dotenv';
config();
import db from '../db.js';
const API_KEY = process.env.API_SECRET;


router.use((req, res, next) => {
  const apiKey = req.headers['cocon-key'];
  if (apiKey !== API_KEY) {
    return res.status(403).json({ error: 'Forbidden: Invalid API key' });
  }
  next();
});

/////////////////////////////// GET ALL (with tags + case-insensitive tag search)
router.get('/', async (req, res) => {
  try {
    const { tag } = req.query;


    const BASE_SELECT = `
      SELECT 
        e.id, e.image, e.name, e.name_en, e.address, e.address_en,
        e.phoneNumber, e.status, e.description, e.description_en,
        e.type, e.email,
        COALESCE(GROUP_CONCAT(DISTINCT t.text ORDER BY t.text SEPARATOR ','), '') AS tags
      FROM expert e
      LEFT JOIN expert_tag et ON et.expert_id = e.id
      LEFT JOIN tag t ON t.id = et.tag_id
    `;


    if (!tag) {
      const [rows] = await db.query(`
        ${BASE_SELECT}
        GROUP BY e.id
        ORDER BY e.id DESC
      `);
      return res.json(rows);
    }


    const raw = String(tag).trim();
    const [rows] = await db.query(`
      ${BASE_SELECT}
      WHERE LOWER(t.text) = LOWER(?) OR LOWER(t.text) LIKE LOWER(CONCAT('%', ?, '%'))
      GROUP BY e.id
      ORDER BY e.id DESC
    `, [raw, raw]);

    return res.json(rows);
  } catch (e) {
    console.error('[GET /experts] error:', e);
    res.status(500).json({ error: e.message });
  }
});

/////////////////////////////// GET BY ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM expert WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Expert not found' });
    }
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/:id/tags', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' });

    const [rows] = await db.query(
      `SELECT t.text
       FROM expert_tag et
       JOIN tag t ON t.id = et.tag_id
       WHERE et.expert_id = ?
       ORDER BY t.text ASC`,
      [id]
    );
    res.json(rows.map(r => r.text));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/////////////////////////////// POST
router.post('/', async (req, res) => {
  try {
    const {
      image,
      name,
      name_en,
      address,
      address_en,
      phoneNumber,
      status,
      description,
      description_en,
      type,
      email
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required.' });
    }

    const [result] = await db.query(
      `INSERT INTO expert 
             (image, name, name_en, address, address_en, phoneNumber, status, description, description_en, type, email)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [image, name, name_en, address, address_en, phoneNumber, status, description, description_en, type, email]
    );

    res.status(201).json({
      id: result.insertId,
      image,
      name,
      name_en,
      address,
      address_en,
      phoneNumber,
      status,
      description,
      description_en,
      type,
      email
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/////////////////////////////// PUT (UPDATE)
router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' });

    const body = req.body ?? {};
    const fields = [
      'image', 'name', 'name_en', 'address', 'address_en', 'phoneNumber',
      'status', 'description', 'description_en', 'type', 'email'
    ];

    const setParts = [];
    const params = [];
    for (const key of fields) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        if (key === 'status') {
          const s = (body.status === true || body.status === 1 || body.status === '1') ? 1 : 0;
          setParts.push(`status = ?`); params.push(s);
        } else if (key === 'type') {
          const t = Number.isFinite(Number(body.type)) ? Number(body.type) : null;
          setParts.push(`type = ?`); params.push(t);
        } else if (key === 'image') {
          // keep existing if null/undefined not provided
          setParts.push(`image = COALESCE(?, image)`); params.push(body.image ?? null);
        } else {
          setParts.push(`${key} = ?`); params.push(body[key] ?? null);
        }
      }
    }

    if (setParts.length === 0) {
      return res.status(400).json({ error: 'No updatable fields provided' });
    }

    const sql = `UPDATE expert SET ${setParts.join(', ')} WHERE id = ?`;
    const [result] = await db.query(sql, [...params, id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Expert not found' });
    res.json({ id, ...body });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal error while updating expert' });
  }
});
router.put('/:id/tags', async (req, res) => {
  const conn = await db.getConnection();
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    let tags = Array.isArray(req.body.tags) ? req.body.tags : [];
    tags = [...new Set(tags.map(t => String(t || '').trim()).filter(Boolean))].slice(0, 5);

    await conn.beginTransaction();

    const tagIds = [];
    for (const text of tags) {
      const [existing] = await conn.query('SELECT id FROM tag WHERE text = ?', [text]);
      if (existing.length) {
        tagIds.push(existing[0].id);
      } else {
        const [ins] = await conn.query('INSERT INTO tag (text) VALUES (?)', [text]);
        tagIds.push(ins.insertId);
      }
    }

    // 2) delete old links, then insert new links
    await conn.query('DELETE FROM expert_tag WHERE expert_id = ?', [id]);

    if (tagIds.length) {
      const values = tagIds.map(tid => [id, tid]);
      await conn.query('INSERT INTO expert_tag (expert_id, tag_id) VALUES ?', [values]);
    }

    await conn.commit();
    res.json({ ok: true, tags });
  } catch (e) {
    try { await conn.rollback(); } catch { }
    res.status(500).json({ error: e.message });
  } finally {
    conn.release();
  }
});
/////////////////////////////// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM expert WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Expert not found' });
    }
    res.json({ message: 'Expert deleted successfully' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
