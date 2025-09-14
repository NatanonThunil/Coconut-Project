// backend/routes/auth.js
import { Router } from 'express';
import db from '../db.js';
import argon2 from 'argon2';
import Joi from 'joi';
import { signAT, signRT, setAuthCookies } from '../utils/jwt.js';

import jwt from 'jsonwebtoken';

const router = Router();

// --- Schemas ---
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().allow(null, ''),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});
router.post('/logout', (req, res) => {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  return res.json({ message: 'Logged out' });
});

router.get('/me', (req, res) => {
  const token = req.cookies?.access_token;
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    return res.json({ user: { id: decoded.sub, email: decoded.email } });
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
});
// --- Register ---
router.post('/register', async (req, res) => {
  try {
    const { value, error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const { email, password, name } = value;

    const [exists] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (exists.length) return res.status(409).json({ message: 'Email already registered' });

    const hash = await argon2.hash(password, { type: argon2.argon2id });
    const toStore = hash; // if your DB column is VARCHAR, keep this

    await db.query(
      'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)',
      [email, toStore, name || null]
    );

    const [rows] = await db.query('SELECT id, created_at FROM users WHERE email = ?', [email]);
    const user = { id: rows[0].id, email, name: name || null, created_at: rows[0].created_at };

    if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
      console.error('[AUTH] Missing JWT secrets');
      return res.status(500).json({ message: 'Server auth misconfigured' });
    }

    const at = signAT({ sub: user.id, email: user.email });
    const rt = signRT({ sub: user.id });
    setAuthCookies(res, at, rt);

    return res.status(201).json({ user });
  } catch (e) {
    console.error('[AUTH][REGISTER]', e);
    return res.status(500).json({ message: e.message || 'Server error' });
  }
});

// --- Login ---
router.post('/login', async (req, res) => {
  try {
    const { value, error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const { email, password } = value;
    const [rows] = await db.query(
      'SELECT id, email, password_hash, name, created_at FROM users WHERE email = ?',
      [email]
    );
    if (!rows.length) return res.status(401).json({ message: 'Invalid credentials' });

    const u = rows[0];

    const storedHash = Buffer.isBuffer(u.password_hash)
      ? u.password_hash.toString()
      : String(u.password_hash || '');

    const ok = await argon2.verify(storedHash, password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
      console.error('[AUTH] Missing JWT secrets');
      return res.status(500).json({ message: 'Server auth misconfigured' });
    }

    const user = { id: u.id, email: u.email, name: u.name, created_at: u.created_at };
    const at = signAT({ sub: user.id, email: user.email });
    const rt = signRT({ sub: user.id });
    setAuthCookies(res, at, rt);

    return res.json({ user });
  } catch (e) {
    console.error('[AUTH][LOGIN]', e);
    return res.status(500).json({ message: e.message || 'Server error' });
  }
});
router.get('/me', (req, res) => {
  try {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json({ message: 'No token' });

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    res.json({ user: { id: decoded.sub, email: decoded.email } });
  } catch (e) {
    console.error('[AUTH][ME]', e);
    return res.status(401).json({ message: 'Invalid token' });
  }
});
export default router;
