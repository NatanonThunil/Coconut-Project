// routes/search.js
import { Router } from 'express';
import { config } from 'dotenv';
import db from '../db.js';

config();

const router = Router();

// ===== API key middleware =====
const API_KEY = process.env.API_SECRET;
router.use((req, res, next) => {
  const apiKey = req.headers['cocon-key'];
  if (apiKey !== API_KEY) {
    return res.status(403).json({ error: 'Forbidden: Invalid API key' });
  }
  next();
});


const TABLE_CONFIGS = [
  {
    table: 'new',
    type: 'new',
    titleCandidates: [ 'title_en', 'title'],
    bodyCandidates: [
      `summerize`,
      `summerize_en`,
      `description`,
      `description_en`,
       'author',
      'upload_date',
      
      
    ],
    dateCandidates: [],
    statusCol: 'status',
    url: (id) => `/news/details/${id}`,
    boost: 1.0,
  },

  {
    table: 'coconut',
    type: 'coconut',
    titleCandidates: ['name_th', 'name', 'name_eng', 'title'],
    bodyCandidates: [
      'name', 'name_eng',
      'description', 'origin', 'characteristics',
      'sci_name_f', 'sci_name_m', 'sci_name_l', 'youngold'
    ],
    dateCandidates: [],
    statusCol: 'status',
    url: (id) => `/coconut-information/coconut-varieties/details/${id}`,
    boost: 1.0,
  },

  // --- Pest (ศัตรูพืช) ---
  {
    table: 'pest',
    type: 'pest',
    // แก้ให้ค้นชื่อได้: ใส่ name/name_en ใน bodyCandidates ด้วย
    titleCandidates: ['name', 'name_en', 'sci_name'],
    bodyCandidates: [
      'name', 'name_en', 'sci_name',
      'lifecycle', 'lifecycle_en',
      'prevent',   'prevent_en',
      'type'
    ],
    dateCandidates: [],                 // ไม่มีคอลัมน์วันที่ใน schema นี้
    statusCol: 'status',
    url: (id) => `/coconut-information/pest/details/${id}`,
    boost: 1.15,
  },

  // --- Achievement (ผลงาน/บทความพร้อมไฟล์ PDF) ---
  {
    table: 'achievement',
    type: 'achievement',
    titleCandidates: ['title', 'title_en'],
    bodyCandidates: [
      'title', 'title_en', 'author',
      'description', 'description_en',
      'pdf'          // เผื่อค้นชื่อไฟล์
    ],
    dateCandidates: ['uploadDate'],     // ใช้คิด freshness ได้
    statusCol: 'status',
    url: (id) => `/aboutus/achievements/details/${id}`,
    boost: 1.05,
  },

  // --- Chain Values (ค่านิยม/หมวดเนื้อหา)
  {
    table: 'chain_values',
    type: 'chain_values',
    titleCandidates: ['title', 'title_en'],
    bodyCandidates: [
      'title', 'title_en',
      'description', 'description_en',
      'type', 'category'   // ฟิลด์จัดหมวด ใส่ให้ค้นได้
    ],
    dateCandidates: [],                 // ไม่มีวันตาม schema
    statusCol: 'status',
    url: (id) => `/coconut-information/value-chain/details/${id}`, // ปรับ path ให้ตรง FE ของคุณถ้าใช้ชื่ออื่น
    boost: 0.98,
  },

  // --- Employee (บุคลากร/ผู้เชี่ยวชาญย่อย)
  {
    table: 'employee',
    type: 'employee',
    titleCandidates: ['name', 'name_en'],
    bodyCandidates: [
      'name', 'name_en',
      'description', 'description_en',
      'address', 'address_en',
      'email', 'phoneNumber'
    ],
    dateCandidates: [],                 
    statusCol: 'status',
    url: (id) => `/aboutus/employees/details/${id}`,
    boost: 1.12,
  },

  // --- Event ---
{
  table: 'event',
  type: 'event',
  titleCandidates: ['title', 'title_en'],
  bodyCandidates: [
    'title', 'title_en',
    'organizer',
    'description', 'description_en',
    'event_category',
    'location_name', 'location_name_en',
    'location_url', 'register_url'
  ],
  // ใช้ date_start เป็นหลัก ถ้าไม่มีให้ลอง date_end
  dateCandidates: ['date_start', 'date_end', 'created_at', 'updated_at'],
  statusCol: 'status',
  url: (id) => `/events/details/${id}`,
  boost: 1.10,
},

// --- Expert ---
{
  table: 'expert',
  type: 'expert',
  titleCandidates: ['name', 'name_en'],
  bodyCandidates: [
    'name', 'name_en',
    'description', 'description_en',
    'address', 'address_en',
    'email', 'phoneNumber',
    'type'
  ],
  dateCandidates: ['created_at', 'updated_at'],
  statusCol: 'status',
  url: (id) => `/experts/details/${id}`,
  boost: 1.20,
},

// --- FAQ ---
{
  table: 'faq',
  type: 'faq',
  titleCandidates: ['question', 'question_en'],
  bodyCandidates: [
    'question', 'question_en',
    'answer', 'answer_en',
    'isadvice'          // เก็บคำว่า advice/guide ไว้ค้นได้
  ],
  dateCandidates: ['created_at', 'updated_at'],
  statusCol: 'status',
  url: (id) => `/faqs`,
  boost: 0.95,
},

// --- Member ---
{
  table: 'member',
  type: 'member',
  titleCandidates: ['name', 'name_en'],
  bodyCandidates: [
    'name', 'name_en',
    'description', 'description_en',
    'email',
    'address', 'address_en',
    'phoneNumber'
  ],
  dateCandidates: ['created_at', 'updated_at'],
  statusCol: 'status',
  url: (id) => `/aboutus/members/details/${id}`,
  boost: 1.05,
},

];

// ===== helpers: ตรวจคอลัมน์ที่มีจริง, เลือก expr ที่ปลอดภัย =====
async function getExistingColumns(table) {
  const [rows] = await db.query(
    `SELECT COLUMN_NAME
       FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?`,
    [table]
  );
  return new Set(rows.map((r) => r.COLUMN_NAME));
}

function pickFirstExisting(existing, candidates) {
  for (const c of candidates) if (existing.has(c)) return c;
  return null;
}

function pickManyExisting(existing, candidates) {
  return candidates.filter((c) => existing.has(c));
}

function buildTitleExpr(existing, candidates, fallbackLabel) {
  const cols = candidates.filter((c) => existing.has(c));
  if (cols.length === 0) return `CONCAT('${fallbackLabel} #', id)`;
  // COALESCE(NULLIF(col,''), next, …)
  const parts = cols.map((c) => `NULLIF(${c},'')`);
  return `COALESCE(${parts.join(', ')}, CONCAT('${fallbackLabel} #', id))`;
}


router.get('/', async (req, res) => {
  try {
    const q = String(req.query.q || '').trim().slice(0, 100);
    if (!q) return res.status(400).json({ error: 'empty query' });

    const limit = Math.min(parseInt(String(req.query.limit || '20')), 50);
    const page = Math.max(parseInt(String(req.query.page || '1')), 1);
    const typesFilter = String(req.query.types || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const statusOnly = String(req.query.statusOnly ?? 'true').toLowerCase() === 'true'; // ค่าเริ่มต้น: กรอง status=1
    const perTableLimit = Math.max(3, Math.ceil(limit / 2)); // กันไม่ให้ตารางเดียวท่วม

    const like = `%${q}%`;
    const now = Date.now();

    const activeCfgs = TABLE_CONFIGS.filter(
      (cfg) => !typesFilter.length || typesFilter.includes(cfg.type)
    );

    const tasks = activeCfgs.map(async (cfg) => {
      const existing = await getExistingColumns(cfg.table);

      // เลือกคอลัมน์ที่ "มีจริง"
      const bodyCols = pickManyExisting(existing, cfg.bodyCandidates);
      if (bodyCols.length === 0) return []; // ตารางนี้ไม่มีคอลัมน์ให้ค้น → ข้าม

      const titleExpr = buildTitleExpr(
        existing,
        cfg.titleCandidates,
        cfg.type.charAt(0).toUpperCase() + cfg.type.slice(1)
      );
      const dateCol = pickFirstExisting(existing, cfg.dateCandidates);

      // เงื่อนไข WHERE
      const whereParts = [];
      if (statusOnly && cfg.statusCol && existing.has(cfg.statusCol)) {
        whereParts.push(`(${cfg.statusCol} = 1)`);
      }
      whereParts.push(`(${bodyCols.map((c) => `${c} LIKE ?`).join(' OR ')})`);
      const where = whereParts.join(' AND ');

      // SELECT
      const bodyExpr = `CONCAT_WS(' ', ${bodyCols.join(', ')})`;
      const dateSelect = dateCol ? `, ${dateCol} AS date_col` : '';
      const sql = `
        SELECT id,
               ${titleExpr} AS title,
               ${bodyExpr} AS body
               ${dateSelect}
        FROM ${cfg.table}
        WHERE ${where}
        LIMIT ?
      `;
      const params = [...bodyCols.map(() => like), perTableLimit];

      const [rows] = await db.query(sql, params);

      // คิดคะแนน: boost × freshness(ถ้ามีวันที่)
      return (rows || []).map((r) => {
        let freshness = 1;
        if (dateCol && r?.date_col) {
          const age = now - new Date(r.date_col).getTime();
          freshness = Math.max(0.75, 1 - age / (1000 * 60 * 60 * 24 * 365));
        }
        const score = (cfg.boost || 1) * freshness;

        return {
          type: cfg.type,
          id: r.id,
          title: r.title,
          snippet: String(r.body || '').slice(0, 240),
          url: cfg.url(r.id),
          score,
        };
      });
    });

    const chunks = await Promise.all(tasks);
    const merged = chunks.flat().sort((a, b) => b.score - a.score);

    // pagination ระดับรวม
    const start = (page - 1) * limit;
    const end = start + limit;

    res.json({
      query: q,
      total: merged.length, // ถ้าต้องการ total แยกต่อชนิด ค่อยเพิ่มภายหลังได้
      page,
      limit,
      data: merged.slice(start, end),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
