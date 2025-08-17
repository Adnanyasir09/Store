import { Router } from 'express';
import { q } from '../db.js';
import { createUserSchema } from '../validators.js';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { hashPassword, buildSort } from '../utils.js';

const router = Router();

// Admin: create users (Admin/User/Owner)
router.post('/', auth, requireRole('ADMIN'), async (req, res) => {
  const { error, value } = createUserSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const { name, email, address, password, role } = value;
  const exists = await q('SELECT id FROM users WHERE email=$1', [email]);
  if (exists.rowCount) return res.status(409).json({ message: 'Email already registered' });

  const password_hash = await hashPassword(password);
  const r = await q(
    `INSERT INTO users(name,email,address,password_hash,role)
     VALUES($1,$2,$3,$4,$5)
     RETURNING id,name,email,address,role`,
    [name, email, address, password_hash, role]
  );
  res.status(201).json(r.rows[0]);
});

// Admin: list users with filters + sort
router.get('/', auth, requireRole('ADMIN'), async (req, res) => {
  const { search = '', role, sortBy = 'name', sortDir = 'ASC', page = 1, pageSize = 20 } = req.query;
  const { col, dir } = buildSort(sortBy, sortDir, ['name', 'email', 'address', 'role', 'created_at']);

  const params = [];
  let where = 'WHERE 1=1';
  if (search) {
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    where += ` AND (LOWER(name) LIKE LOWER($${params.length-2}) OR LOWER(email) LIKE LOWER($${params.length-1}) OR LOWER(address) LIKE LOWER($${params.length}))`;
  }
  if (role) {
    params.push(role);
    where += ` AND role = $${params.length}`;
  }

  const count = await q(`SELECT COUNT(*) FROM users ${where}`, params);
  params.push(pageSize, (page - 1) * pageSize);

  const rows = await q(
    `SELECT id,name,email,address,role,created_at FROM users
     ${where}
     ORDER BY ${col} ${dir}
     LIMIT $${params.length-1} OFFSET $${params.length}`,
    params
  );

  res.json({ total: Number(count.rows[0].count), items: rows.rows });
});

// Admin: get user detail (+ owner rating if role=OWNER)
router.get('/:id', auth, requireRole('ADMIN'), async (req, res) => {
  const u = await q('SELECT id,name,email,address,role FROM users WHERE id=$1', [req.params.id]);
  if (!u.rowCount) return res.status(404).json({ message: 'Not found' });

  const user = u.rows[0];
  if (user.role === 'OWNER') {
    const r = await q(
      `SELECT s.id, s.name, COALESCE(AVG(rt.value),0)::float AS avg_rating, COUNT(rt.id)::int AS rating_count
       FROM stores s
       LEFT JOIN ratings rt ON rt.store_id = s.id
       WHERE s.owner_id=$1
       GROUP BY s.id,s.name`,
      [user.id]
    );
    return res.json({ ...user, stores: r.rows });
  }
  res.json(user);
});

export default router;
