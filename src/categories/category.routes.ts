import { Router } from "express";
import { addCategory, getCategories, removeCategory } from "./category.controller.js";
import { ensureRoles } from "../middleware/auth.middleware.js";

const categoryRouter = Router();

categoryRouter.get("/", getCategories);
categoryRouter.post("/", ensureRoles(["admin"]), addCategory)
categoryRouter.delete("/:id", ensureRoles(["admin"]) , removeCategory)
export { categoryRouter };
