import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../../db/schema";

const globalForDb = globalThis as typeof globalThis & {
  postgresClient?: ReturnType<typeof postgres>;
  drizzleDb?: ReturnType<typeof drizzle<typeof schema>>;
};

export const getDb = () => {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  globalForDb.postgresClient ??= postgres(databaseUrl, { max: 5 });
  globalForDb.drizzleDb ??= drizzle(globalForDb.postgresClient, { schema });

  return globalForDb.drizzleDb;
};
