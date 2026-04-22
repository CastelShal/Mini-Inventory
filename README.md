# README

## Prerequisites
- NodeJS with pnpm 
- sqlite3 CLI (for applying the .sql file)

## Create the database
1. Apply the SQL schema file from the data/schema.sql to create tables or use the `init-db.js` file.
   The app expects the SQLite file at `/data/app.db`
2. As there are no other dependencies, simply clone the repository
3. Build and run
    ```
    pnpm install
    pnpm build
    pnpm start
    ```
