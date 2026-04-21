import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const dbPath = "data/app2.db"
const schemaPath = "data/schema.sql"

try {
  // Connect to database
  const db = new Database(dbPath);
  console.log(`✓ Connected to database: ${dbPath}`);

  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Schema file not found: ${schemaPath}`);
  }
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schema);
  console.log(`Schema executed successfully`);

  db.close();
  console.log(`Database initialization complete!`);
} catch (error) {
  console.error('✗ Error initializing database:', error);
  process.exit(1);
}
