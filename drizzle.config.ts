import type { Config } from 'drizzle-kit';
import { app } from 'electron';
import path from 'path';

const dbPath = app.isPackaged
  ? path.join(process.resourcesPath, 'sqlite.db')
  : './sqlite.db';

export default {
  schema: ['./src/main/domains/**/*.schemas.ts'],
  out: './drizzle',
  driver: 'better-sqlite',
  dbCredentials: {
    url: dbPath,
  },
  breakpoints: true,
  verbose: true,
  strict: true,
} satisfies Config;
