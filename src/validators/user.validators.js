const { z } = require('zod');

const idParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

const updateUserProfileSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'name é obrigatório').optional(),
    email: z.string().email('email inválido').optional(),
  }).refine((b) => b.name !== undefined || b.email !== undefined, {
    message: 'Informe name e/ou email',
    path: ['name'],
  }),
});

const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'name é obrigatório'),
    email: z.string().email('email inválido'),
    passwordHash: z.string().min(1, 'passwordHash é obrigatório'),
    role: z.enum(['ADMIN', 'SELLER', 'CUSTOMER']).optional(),
  }),
});

module.exports = {
  idParamSchema,
  updateUserProfileSchema,
  createUserSchema,
};
