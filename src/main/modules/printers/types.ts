import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { printers } from "./schemas";

export type Printer = InferSelectModel<typeof printers>;
/**
 * Represents a new printer.
 */
export type NewPrinter = InferInsertModel<typeof printers>;
