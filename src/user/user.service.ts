import { IncomingHttpHeaders } from "http";
import { auth } from "../auth/better-auth.config.js";
import { getDb } from "../db.js";
import type { Role } from "./roles.js";
import { createAuditLog } from "../audit_logger/audit_logs.js";

const db = getDb();
const listQuery = await db.prepare(
  "SELECT id, name, email, role, createdAt FROM user ORDER BY createdAt DESC",
);

export async function listUsers() {
  return listQuery.all();
}

export async function changeRole(headers: IncomingHttpHeaders, id: string, role: Role) {
  return auth.api.setRole({
    body: {
      userId: id,
      role: role
    },
    headers
  })

}

