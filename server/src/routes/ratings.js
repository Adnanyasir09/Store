import { Router } from 'express';
import { q } from '../db.js';
import { auth } from '../middleware/auth.js';
import { ratingSchema } from '../validators.js';

const router = Router();

// Create or update rating (user can modify their rating)
router.post('/', auth, async (req, res) => {
  const { error, value } = ratingSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const { storeId, value: val } = value;

  const exists = await q('SELECT id FROM stores WHERE id=$1', [storeId]);
  if (!exists.rowCount) return res.status(404).json({ message: 'Store not found' });

  const upsert = await q(
    `INSERT INTO ratings (user_id, store_id, value)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, store_id)
     DO UPDATE SET value=EXCLUDED.value, updated_at=NOW()
     RETURNING id, user_id, store_id, value, updated_at`,
    [req.user.id, storeId, val]
  );

  res.status(201).json(upsert.rows[0]);
});

// Admin dashboard counters
router.get('/admin/stats', auth, async (req, res) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' });

  const users = await q('SELECT COUNT(*) FROM users');
  const stores = await q('SELECT COUNT(*) FROM stores');
  const ratings = await q('SELECT COUNT(*) FROM ratings');
  res.json({
    totalUsers: Number(users.rows[0].count),
    totalStores: Number(stores.rows[0].count),
    totalRatings: Number(ratings.rows[0].count)
  });
});

export default router;
