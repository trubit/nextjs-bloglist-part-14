"use server";

import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { refresh, revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth";
import { users } from "../../db/schema";
import { getDb } from "../lib/db";

export async function generateApiToken() {
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id);
  if (!Number.isInteger(userId) || userId < 1) redirect("/login");

  const token = randomUUID();
  let updated = false;
  let lastError: unknown;

  for (let attempt = 0; attempt < 3 && !updated; attempt += 1) {
    try {
      await getDb().update(users).set({ token }).where(eq(users.id, userId));
      updated = true;
    } catch (error) {
      lastError = error;
      if (attempt < 2) {
        await new Promise((resolve) =>
          setTimeout(resolve, 200 * (attempt + 1)),
        );
      }
    }
  }

  if (!updated) throw lastError;

  revalidatePath("/me");
  refresh();
}
