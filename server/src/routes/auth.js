import { Router } from 'express';
import { q } from '../db.js';
import { signupSchema, loginSchema, changePasswordSchema } from '../validators.js';
import { hashPassword, comparePassword, signToken } from '../utils.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// Signup (Normal User)
router.post('/signup', async (req, res) => {
  const { error, value } = signupSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const { name, email, address, password } = value;
  const existing = await q('SELECT id FROM users WHERE email=$1', [email]);
  if (existing.rowCount) return res.status(409).json({ message: 'Email already registered' });

  const password_hash = await hashPassword(password);
  const result = await q(
    `INSERT INTO users(name,email,address,password_hash,role)
     VALUES($1,$2,$3,$4,'USER') RETURNING id,name,email,role,address`,
    [name, email, address, password_hash]
  );
  const user = result.rows[0];
  const token = signToken(user);
  res.json({ token, user });
});

// Login (everyone)
router.post('/login', async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const { email, password } = value;
  const r = await q('SELECT id,name,email,role,address,password_hash FROM users WHERE email=$1', [email]);
  if (!r.rowCount) return res.status(401).json({ message: 'Invalid credentials' });

  const u = r.rows[0];
  const ok = await comparePassword(password, u.password_hash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  delete u.password_hash;
  const token = signToken(u);
  res.json({ token, user: u });
});

// Change password (self)
router.post('/change-password', auth, async (req, res) => {
  const { error, value } = changePasswordSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const { currentPassword, newPassword } = value;
  const r = await q('SELECT password_hash FROM users WHERE id=$1', [req.user.id]);
  const ok = await comparePassword(currentPassword, r.rows[0].password_hash);
  if (!ok) return res.status(400).json({ message: 'Current password incorrect' });

  const newHash = await hashPassword(newPassword);
  await q('UPDATE users SET password_hash=$1 WHERE id=$2', [newHash, req.user.id]);
  res.json({ message: 'Password updated' });
});

export default router;
