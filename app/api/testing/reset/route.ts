import { NextResponse } from "next/server";
import { blogs, readingList, users } from "../../../../db/schema";
import { getDb } from "../../../lib/db";

export async function DELETE() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This endpoint is not available in production" },
      { status: 403 },
    );
  }

  const db = getDb();
  await db.delete(readingList);
  await db.delete(blogs);
  await db.delete(users);

  return NextResponse.json({ message: "Database reset" });
}
