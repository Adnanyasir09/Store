import { Router } from 'express';
import { q } from '../db.js';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { createStoreSchema } from '../validators.js';
import { buildSort } from '../utils.js';

const router = Router();

// Admin: create store
router.post('/', auth, requireRole('ADMIN'), async (req, res) => {
  const { error, value } = createStoreSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const { name, email, address, ownerId } = value;

  const r = await q(
    `INSERT INTO stores(name,email,address,owner_id) VALUES($1,$2,$3,$4)
     RETURNING id,name,email,address,owner_id`,
    [name, email || null, address || null, ownerId || null]
  );

  res.status(201).json(r.rows[0]);
});

// Public (auth required): list all stores with search/sort and include overall average + user's rating
router.get('/', auth, async (req, res) => {
  const { search = '', sortBy = 'name', sortDir = 'ASC', page = 1, pageSize = 20 } = req.query;
  const { col, dir } = buildSort(sortBy, sortDir, ['name', 'address', 'created_at']);
  const params = [];
  let where = 'WHERE 1=1';

  if (search) {
    params.push(`%${search}%`, `%${search}%`);
    where += ` AND (LOWER(s.name) LIKE LOWER($${params.length-1}) OR LOWER(s.address) LIKE LOWER($${params.length}))`;
  }

  const count = await q(`SELECT COUNT(*) FROM stores s ${where}`, params);

  params.push(req.user.id, pageSize, (page - 1) * pageSize);

  const sql = `
    SELECT s.id, s.name, s.email, s.address, s.owner_id,
           COALESCE(AVG(r.value),0)::float AS overall_rating,
           COUNT(r.id)::int AS rating_count,
           (SELECT value FROM ratings WHERE user_id=$${params.length-2} AND store_id=s.id) AS user_rating
    FROM stores s
    LEFT JOIN ratings r ON r.store_id = s.id
    ${where}
    GROUP BY s.id
    ORDER BY ${col} ${dir}
    LIMIT $${params.length-1} OFFSET $${params.length};
  `;

  const rows = await q(sql, params);
  res.json({ total: Number(count.rows[0].count), items: rows.rows });
});

// Owner: dashboard (list raters + average for their store(s))
router.get('/owner/mine', auth, requireRole('OWNER'), async (req, res) => {
  const stores = await q(
    `SELECT s.id, s.name, s.address,
            COALESCE(AVG(r.value),0)::float AS avg_rating,
            COUNT(r.id)::int AS rating_count
     FROM stores s
     LEFT JOIN ratings r ON r.store_id=s.id
     WHERE s.owner_id=$1
     GROUP BY s.id`,
    [req.user.id]
  );

  const storeIds = stores.rows.map(s => s.id);
  let raters = [];

  if (storeIds.length) {
    const r = await q(
      `SELECT rt.store_id, u.id as user_id, u.name, u.email, rt.value, rt.updated_at
       FROM ratings rt
       JOIN users u ON u.id = rt.user_id
       WHERE rt.store_id = ANY($1::uuid[])
       ORDER BY rt.updated_at DESC`,
      [storeIds]
    );
    raters = r.rows;
  }

  res.json({ stores: stores.rows, raters });
});

// Admin: list stores with Name, Email, Address, Rating (+ sort/filter)
router.get('/admin/list', auth, requireRole('ADMIN'), async (req, res) => {
  const { search = '', sortBy = 'name', sortDir = 'ASC', page = 1, pageSize = 20 } = req.query;
  const { col, dir } = buildSort(sortBy, sortDir, ['name', 'email', 'address', 'created_at']);
  const params = [];
  let where = 'WHERE 1=1';

  if (search) {
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    where += ` AND (LOWER(s.name) LIKE LOWER($${params.length-2}) 
                OR LOWER(s.email) LIKE LOWER($${params.length-1}) 
                OR LOWER(s.address) LIKE LOWER($${params.length}))`;
  }

  const count = await q(`SELECT COUNT(*) FROM stores s ${where}`, params);

  params.push(pageSize, (page - 1) * pageSize);

  const rows = await q(
    `SELECT s.id, s.name, s.email, s.address,
            COALESCE(AVG(r.value),0)::float AS rating,
            COUNT(r.id)::int AS rating_count
     FROM stores s
     LEFT JOIN ratings r ON r.store_id=s.id
     ${where}
     GROUP BY s.id
     ORDER BY ${col} ${dir}
     LIMIT $${params.length-1} OFFSET $${params.length}`,
    params
  );

  res.json({ total: Number(count.rows[0].count), items: rows.rows });
});

export default router;
