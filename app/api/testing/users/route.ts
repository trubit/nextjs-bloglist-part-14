import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { users } from "../../../../db/schema";
import { getDb } from "../../../lib/db";

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This endpoint is not available in production" },
      { status: 403 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("username" in body) ||
    !("name" in body) ||
    !("password" in body) ||
    typeof body.username !== "string" ||
    typeof body.name !== "string" ||
    typeof body.password !== "string"
  ) {
    return NextResponse.json(
      { error: "username, name, and password are required" },
      { status: 400 },
    );
  }

  const username = body.username.trim();
  const name = body.name.trim();
  const password = body.password;
  if (!username || !name || password.length < 4) {
    return NextResponse.json(
      {
        error:
          "username and name are required; password must be at least 4 characters",
      },
      { status: 400 },
    );
  }

  const db = getDb();
  const [existingUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, username))
    .limit(1);
  if (existingUser) {
    return NextResponse.json(
      { error: "Username already exists" },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const [user] = await db
    .insert(users)
    .values({ username, name, passwordHash })
    .returning({ id: users.id, username: users.username, name: users.name });

  return NextResponse.json(user, { status: 201 });
}
