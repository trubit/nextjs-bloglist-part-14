"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { users } from "../../db/schema";
import { getDb } from "../lib/db";

export type RegisterFormState = {
  errors?: Partial<
    Record<"name" | "username" | "password" | "passwordConfirm", string>
  >;
};

export async function registerUser(
  _previousState: RegisterFormState,
  formData: FormData,
): Promise<RegisterFormState> {
  const username = String(formData.get("username") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");
  const errors: NonNullable<RegisterFormState["errors"]> = {};

  if (!name) errors.name = "Name is required.";
  if (username.length < 4)
    errors.username = "Username must be at least 4 characters long.";
  if (password.length < 4)
    errors.password = "Password must be at least 4 characters long.";
  if (passwordConfirm !== password)
    errors.passwordConfirm = "Password confirmation must match the password.";
  if (Object.keys(errors).length > 0) return { errors };

  const db = getDb();
  const [existingUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, username))
    .limit(1);
  if (existingUser) {
    return { errors: { username: "That username is already taken." } };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await db.insert(users).values({ username, name, passwordHash });

  redirect("/login");
}
