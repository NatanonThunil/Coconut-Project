import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import routes from './routes/index.js';
// /backend/.env
config();

// const dotenv = require('dotenv');
// const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
// dotenv.config({ path: envFile });

const app = express();
//ให้ดูออกว่าดึง .env มาใช้ได้ไหม
const PORT = process.env.BE_PORT || 3000;
// const base = process.env.API_BASE || '/notuseorerror-api';

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
    // console.log(process.env.API_SECRET);
    if (key !== process.env.API_SECRET) {
        console.error('Invalid API key:', key); 
        return res.status(403).json({ error: 'Forbidden: Invalid API key' });
    }
    next();
});

/// ดึง API เป็นกระจุกอยู่ที่ /routes/index.js
routes.forEach(({ path, handler }) => {

    // คสรเป็น coconut-api/news อิงจาก routes/index
    app.use( `${path}` , handler);
});

/// ใช้ทดสอบ server เฉยๆ ลบออกก็ได้
app.get('/', (req, res) => {
    res.send('Starting Front-End...');
});


app.listen(PORT, () => {
    console.log(`🚀 Server is running on port: ${PORT}`);
});
