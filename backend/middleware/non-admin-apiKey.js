
export const requireApiKey = (req, res, next) => {
    const key = req.headers['cocon-key'];
    const apiKey = process.env.API_SECRET;

    if (!apiKey) {
        console.error('API_SECRET is not set in .env');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    if (!key || key !== apiKey) {
        return res.status(403).json({ error: 'Forbidden: Invalid API key' });
    }

    next();
};
