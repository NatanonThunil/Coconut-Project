import { Router } from 'express';
import db from '../db.js';
import { requireRole } from './auth.js';

const router = Router();

/**
 * GET /stats/overview
 * คืนค่าเป็น object ของยอดรวมต่อคีย์ เช่น:
 * {
 *   news: 10, events: 5, coconuts: 7, achievements: 3, ...
 * }
 *
 * Optional: /stats/overview?only=news,events  (เลือกเฉพาะบางคีย์)
 */
router.get('/overview', requireRole(['admin', 'superadmin']), async (req, res) => {
  try {
    // key -> table name (ชื่อตารางตามรูป)
    const whitelist = [
      ['news',        'new'],
      ['events',      'event'],       // ใช้ backtick ตอน query
      ['coconuts',    'coconut'],
      ['achievements','achievement'],
      ['chain_values','chain_values'],
      ['employees',   'employee'],
      ['experts',     'expert'],
      ['expert_tag',  'expert_tag'],  // join table
      ['expert_tags', 'expert_tags'], // ถ้ามีใช้งานจริง จะนับได้
      ['faqs',        'faq'],
      ['footers',     'footer'],
      ['members',     'member'],
      ['pests',       'pest'],
      ['services',    'service'],
      ['tags',        'tag'],
      ['tag_lines',   'tag_line'],
      ['taqs',        'taqs'],        // มีอยู่ตามรูป เลยใส่ให้ด้วย
    ];

    // ถ้า caller ส่ง only=... จะนับเฉพาะคีย์ที่ระบุ
    let targets = whitelist;
    if (typeof req.query.only === 'string' && req.query.only.trim()) {
      const onlySet = new Set(
        req.query.only.split(',').map(s => s.trim()).filter(Boolean)
      );
      targets = whitelist.filter(([key]) => onlySet.has(key));
    }

    const entries = await Promise.all(
      targets.map(async ([key, table]) => {
        try {
          const [[{ c }]] = await db.query(`SELECT COUNT(*) AS c FROM \`${table}\``);
          return [key, Number(c)];
        } catch (e) {
          console.warn(`[STATS][OVERVIEW] skip ${table}:`, e.code || e.message);
          // ถ้าตารางไม่มี/สะกดไม่ตรง จะคืน 0 แทน ไม่ทำให้ทั้ง endpoint พัง
          return [key, 0];
        }
      })
    );

    const payload = Object.fromEntries(entries);
    // ใส่เวลาออกรายงานเผื่อใช้ debug
    payload.generated_at = new Date().toISOString();

    res.json(payload);
  } catch (e) {
    console.error('[STATS][OVERVIEW]', e);
    res.status(500).json({ message: 'Failed to load stats' });
  }
});

export default router;
