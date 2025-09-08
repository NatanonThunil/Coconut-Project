// server.js
import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import routes from './routes/index.js';
import imgUploadRoutes from './routes/img-upload.js';
import pdfUploadRoutes from './routes/pdf-upload.js';

config();
const app = express();

const FE_ORIGIN = process.env.FE_BASE_URL || 'http://localhost:5000';
const corsOptions = {
  origin: FE_ORIGIN,
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','cocon-key','Authorization'],
};


app.use(cors(corsOptions));


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


app.use('/img-upload', imgUploadRoutes); 
app.use('/pdf-upload', pdfUploadRoutes);

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));


app.use((req, res, next) => {
  const key = req.headers['cocon-key'];
  if (!key || key !== process.env.API_SECRET) {
    return res.status(403).json({ error: 'Forbidden: Invalid or missing API key' });
  }
  next();
});


routes.forEach(({ path, handler }) => app.use(path, handler));

app.get('/', (_req, res) => res.send('Starting Front-End...'));

const PORT = process.env.BE_PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server is running on port: ${PORT}`));
