import { type NextFunction, type Request, type Response } from "express";
import { createCategory, deleteCategory, listCategories } from "./category.service.js";
import { createCategorySchema } from "./category.schema.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { createAuditLog } from "../audit_logger/audit_logs.js";

export async function getCategories(
  _req: AuthenticatedRequest,
  res: Response,
) {
  const categories = await listCategories();
  res.json({ data: categories });
}

export async function removeCategory(req: AuthenticatedRequest, res: Response) {
  const id = parseInt(req.params.id as string);
  if (!id) {
    return res.status(400).send("Category ID required");
  }
  if (deleteCategory(id)){
    createAuditLog(req.session?.user.id!, id.toString(), "ADD_CATEGORY")
    return res.status(200).send("Category deleted");
  }
  else{
    return res.sendStatus(400);
  }
}

export async function addCategory(req: AuthenticatedRequest, res: Response) {
  const query = createCategorySchema.parse(req.body);
  const data = createCategory(query.name);
  
  if(!data){
    return res.status(400).send("Failed to add category");
  }
  createAuditLog(req.session?.user.id!, data.id.toString(), "ADD_CATEGORY")
  return res.status(201).send(data);
}