// backend/routes/auth.js
import { Router } from "express";
import db from "../db.js";
import argon2 from "argon2";
import Joi from "joi";
import { signAT, signRT, setAuthCookies } from "../utils/jwt.js";
import jwt from "jsonwebtoken";

const router = Router();

// --- Schemas ---
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().allow(null, ""),
  role: Joi.string().valid("admin", "superadmin").optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

// --- Role middleware ---
export const requireRole = (roles) => (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    if (!roles.includes(decoded.role))
      return res.status(403).json({ message: "Forbidden" });

    req.user = decoded;
    next();
  } catch (e) {
    console.error("[AUTH][ROLE]", e);
    return res.status(401).json({ message: "Invalid token" });
  }
};

// --- Logout ---
router.post("/logout", (req, res) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  res.json({ message: "Logged out" });
});

// --- Register ---
router.post("/register", async (req, res) => {
  try {
    const { value, error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const { email, password, name, role } = value;

    // Prevent creating superadmin via API
    if (role === "superadmin")
      return res.status(403).json({ message: "Cannot create superadmin" });

    // Only superadmin can create admin
    if (role === "admin") {
      const token = req.cookies.access_token;
      if (!token) return res.status(401).json({ message: "Unauthorized" });

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      const [rows] = await db.query("SELECT role FROM users WHERE id=?", [
        decoded.sub,
      ]);
      if (!rows.length || rows[0].role !== "superadmin") {
        return res
          .status(403)
          .json({ message: "Only superadmin can add admin" });
      }
    }

    // Check if email exists
    const [exists] = await db.query("SELECT id FROM users WHERE email=?", [
      email,
    ]);
    if (exists.length)
      return res.status(409).json({ message: "Email already registered" });

    // Hash password
    const hash = await argon2.hash(password, { type: argon2.argon2id });

    // Insert user (default role 'admin')
    await db.query(
      "INSERT INTO users (email,password_hash,name,role) VALUES (?,?,?,?)",
      [email, hash, name || null, role || "admin"]
    );

    const [rows] = await db.query(
      "SELECT id, created_at, role FROM users WHERE email=?",
      [email]
    );
    const user = {
      id: rows[0].id,
      email,
      name: name || null,
      role: rows[0].role,
      created_at: rows[0].created_at,
    };

    // Set JWT cookies
    setAuthCookies(
      res,
      signAT({ sub: user.id, email: user.email, role: user.role, name: user.name }),
      signRT({ sub: user.id })
    );

    console.log("[AUTH][REGISTER] New user registered:", email);

    res.status(201).json({ user });
  } catch (e) {
    console.error("[AUTH][REGISTER]", e);
    res.status(500).json({ message: e.message || "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query("SELECT * FROM users WHERE email=?", [email]);
    if (!rows.length) return res.status(401).json({ message: "Invalid email or password" });

    let u = rows[0];
    let storedHash = u.password_hash;
    if (Buffer.isBuffer(storedHash)) storedHash = storedHash.toString("utf8");

    const valid = await argon2.verify(storedHash, password);
    if (!valid) return res.status(401).json({ message: "Invalid email or password" });

    const user = {
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      created_at: u.created_at,
    };

    // สร้าง token
    const accessToken = signAT({ sub: user.id, email: user.email, role: user.role });
    const refreshToken = signRT({ sub: user.id });

    // ตั้ง cookie
    setAuthCookies(res, accessToken, refreshToken);

    // ส่ง response user และ accessToken
    return res.json({ user, accessToken });

  } catch (e) {
    console.error("[AUTH][LOGIN]", e);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", async (req, res) => {
  try {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);


    const [rows] = await db.query(
      "SELECT id, email, name, role FROM users WHERE id=?",
      [decoded.sub]
    );
    if (!rows.length) return res.status(404).json({ message: "User not found" });

    const u = rows[0];
    res.json({ user: { id: u.id, name: u.name, email: u.email, role: u.role } });
  } catch (e) {
    console.error("[AUTH][ME]", e);
    res.status(401).json({ message: "Invalid token" });
  }
});


export default router;
