const { z } = require('zod');

const variantIdParam = z.object({
  params: z.object({ variantId: z.string().regex(/^\d+$/) }),
});

const variantImageIdParam = z.object({
  params: z.object({ imageId: z.string().regex(/^\d+$/) }),
});

const createVariantImageSchema = z.object({
  body: z.object({
    url: z.string().url('url inválida'),
    isPrimary: z.boolean().optional(),
    sortOrder: z.number().or(z.string())
      .transform(v => (v === '' || v === undefined ? undefined : Number(v)))
      .optional(),
  }),
});

const updateVariantImageSchema = z.object({
  body: z.object({
    url: z.string().url().optional(),
    isPrimary: z.boolean().optional(),
    sortOrder: z.number().or(z.string())
      .transform(v => (v === '' || v === undefined ? undefined : Number(v)))
      .optional(),
  }),
});

module.exports = {
  variantIdParam,
  variantImageIdParam,
  createVariantImageSchema,
  updateVariantImageSchema,
};
