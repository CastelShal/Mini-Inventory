# README

## Prerequisites
- pnpm 
- sqlite3 CLI (for applying the .sql file)

## Create the database
1. Apply the SQL schema file from the data/schema.sql to create tables or use the migration.sql file
    The app expects the SQLite file at /data/app.db
2. Build and run
    ```
    pnpm install
    pnpm build
    pnpm start
    ```
