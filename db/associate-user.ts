import dotenv from "dotenv";
import { eq } from "drizzle-orm";
import { blogs, users } from "./schema";
import { getDb } from "../app/lib/db";

dotenv.config({ path: ".env.local" });

async function main() {
  const db = getDb();
  const username = "trusonhub";
  const name = "Truson Hub";
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.username, username));
  const [user] = existing.length
    ? existing
    : await db.insert(users).values({ username, name }).returning();

  await db.update(blogs).set({ userId: user.id });
  console.log(`Associated existing blogs with user ${user.id} (${user.name})`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
