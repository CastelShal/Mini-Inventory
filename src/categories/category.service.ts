import { Statement } from "better-sqlite3";
import { getDb } from "../db.js";

const db = getDb();
const listCategoriesQuery: Statement<[], { id: number, name: string }> = await db.prepare(
  "SELECT id, name FROM category",
);

const addCategoryQuery: Statement<[string]> = await db.prepare<string>(
  "INSERT INTO category (name) VALUES (?)",
);

const deleteCategoryQuery = await db.prepare<number>(
  "DELETE FROM category WHERE id = ?"
)

export function listCategories(): { id: number, name: string }[] {
  return listCategoriesQuery.all();
}

export function createCategory(name: string): { id: number | bigint, name: string } | null {
  const res = addCategoryQuery.run(name);
  if (res.lastInsertRowid) {
    return {
      id: res.lastInsertRowid,
      name
    }
  }
  return null
}

export function deleteCategory(id: number): boolean {
  const res = deleteCategoryQuery.run(id);
  return res.changes > 0
}
