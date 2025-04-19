import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import routes from './routes/index.js';

config();

const app = express();
const PORT = process.env.BE_PORT || 5100;
const base = process.env.API_BASE || '/api';

app.use(cors({
    origin: process.env.FE_BASE_URL,
    credentials: true
}));
/// Middleware ใช้กันไม่ให้เข้าไปที่ API ได้ง่ายๆ
app.use((req, res, next) => {
    
    const key = req.headers['cocon-key']; 
    if (!key) {
        console.error('Missing API key in headers'); 
    }
    if (key !== process.env.API_SECRET) {
        console.error('Invalid API key:', key); 
        return res.status(403).json({ error: 'Forbidden: Invalid API key' });
    }
    next();
});

/// ดึง API เป็นกระจุกอยู่ที่ /routes/index.js
routes.forEach(({ path, handler }) => {
    app.use(`${base}${path}`, handler);
});

/// ใช้ทดสอบ server เฉยๆ ลบออกก็ได้
app.get('/', (req, res) => {
    res.send('Starting Front-End...');
});


app.listen(PORT, () => {
    console.log(`🚀 Server is running on port: ${PORT}`);
});
