// routes/tags.js
import { Router } from 'express';
const router = Router();
import { config } from 'dotenv';
config();
import db from '../db.js';

const API_KEY = process.env.API_SECRET;

// API key guard
router.use((req, res, next) => {
  const apiKey = req.headers['cocon-key'];
  if (apiKey !== API_KEY) {
    return res.status(403).json({ error: 'Forbidden: Invalid API key' });
  }
  next();
});

// Ensure schema once at boot
async function ensureSchema() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS tag (
      id   INT AUTO_INCREMENT PRIMARY KEY,
      text VARCHAR(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
      UNIQUE KEY uniq_text (text)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS expert_tag (
      expert_id INT NOT NULL,
      tag_id    INT NOT NULL,
      PRIMARY KEY (expert_id, tag_id),
      CONSTRAINT fk_et_expert FOREIGN KEY (expert_id) REFERENCES expert(id) ON DELETE CASCADE,
      CONSTRAINT fk_et_tag    FOREIGN KEY (tag_id)    REFERENCES tags(id)   ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}
ensureSchema().catch(console.error);

/**
 * GET /tags?search=foo
 * Autocomplete/ค้นหา tag (คืน [{id, text}, ...])
 */
router.get('/', async (req, res) => {
  try {
    const q = (req.query.search || '').trim();

    if (!q) {
      const [rows] = await db.query(
        `SELECT id, text
           FROM tag
          ORDER BY text
          LIMIT 100`
      );
      return res.json(rows);
    }

    const [rows] = await db.query(
      `SELECT id, text
         FROM tag
        WHERE text LIKE CONCAT('%', ?, '%')
        ORDER BY
          (text LIKE CONCAT(?, '%')) DESC,
          LOCATE(?, text),
          text
        LIMIT 50`,
      [q, q, q]
    );

    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
// POST /tags  { text }
// POST /tags  Body: { text }
// POST /tags  Body: { text }
router.post('/', async (req, res) => {
  try {
    const text = String(req.body?.text || '').trim();
    if (!text) return res.status(400).json({ error: 'Text is required' });

    const [result] = await db.query(`INSERT INTO tag (text) VALUES (?)`, [text]);
    const insertId = result.insertId;

    const [[row]] = await db.query(`SELECT id, text FROM tag WHERE id=?`, [insertId]);
    return res.status(201).json(row);        // << ส่ง JSON กลับเสมอ
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Tag name already exists' });
    return res.status(500).json({ error: e.message });
  }
});

// PUT /tags/:id  Body: { text }
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const text = String(req.body?.text || '').trim();
    if (!text) return res.status(400).json({ error: 'Text is required' });

    const [r] = await db.query(`UPDATE tag SET text=? WHERE id=?`, [text, id]);
    if (r.affectedRows === 0) return res.status(404).json({ error: 'Tag not found' });

    return res.json({ id: Number(id), text });  // << ส่ง JSON กลับเสมอ
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Tag name already exists' });
    return res.status(500).json({ error: e.message });
  }
});

// DELETE /tags/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(`DELETE FROM tag WHERE id=?`, [id]);
    return res.json({ ok: true });            // << ส่ง JSON กลับเสมอ
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});



/**
 * ✅ FIXED PATH: GET /tags/by-text/:text/experts
 * (เดิมโค้ดใช้ /tags/:text/experts ซึ่งซ้อน prefix /tags อีกรอบ)
 * ลิสต์ expert ตามชื่อแท็ก (text)
 */
router.get('/by-text/:text/experts', async (req, res) => {
  try {
    const text = String(req.params.text || '').trim();
    if (!text) return res.status(400).json({ error: 'Missing tag text' });

    const [[tagRow]] = await db.query(`SELECT id FROM tag WHERE text = ?`, [text]);
    if (!tagRow) return res.json([]); // ไม่มีแท็กนี้

    const [rows] = await db.query(
      `SELECT e.*
         FROM expert e
         JOIN expert_tag et ON et.expert_id = e.id
        WHERE et.tag_id = ?
        ORDER BY e.id DESC`,
      [tagRow.id]
    );

    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
/** ✅ POST /tags/experts/:expertId/tags/:tagId — ผูกแท็กให้ expert */
router.post('/experts/:expertId/tags/:tagId', async (req, res) => {
  try {
    const { expertId, tagId } = req.params;
    // กันซ้ำด้วย INSERT IGNORE
    await db.query(`INSERT IGNORE INTO expert_tag (expert_id, tag_id) VALUES (?, ?)`, [expertId, tagId]);
    res.json({ ok: true, expert_id: Number(expertId), tag_id: Number(tagId) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
/** ✅ GET /tags/experts/search?q=... — ค้นหา expert ด้วยชื่อ/อีเมล/องค์กร */
router.get('/experts/search', async (req, res) => {
  try {
    const q = String(req.query.q || '').trim();
    const like = `%${q}%`;
    const [rows] = await db.query(
      `SELECT e.id,
              e.name AS display_name,
              e.email,
             
              e.image
         FROM expert e
        WHERE (? = '' OR e.name LIKE ? OR e.email  LIKE ?)
        ORDER BY e.id DESC
        LIMIT 20`,
      [q, like, like, like]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/** ✅ DELETE /tags/:id — ลบแท็ก (จะลบ mapping อัตโนมัติด้วยเพราะ FK ON DELETE CASCADE) */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [r] = await db.query(`DELETE FROM tag WHERE id = ?`, [id]);
    if (r.affectedRows === 0) return res.status(404).json({ error: 'Tag not found' });
    res.json({ ok: true, id: Number(id) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * ✅ NEW: GET /tags/:id/experts
 * ลิสต์ expert ที่ใช้แท็กตาม id (เหมาะกับหน้า modal)
 */
router.get('/:id/experts', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT e.id, e.name, e.name_en, e.email, e.image
         FROM expert e
         JOIN expert_tag et ON et.expert_id = e.id
        WHERE et.tag_id = ?
        ORDER BY e.id DESC`,
      [id]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * (คงไว้) GET /tags/experts/:id/tags → คืน tag ของ expert รายคน
 */
router.get('/experts/:id/tags', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT t.text
         FROM expert_tag et
         JOIN tag t ON t.id = et.tag_id
        WHERE et.expert_id = ?
        ORDER BY t.text`,
      [id]
    );
    res.json(rows.map(r => r.text));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * (คงไว้) PUT /tags/experts/:id/tags
 * แทนที่ชุดแท็กของ expert คนนั้น (normalize + limit 5)
 * Body: { tags: string[] }
 */
router.put('/experts/:id/tags', async (req, res) => {
  const conn = await db.getConnection();
  try {
    const { id } = req.params;
    let { tags } = req.body;

    if (!Array.isArray(tags)) tags = [];
    const seen = new Set();
    tags = tags
      .map(t => String(t || '').trim())
      .filter(t => t.length > 0 && !seen.has(t.toLowerCase()) && seen.add(t.toLowerCase()))
      .slice(0, 5);

    await conn.beginTransaction();

    for (const t of tags) {
      await conn.query(`INSERT IGNORE INTO tag (text) VALUES (?)`, [t]);
    }

    let tagIds = [];
    if (tags.length) {
      const [idRows] = await conn.query(
        `SELECT id FROM tag WHERE text IN (${tags.map(() => '?').join(',')})`,
        tags
      );
      tagIds = idRows.map(r => r.id);
    }

    await conn.query(`DELETE FROM expert_tag WHERE expert_id = ?`, [id]);

    if (tagIds.length) {
      const values = tagIds.map(tagId => [Number(id), tagId]);
      await conn.query(`INSERT INTO expert_tag (expert_id, tag_id) VALUES ?`, [values]);
    }

    await conn.commit();
    res.json({ expert_id: Number(id), tags });
  } catch (e) {
    await conn.rollback();
    res.status(500).json({ error: e.message });
  } finally {
    conn.release();
  }
});

/**
 * ✅ NEW: DELETE /tags/experts/:expertId/tags/:tagId
 * Detach แท็กออกจาก expert คนเดียว (ใช้ใน modal ปุ่มลบ)
 */
router.delete('/experts/:expertId/tags/:tagId', async (req, res) => {
  try {
    const { expertId, tagId } = req.params;
    await db.query(`DELETE FROM expert_tag WHERE expert_id=? AND tag_id=?`, [expertId, tagId]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * (ทางเลือก) GET /tags/experts/by-tag?tag=foo
 * ลิสต์ expert จากชื่อแท็ก (query)
 */
router.get('/experts/by-tag', async (req, res) => {
  try {
    const tag = (req.query.tag || '').trim();
    if (!tag) return res.status(400).json({ error: 'Missing tag query' });

    const [rows] = await db.query(
      `SELECT e.*
         FROM expert e
         JOIN expert_tag et ON et.expert_id = e.id
         JOIN tag t        ON t.id = et.tag_id
        WHERE t.text = ?
        ORDER BY e.id DESC`,
      [tag]
    );

    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
// GET /tags/with-count?search=...
// คืน [{ id, text, expert_count }]
router.get('/with-count', async (req, res) => {
  try {
    const q = String(req.query.search || '').trim();
    if (!q) {
      const [rows] = await db.query(
        `SELECT t.id, t.text, COUNT(et.expert_id) AS expert_count
           FROM tag t
           LEFT JOIN expert_tag et ON et.tag_id = t.id
          GROUP BY t.id, t.text
          ORDER BY t.text
          LIMIT 200`
      );
      return res.json(rows);
    }

    // ถ้ามี search: จัดอันดับแบบ starts-with ก่อน ตามด้วยตำแหน่งที่พบ
    const idParam = /^\d+$/.test(q) ? Number(q) : -1;
    const like = `%${q}%`;
    const [rows] = await db.query(
      `SELECT t.id, t.text, COUNT(et.expert_id) AS expert_count
         FROM tag t
         LEFT JOIN expert_tag et ON et.tag_id = t.id
        WHERE t.text LIKE ? OR t.id = ?
        GROUP BY t.id, t.text
        ORDER BY
          (t.text LIKE CONCAT(?, '%')) DESC,
          LOCATE(?, t.text),
          t.text
        LIMIT 200`,
      [like, idParam, q, q]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
