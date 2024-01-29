import {
  integer,
  sqliteTable,
  text,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

/**
 * Represents the schema for the "printers" table in the database.
 */
export const printers = sqliteTable(
  "printers",
  {
    id: integer("id"),
    name: text("name").notNull(),
    ip_address: text("ip").notNull(),
    access_code: text("access_code").unique().notNull(),
    serial_number: text("serial_number").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.id, table.serial_number],
      }),
    };
  },
);

// Zod schema for inserting a new printer
export const insertPrinterSchema = createInsertSchema(printers);
// Zod schema for selecting a printer
export const selectPrinterSchema = createSelectSchema(printers);
