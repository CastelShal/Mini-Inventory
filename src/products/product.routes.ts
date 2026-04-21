import { Router } from "express";
import {
  getLowStockProducts,
  getProduct,
  getProducts,
  patchProduct,
  postProduct,
  removeProduct,
} from "./product.controller.js";
import { ensureRoles } from "../middleware/auth.middleware.js";
import uploadImage from "../middleware/upload.middleware.js";

const productRouter = Router();

productRouter.get("/low-stock", ensureRoles(['admin', 'vendor']) , getLowStockProducts);
productRouter.get("/", getProducts);
productRouter.get("/:id", getProduct);
productRouter.post("/", ensureRoles(['admin', 'vendor']), uploadImage, postProduct);
productRouter.patch("/:id", ensureRoles(['admin', 'vendor']), patchProduct);
productRouter.delete("/:id", ensureRoles(['admin']),  removeProduct);

export { productRouter };
