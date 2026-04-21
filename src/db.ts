import path from "node:path";
import Database from "better-sqlite3";
import type { Database as DatabaseT } from "better-sqlite3";

const DATABASE_FILE = 'app.db';

export let db: DatabaseT;

export function getDb() {
  if(!db){
    db = initDb()
  }

  return db;
}

function initDb(): DatabaseT {
  const dataDir = path.join(process.cwd(), "data");
  db = new Database(path.join(dataDir, DATABASE_FILE))
  return db;
}

