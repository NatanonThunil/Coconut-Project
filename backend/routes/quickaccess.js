import { Router } from 'express'
import db from '../db.js'
import { requireAuth } from '../middlewares/requireAuth.js' 

const router = Router()

router.get('/top', requireAuth, async (req, res) => {
  const userId = req.user.sub
  const limit = Math.min(parseInt(req.query.limit ?? '4', 10), 12)
  const [rows] = await db.query(
    `SELECT resource_key AS \`key\`, title, link, icon, click_count, last_clicked_at
     FROM user_quick_access
     WHERE user_id = ?
     ORDER BY click_count DESC, last_clicked_at DESC
     LIMIT ?`,
    [userId, limit]
  )
  res.json({ items: rows })
})

router.post('/track', requireAuth, async (req, res) => {
  const userId = req.user.sub
  const { key, title, link, icon } = req.body || {}
  if (!key) return res.status(400).json({ message: 'key is required' })
  await db.query(
    `INSERT INTO user_quick_access (user_id, resource_key, title, link, icon, click_count, last_clicked_at)
     VALUES (?, ?, ?, ?, ?, 1, NOW())
     ON DUPLICATE KEY UPDATE
       click_count = click_count + 1,
       title = VALUES(title),
       link = VALUES(link),
       icon = VALUES(icon),
       last_clicked_at = NOW()`,
    [userId, key, title || null, link || null, icon || null]
  )
  res.json({ ok: true })
})

export default router
