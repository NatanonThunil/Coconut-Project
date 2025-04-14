import express from 'express';
import { config } from 'dotenv';
import routes from './routes/index.js';

config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 8080;
const base = process.env.API_BASE || '/api';

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
