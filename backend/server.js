// server.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { config } from 'dotenv';

import routes from './routes/index.js';
import imgUploadRoutes from './routes/img-upload.js';
import pdfUploadRoutes from './routes/pdf-upload.js';
import authRouter from './routes/auth.js'; // <- NEW

config();
const app = express();

const FE_ORIGIN = process.env.FE_BASE_URL || 'http://localhost:5000';

const corsOptions = {
  origin: FE_ORIGIN,
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','cocon-key','Authorization'],
};

// --- security & basics ---
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' }}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

// optional: rate-limit only auth endpoints
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/auth', authLimiter);

// Preflight helper (kept from your code)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', FE_ORIGIN);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(','));
    res.header('Access-Control-Allow-Methods', corsOptions.methods.join(','));
    return res.sendStatus(204);
  }
  next();
});

app.use(express.static('public'));

// Public (no API key) uploads stay as-is
app.use('/img-upload', imgUploadRoutes);
app.use('/pdf-upload', pdfUploadRoutes);

// NEW: public auth routes (register/login/refresh/logout/me) BEFORE API-key wall
app.use('/auth', authRouter);

// API-key wall for everything else
app.use((req, res, next) => {
  const key = req.headers['cocon-key'];
  if (!key || key !== process.env.API_SECRET) {
    return res.status(403).json({ error: 'Forbidden: Invalid or missing API key' });
  }
  next();
});

// Your other feature routes (protected by API key)
routes.forEach(({ path, handler }) => app.use(path, handler));

const PORT = process.env.BE_PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server is running on port: ${PORT}`));
