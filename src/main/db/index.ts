import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { dbSchemas } from "./schemas";

const sqlite = new Database("sqlite.db");
export const db = drizzle(sqlite, {
  schema: dbSchemas,
});
