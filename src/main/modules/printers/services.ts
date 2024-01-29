import { db } from '@main/db';
import { printers } from '@main/modules/printers/schemas';
import { NewPrinter } from '@main/modules/printers/types';

export const addPrinter = async (printer: NewPrinter) => {
  return db.insert(printers).values(printer);
};

export const getAllPrinters = async () => {
  return db.select().from(printers);
};
