import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import routes from './routes/index.js';

config();


const app = express();

app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));
const PORT = process.env.BE_PORT || 3000;

app.use(express.static('public')) 
app.use(cors({
    origin: process.env.FE_BASE_URL,
    credentials: true
}));

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

routes.forEach(({ path, handler }) => {


    app.use(`${path}`, handler);
});


app.get('/', (req, res) => {
    res.send('Starting Front-End...');
});


app.listen(PORT, () => {
    console.log(`🚀 Server is running on port: ${PORT}`);
});
