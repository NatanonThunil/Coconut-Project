// server.js
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import { config } from 'dotenv'

import statsRouter from './routes/dashboards.js'
import routes from './routes/index.js'
import imgUploadRoutes from './routes/img-upload.js'
import pdfUploadRoutes from './routes/pdf-upload.js'
import authRouter from './routes/auth.js'


import quickAccessRoutes from './routes/quickaccess.js'

config()
const app = express()
const FE_ORIGIN = process.env.FE_BASE_URL || 'http://localhost:3000' 

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cookieParser())

app.use(
  cors({
    origin: FE_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'cocon-key', 'Authorization', 'X-Requested-With'],
  })
)

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })
app.use('/auth', authLimiter)

app.use(express.static('public'))

// ---------- ✅ Public / JWT-only routes (ไม่โดน API-key) ----------
app.use('/img-upload', imgUploadRoutes)
app.use('/pdf-upload', pdfUploadRoutes)
app.use('/auth', authRouter)
app.use('/stats', statsRouter)

// ✅ ให้ /quick-access ใช้ JWT ของตัวเอง (ผ่าน requireAuth ภายในไฟล์ route)
app.use('/quick-access', quickAccessRoutes)

// ---------- 🔒 API-key middleware สำหรับ route อื่น ๆ เท่านั้น ----------
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') return res.sendStatus(204)

  // เพิ่ม '/quick-access' เข้า whitelist ด้วยเพื่อกันพลาด
  const publicPaths = ['/auth', '/img-upload', '/pdf-upload', '/quick-access']
  if (publicPaths.some((p) => req.path.startsWith(p))) return next()

  const key = req.headers['cocon-key']
  if (!key || key !== process.env.API_SECRET) {
    return res.status(403).json({ error: 'Forbidden: Invalid or missing API key' })
  }
  next()
})

// ---------- Protected routes ที่ยังอยากใช้ API-key ----------
routes.forEach(({ path, handler }) => app.use(path, handler))

const PORT = process.env.BE_PORT || 5100
app.listen(PORT, () => console.log(`🚀 Server is running on port: ${PORT}`))
