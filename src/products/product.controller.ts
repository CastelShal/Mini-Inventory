import { type NextFunction, type Response } from "express";
import {
  createProductSchema,
  listProductsQuerySchema,
  productIdParamSchema,
  updateProductSchema,
} from "./product.schema.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import {
  createProduct,
  deleteProduct,
  getProductById,
  listLowStockProducts,
  listProducts,
  updateProduct,
} from "./product.service.js";
import { createAuditLog } from "../audit_logger/audit_logs.js";

type ProductResult = {id: number}

export async function getProducts(req: AuthenticatedRequest, res: Response) {
    const query = listProductsQuerySchema.parse(req.query);
    const products = await listProducts(query.category_id);
    res.json({ data: products });
}

export async function getProduct(req: AuthenticatedRequest, res: Response) {
    const { id } = productIdParamSchema.parse(req.params);
    const product = await getProductById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ data: product });
}

export async function getLowStockProducts(
  req: AuthenticatedRequest,
  res: Response,
) {

    const products = await listLowStockProducts();
    res.json({ data: products });
}

export function postProduct(req: (AuthenticatedRequest & {file?: Express.Multer.File}), res: Response) {
    const input = createProductSchema.parse(req.body);
    const product = createProduct(input, req.file?.filename || undefined) as ProductResult;
    createAuditLog(req.session?.user.id!, product.id.toString(), "ADD_PRODUCT")
    res.status(201).json({ data: product });
}

export async function patchProduct(req: AuthenticatedRequest, res: Response) {
    const { id } = productIdParamSchema.parse(req.params);
    const input = updateProductSchema.parse(req.body);
    const product = await updateProduct(id, input) as ProductResult;
    createAuditLog(req.session?.user.id!, product.id.toString(), "CHANGE_PRODUCT_DETAILS")

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ data: product });
}

export async function removeProduct(req: AuthenticatedRequest, res: Response) {
    const { id } = productIdParamSchema.parse(req.params);
    const deleted = await deleteProduct(id);

    if (!deleted) {
      return res.status(404).json({ error: "Product not found" });
    }
    createAuditLog(req.session?.user.id!, id.toString(), "REMOVE_PRODUCT")

    res.status(204).send();
}
