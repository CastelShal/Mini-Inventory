import { z } from "zod";

export const productIdParamSchema = z.object({
  id: z.coerce.number().int().positive("id must be a positive integer"),
});

export const listProductsQuerySchema = z.object({
  category_id: z.coerce.number().int().positive().optional(),
});

export const createProductSchema = z.object({
  name: z.string().trim().min(1, "name is required"),
  description: z.string().trim().nullable().optional(),
  price: z.coerce.number().positive("price must be greater than 0"),
  stock: z.coerce.number().int().min(0, "stock must be 0 or greater"),
  category_id: z.coerce.number().int().nullable().optional(),
});

export const updateProductSchema = z.object({
  name: z.string().trim().min(1, "name is required").optional(),
  description: z.string().trim().nullable().optional(),
  price: z.coerce.number().positive("price must be greater than 0").optional(),
  stock: z.coerce.number().int().min(0, "stock must be 0 or greater").optional(),
  category_id: z.coerce.number().int().positive().nullable().optional(),
  image_url: z.string().trim().min(1).nullable().optional(),
});

export type ProductIdParams = z.infer<typeof productIdParamSchema>;
export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
