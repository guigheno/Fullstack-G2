const { z } = require('zod');

const customerIdParam = z.object({
  params: z.object({ customerId: z.string().regex(/^\d+$/) }),
});

const addressIdParam = z.object({
  params: z.object({ id: z.string().regex(/^\d+$/) }),
});

const createAddress = z.object({
  body: z.object({
    street: z.string().min(1),
    number: z.string().optional(),
    complement: z.string().optional(),
    district: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    zipCode: z.string().min(1),
  }),
});

const updateAddress = z.object({
  body: z.object({
    street: z.string().min(1).optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    district: z.string().optional(),
    city: z.string().min(1).optional(),
    state: z.string().min(1).optional(),
    zipCode: z.string().min(1).optional(),
  }),
});

module.exports = { customerIdParam, addressIdParam, createAddress, updateAddress };
