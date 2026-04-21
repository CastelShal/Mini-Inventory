import { type NextFunction, type Response } from "express";
import { modifyUserSchema } from "./user.schema.js";
import { changeRole, listUsers } from "./user.service.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { createAuditLog } from "../audit_logger/audit_logs.js";

export async function getUsers(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const users = await listUsers();
    res.json({ data: users });
  } catch (error) {
    next(error);
  }
}

export async function modifyUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const input = modifyUserSchema.parse(req.body);
    const id = req.params?.id as string
    const user = await changeRole(req.headers, id, input.role);
    createAuditLog(req.session?.user.id!, id, "MODIFY_USER_ROLE")
    res.status(201).json({ data: user });
  } catch (error) {
    next(error);
  }
}
