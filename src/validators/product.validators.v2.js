const { z } = require('zod');

const idParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'id deve ser numérico'),
  }),
});

const createProductSchemaV2 = z.object({
  body: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    price: z.number().or(z.string()).transform(Number),
    brandId: z.number().or(z.string()).transform(Number),
    categoryId: z.number().or(z.string()).transform(Number),

    // campos “domínio calçados” (opcionais)
    gender: z.string().optional(),     // valide com enum depois, se quiser
    modelCode: z.string().optional(),
    material: z.string().optional(),
    isActive: z.boolean().optional(),

    // 1.4 cuidará das variants, aqui vamos só no produto
  }),
});

const updateProductSchemaV2 = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    price: z.number().or(z.string()).transform((v)=> v===undefined ? v : Number(v)).optional(),
    brandId: z.number().or(z.string()).transform(Number).optional(),
    categoryId: z.number().or(z.string()).transform(Number).optional(),

    gender: z.string().optional(),
    modelCode: z.string().optional(),
    material: z.string().optional(),
    isActive: z.boolean().optional(),
    slug: z.string().optional(),
  }),
});

const listProductQuerySchemaV2 = z.object({
  query: z.object({
    q: z.string().optional(),
    brandId: z.string().regex(/^\d+$/).optional(),
    categoryId: z.string().regex(/^\d+$/).optional(),
    minPrice: z.string().regex(/^\d+(\.\d+)?$/).optional(),
    maxPrice: z.string().regex(/^\d+(\.\d+)?$/).optional(),
    onlyActive: z.enum(['true','false']).optional(),

    page: z.string().regex(/^\d+$/).optional(),
    pageSize: z.string().regex(/^\d+$/).optional(),
    sortBy: z.enum(['id','name','price','createdAt','']).optional().transform(v=>v||undefined),
    sort: z.enum(['asc','desc']).optional(),
  }),
});

module.exports = {
  idParamSchema,
  createProductSchemaV2,
  updateProductSchemaV2,
  listProductQuerySchemaV2,
};
