import { getDb } from "../db.js";

const db = getDb();
const auditLogQuery = await db.prepare("INSERT INTO audit_log (user_id, entity_id, action) VALUES (?, ?, ?)")

export const actions = {
    newUserRegister: "USER_REGISTRATION",
    modifyUserRole: "MODIFY_USER_ROLE",
    addProduct: "ADD_PRODUCT",
    updateProduct: "CHANGE_PRODUCT_DETAILS",
    deleteProduct: "REMOVE_PRODUCT",
    addCategory: "ADD_CATEGORY",
    deleteCategory: "REMOVE_CATEGORY"
} as const

export type AuditActions = typeof actions[keyof typeof actions]

export async function createAuditLog(userId: string, entityId: string, action: AuditActions) {
    auditLogQuery.run(userId, entityId, action)
}