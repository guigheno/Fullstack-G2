const { z } = require('zod');

const idParam = z.object({
  params: z.object({ id: z.string().regex(/^\d+$/) }),
});

const listOrderQuery = z.object({
  query: z.object({
    customerId: z.string().regex(/^\d+$/).optional(),
    page: z.string().regex(/^\d+$/).optional(),
    pageSize: z.string().regex(/^\d+$/).optional(),
    sortBy: z.enum(['id','createdAt','status','total','']).optional().transform(v => v || undefined),
    sort: z.enum(['asc','desc']).optional(),
  }),
});

const orderItemInput = z.object({
  productId: z.number().or(z.string()).transform(Number),
  variantId: z.number().or(z.string()).transform(Number).optional(),
  quantity: z.number().or(z.string()).transform(Number),
  unitPrice: z.number().or(z.string()).transform(Number),
});

const createOrder = z.object({
  body: z.object({
    customerId: z.number().or(z.string()).transform(Number),
    shippingAddressId: z.number().or(z.string()).transform(Number),
    items: z.array(orderItemInput).min(1, 'items não pode ser vazio'),
  }),
});

const updateStatus = z.object({
  body: z.object({
    status: z.enum(['PENDING','PAID','SHIPPED','DELIVERED','CANCELED']),
  }),
});

module.exports = { idParam, listOrderQuery, createOrder, updateStatus };
