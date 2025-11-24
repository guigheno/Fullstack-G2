const { z } = require('zod');

const idParam = z.object({
  params: z.object({ id: z.string().regex(/^\d+$/, 'id deve ser numérico') }),
});

const createCustomer = z.object({
  body: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
  }),
});

const updateCustomer = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
  }),
});

const listCustomerQuery = z.object({
  query: z.object({
    q: z.string().optional(),
    page: z.string().regex(/^\d+$/).optional(),
    pageSize: z.string().regex(/^\d+$/).optional(),
    sortBy: z.enum(['id','name','email','createdAt','']).optional().transform(v => v || undefined),
    sort: z.enum(['asc','desc']).optional(),
  }),
});

module.exports = { idParam, createCustomer, updateCustomer, listCustomerQuery };
