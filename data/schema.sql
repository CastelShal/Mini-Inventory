PRAGMA foreign_keys = ON;

BEGIN TRANSACTION;

-- better-auth required tables
create table
  if not exists "user" (
    "id" text not null primary key,
    "name" text not null,
    "email" text not null unique,
    "emailVerified" integer not null,
    "image" text,
    "createdAt" date not null,
    "updatedAt" date not null,
    "role" text,
    "banned" integer,
    "banReason" text,
    "banExpires" date
  );

create table
  if not exists "session" (
    "id" text not null primary key,
    "expiresAt" date not null,
    "token" text not null unique,
    "createdAt" date not null,
    "updatedAt" date not null,
    "ipAddress" tIFext,
    "userAgent" text,
    "userId" text not null references "user" ("id") on delete cascade,
    "impersonatedBy" text
  );

create table
  if not exists "account" (
    "id" text not null primary key,
    "providerId" text not null,
    "accountId" text not null,
    "userId" text not null references "user" ("id") on delete cascade,
    "password" text,
    "createdAt" date not null,
    "updatedAt" date not null
  );

create index if not exists "session_userId_idx" on "session" ("userId");

create index if not exists "account_userId_idx" on "account" ("userId");

-- app tables
CREATE TABLE
  IF NOT EXISTS category (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  IF NOT EXISTS product (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    category_id INTEGER,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES category (id)
  );

CREATE TABLE
  IF NOT EXISTS audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_id INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user (id)
  );

COMMIT;