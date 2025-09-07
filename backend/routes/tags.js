// routes/tags.js
import { Router } from 'express';
const router = Router();
import { config } from 'dotenv';
config();
import db from '../db.js';

const API_KEY = process.env.API_SECRET;

// API key guard (same as your other routes)
router.use((req, res, next) => {
  const apiKey = req.headers['cocon-key'];
  if (apiKey !== API_KEY) {
    return res.status(403).json({ error: 'Forbidden: Invalid API key' });
  }
  next();
});

// Ensure schema once at boot
async function ensureSchema() {
  // case-insensitive uniqueness on text (utf8mb4_unicode_ci)
  await db.query(`
    CREATE TABLE IF NOT EXISTS tags (
      id   INT AUTO_INCREMENT PRIMARY KEY,
      text VARCHAR(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
      UNIQUE KEY uniq_text (text)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS expert_tags (
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
 * Returns similar tags for autocomplete.
 * Response: [{ id, text }, ...]
 */
router.get('/', async (req, res) => {
  try {
    const q = (req.query.search || '').trim();

    // No search → return a small list of popular/all tags (up to 100)
    if (!q) {
      const [rows] = await db.query(
        `SELECT id, text
         FROM tags
         ORDER BY text
         LIMIT 100`
      );
      return res.json(rows);
    }

    // Search: start-with first, then contains; rank by position
    const [rows] = await db.query(
      `SELECT id, text
         FROM tags
        WHERE text LIKE CONCAT('%', ?, '%')
        ORDER BY
          (text LIKE CONCAT(?, '%')) DESC,     -- starts with query first
          LOCATE(?, text),                      -- earliest match
          text
        LIMIT 50`,
      [q, q, q]
    );

    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * GET /experts/:id/tags
 * Returns the tags for an expert: ["tag1","tag2",...]
 */
router.get('/experts/:id/tags', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT t.text
         FROM expert_tags et
         JOIN tags t ON t.id = et.tag_id
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
 * PUT /experts/:id/tags
 * Body: { tags: ["a","b","c"] }  // up to 5, strings
 * Replaces expert's tags with provided list.
 */
router.put('/experts/:id/tags', async (req, res) => {
  const conn = await db.getConnection();
  try {
    const { id } = req.params;
    let { tags } = req.body;

    if (!Array.isArray(tags)) tags = [];
    // normalize: trim, dedupe, keep up to 5, drop empties
    const seen = new Set();
    tags = tags
      .map(t => String(t || '').trim())
      .filter(t => t.length > 0 && !seen.has(t.toLowerCase()) && seen.add(t.toLowerCase()))
      .slice(0, 5);

    await conn.beginTransaction();

    // Ensure each tag exists in tags table
    for (const t of tags) {
      await conn.query(`INSERT IGNORE INTO tags (text) VALUES (?)`, [t]);
    }

    // Load their IDs
    let tagIds = [];
    if (tags.length) {
      const [idRows] = await conn.query(
        `SELECT id, text FROM tags WHERE text IN (${tags.map(() => '?').join(',')})`,
        tags
      );
      tagIds = idRows.map(r => r.id);
    }

    // Replace associations
    await conn.query(`DELETE FROM expert_tags WHERE expert_id = ?`, [id]);

    if (tagIds.length) {
      const values = tagIds.map(tagId => [Number(id), tagId]);
      // mysql2 supports bulk VALUES ?
      await conn.query(
        `INSERT INTO expert_tags (expert_id, tag_id) VALUES ?`,
        [values]
      );
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
 * (Optional) GET /experts/by-tag?tag=foo
 * Returns experts having a given tag (no status filter, per your note).
 */
router.get('/experts/by-tag', async (req, res) => {
  try {
    const tag = (req.query.tag || '').trim();
    if (!tag) return res.status(400).json({ error: 'Missing tag query' });

    const [rows] = await db.query(
      `SELECT e.*
         FROM expert e
         JOIN expert_tags et ON et.expert_id = e.id
         JOIN tags t        ON t.id = et.tag_id
        WHERE t.text = ?
        ORDER BY e.id DESC`,
      [tag]
    );

    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
