const { z } = require('zod');

const cartIdParam = z.object({
  params: z.object({ cartId: z.string().regex(/^\d+$/) }),
});

const itemIdParam = z.object({
  params: z.object({ itemId: z.string().regex(/^\d+$/) }),
});

const startCartSchema = z.object({
  body: z.object({
    customerId: z.number().or(z.string()).transform(Number),
  }),
});

const addItemSchema = z.object({
  body: z.object({
    productId: z.number().or(z.string()).transform(Number),
    variantId: z.number().or(z.string()).transform(Number).optional(),
    quantity: z.number().or(z.string()).transform(Number).default(1),
    unitPrice: z.number().or(z.string()).transform(Number).optional(),
  }),
});

const updateItemQtySchema = z.object({
  body: z.object({
    quantity: z.number().or(z.string()).transform(Number),
    unitPrice: z.number().or(z.string()).transform(Number).optional(),
  }),
});

const checkoutSchema = z.object({
  body: z.object({
    shippingAddressId: z.number().or(z.string()).transform(Number),
  }),
});

module.exports = {
  cartIdParam,
  itemIdParam,
  startCartSchema,
  addItemSchema,
  updateItemQtySchema,
  checkoutSchema,
};
