// server.js
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import { config } from 'dotenv'

import routes from './routes/index.js'
import imgUploadRoutes from './routes/img-upload.js'
import pdfUploadRoutes from './routes/pdf-upload.js'
import authRouter from './routes/auth.js'

config()
const app = express()
const FE_ORIGIN = process.env.FE_BASE_URL || 'http://localhost:5000'

// --- security & basics ---
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
)
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cookieParser())

// --- CORS ---
app.use(
  cors({
    origin: FE_ORIGIN,
    credentials: true, // important for cookies
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'cocon-key', 'Authorization', 'X-Requested-With'],
  })
)

// --- rate-limit auth endpoints ---
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })
app.use('/auth', authLimiter)

// --- static files ---
app.use(express.static('public'))

// --- public routes (no API key required) ---
app.use('/img-upload', imgUploadRoutes)
app.use('/pdf-upload', pdfUploadRoutes)
app.use('/auth', authRouter) // login/register/logout/me เป็น public

// --- API-key middleware for protected routes ---
app.use((req, res, next) => {
  // skip OPTIONS (preflight)
  if (req.method === 'OPTIONS') return res.sendStatus(204)

  // skip public routes
  const publicPaths = ['/auth', '/img-upload', '/pdf-upload']
  if (publicPaths.some((p) => req.path.startsWith(p))) return next()

  const key = req.headers['cocon-key']
  if (!key || key !== process.env.API_SECRET) {
    return res.status(403).json({ error: 'Forbidden: Invalid or missing API key' })
  }
  next()
})

// --- protected routes ---
routes.forEach(({ path, handler }) => app.use(path, handler))

const PORT = process.env.BE_PORT || 3000
app.listen(PORT, () => console.log(`🚀 Server is running on port: ${PORT}`))
