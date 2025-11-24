const { z } = require('zod');

const productIdParam = z.object({
  params: z.object({ productId: z.string().regex(/^\d+$/) }),
});

const imageIdParam = z.object({
  params: z.object({ imageId: z.string().regex(/^\d+$/) }),
});

const createImageSchema = z.object({
  body: z.object({
    url: z.string().url('url inválida'),
    isPrimary: z.boolean().optional(),
    sortOrder: z.number().or(z.string())
      .transform(v => (v === '' || v === undefined ? undefined : Number(v)))
      .optional(),
  }),
});

const updateImageSchema = z.object({
  body: z.object({
    url: z.string().url().optional(),
    isPrimary: z.boolean().optional(),
    sortOrder: z.number().or(z.string())
      .transform(v => (v === '' || v === undefined ? undefined : Number(v)))
      .optional(),
  }),
});

module.exports = { productIdParam, imageIdParam, createImageSchema, updateImageSchema };
