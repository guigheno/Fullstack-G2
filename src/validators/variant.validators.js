const { z } = require('zod');

const productIdParam = z.object({
  params: z.object({ productId: z.string().regex(/^\d+$/) }),
});

const variantIdParam = z.object({
  params: z.object({ variantId: z.string().regex(/^\d+$/) }),
});

const createVariantSchema = z.object({
  body: z.object({
    size: z.string().min(1),
    color: z.string().min(1),
    sku: z.string().min(1),
    stock: z.number().or(z.string()).transform(Number).default(0),
    price: z.number().or(z.string())
      .transform(v => (v === '' || v === undefined ? undefined : Number(v)))
      .optional(),
    ean: z.string().optional(),
  }),
});

const updateVariantSchema = z.object({
  body: z.object({
    size: z.string().min(1).optional(),
    color: z.string().min(1).optional(),
    sku: z.string().min(1).optional(),
    stock: z.number().or(z.string()).transform(Number).optional(),
    price: z.number().or(z.string())
      .transform(v => (v === '' || v === undefined ? undefined : Number(v)))
      .optional(),
    ean: z.string().optional(),
  }),
});

module.exports = { productIdParam, variantIdParam, createVariantSchema, updateVariantSchema };
