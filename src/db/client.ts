import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export const getDatabaseUrl = () => {
  const { DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME } = process.env;
  return `postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@localhost:5432/${DATABASE_NAME}`;
};

const pool = new Pool({
  connectionString: getDatabaseUrl(),
});

export const db = drizzle(pool, { schema });