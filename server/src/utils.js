import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const hashPassword = async (plain) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
};

export const comparePassword = (plain, hash) => bcrypt.compare(plain, hash);

export const signToken = (user) => {
  const payload = { id: user.id, role: user.role, name: user.name, email: user.email };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const buildSort = (sortBy, sortDir, allow = []) => {
  const col = allow.includes(sortBy) ? sortBy : allow[0];
  const dir = sortDir?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  return { col, dir };
};
