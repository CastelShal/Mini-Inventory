import { getDb } from "../db.js";
import type { CreateProductInput, UpdateProductInput } from "./product.schema.js";

const db = getDb();

const listProductsQuery = db.prepare(
  `SELECT
    id,
    name,
    description,
    price,
    stock,
    category_id AS categoryId,
    image_url AS imageUrl
  FROM product
  ORDER BY id DESC`,
);

const listProductsByCategoryQuery = db.prepare(
  `SELECT
    id,
    name,
    description,
    price,
    stock,
    category_id AS categoryId,
    image_url AS imageUrl
  FROM product
  WHERE category_id = ?`
);

const getProductByIdQuery = db.prepare(
  `SELECT
    id,
    name,
    description,
    price,
    stock,
    category_id AS categoryId,
    image_url AS imageUrl
  FROM product
   WHERE id = ?`
);

const listLowStockProductsQuery = db.prepare(
  `SELECT id, name, stock
   FROM product
   WHERE stock <= ?`
);
const createProductQuery = db.prepare(
  `INSERT INTO product (name, description, price, stock, category_id, image_url)
   VALUES (?, ?, ?, ?, ?, ?)`,
);
const updateProductQuery = db.prepare(
  `UPDATE product
   SET
     name = COALESCE(?, name),
     description = COALESCE(?, description),
     price = COALESCE(?, price),
     stock = COALESCE(?, stock),
     category_id = COALESCE(?, category_id),
     image_url = COALESCE(?, image_url)
   WHERE id = ?`,
);
const deleteProductQuery = db.prepare("DELETE FROM product WHERE id = ?");

export async function listProducts(categoryId?: number) {
  if (categoryId === undefined) {
    return listProductsQuery.all();
  }

  return listProductsByCategoryQuery.all(categoryId);
}

export async function getProductById(id: number) {
  return getProductByIdQuery.get(id);
}

export async function listLowStockProducts(threshold = 5) {
  return listLowStockProductsQuery.all(threshold);
}

export function createProduct(input: CreateProductInput, image_url: string | undefined) {
  const result = createProductQuery.run(
    input.name,
    input.description ?? null,
    input.price,
    input.stock,
    input.category_id ?? null,
    image_url ?? null,
  );

  return getProductByIdQuery.get(result.lastInsertRowid);
}

export async function updateProduct(id: number, input: UpdateProductInput) {
  const result = await updateProductQuery.run(
    input.name ?? null,
    input.description ?? null,
    input.price ?? null,
    input.stock ?? null,
    input.category_id ?? null,
    input.image_url ?? null,
    id,
  );

  if ((result.changes ?? 0) === 0) {
    return null;
  }

  return getProductByIdQuery.get(id);
}

export async function deleteProduct(id: number) {
  const result = await deleteProductQuery.run(id);
  return (result.changes ?? 0) > 0;
}
