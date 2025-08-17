import Joi from 'joi';

// Name: Min 20 chars, Max 60
export const nameSchema = Joi.string().min(3).max(60).required();

// Address: Max 400
export const addressSchema = Joi.string().allow('', null).max(400);

// Password: 8-16 with at least one uppercase and one special character
export const passwordSchema = Joi.string()
  .pattern(/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/)
  .required();

export const emailSchema = Joi.string().email().required();

export const signupSchema = Joi.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  password: passwordSchema
});

export const loginSchema = Joi.object({
  email: emailSchema,
  password: Joi.string().required()
});

export const ratingSchema = Joi.object({
  storeId: Joi.string().guid({ version: 'uuidv4' }).required(),
  value: Joi.number().integer().min(1).max(5).required()
});

export const createUserSchema = Joi.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  password: passwordSchema,
  role: Joi.string().valid('ADMIN', 'USER', 'OWNER').required()
});

export const createStoreSchema = Joi.object({
  name: Joi.string().min(3).max(120).required(),
  email: Joi.string().email().allow('', null),
  address: Joi.string().max(400).allow('', null),
  ownerId: Joi.string().guid({ version: 'uuidv4' }).allow(null)
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: passwordSchema
});   