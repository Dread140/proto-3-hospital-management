import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

let db;

export const getDb = async () => {
  if (db) return db;

  const dataDir = path.resolve(rootDir, 'server/data');

  // ✅ Ensure data folder exists
  await fs.mkdir(dataDir, { recursive: true });

  const dbPath = path.join(dataDir, 'hospital.db');

  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  await db.exec('PRAGMA foreign_keys = ON');

  // ✅ Load schema safely
  const schemaPath = path.resolve(rootDir, 'database/schema.sql');
  const schema = await fs.readFile(schemaPath, 'utf8');
  await db.exec(schema);

  console.log('✅ SQLite Connected:', dbPath);

  return db;
};
