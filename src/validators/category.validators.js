const { z } = require('zod');

const idParamSchema = z.object({
  params: z.object({ id: z.string().regex(/^\d+$/, 'id deve ser numérico') }),
});

const createCategorySchema = z.object({
  body: z.object({ name: z.string().min(1, 'name é obrigatório') }),
});

const updateCategorySchema = z.object({
  body: z.object({ name: z.string().min(1).optional() }),
});

const listCategoryQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    pageSize: z.string().regex(/^\d+$/).optional(),
    sortBy: z.enum(['id', 'name', '']).optional().transform(v => v || undefined),
    sort: z.enum(['asc', 'desc']).optional(),
  }),
});

module.exports = {
  idParamSchema,
  createCategorySchema,
  updateCategorySchema,
  listCategoryQuerySchema,
};
