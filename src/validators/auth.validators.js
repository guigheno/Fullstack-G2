const { z } = require('zod');

const customerInlineSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
}).optional();

const registerSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(4),
    role: z.enum(['ADMIN', 'SELLER', 'CUSTOMER']).optional(),
    customerId: z.number().or(z.string()).transform(Number).optional(),
    customer: customerInlineSchema,
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(4),
  }),
});

module.exports = { registerSchema, loginSchema };
