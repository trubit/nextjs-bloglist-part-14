"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth";
import { blogs, readingList } from "../../db/schema";
import { getDb } from "../lib/db";

export async function addBlogToReadingList(formData: FormData) {
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id);
  if (!Number.isInteger(userId) || userId < 1) redirect("/login");

  const blogId = Number(formData.get("blogId"));
  if (!Number.isInteger(blogId) || blogId < 1) redirect("/blogs");

  const db = getDb();
  const [blog] = await db
    .select({ id: blogs.id, userId: blogs.userId })
    .from(blogs)
    .where(eq(blogs.id, blogId))
    .limit(1);
  if (!blog) redirect("/blogs");

  if (blog.userId !== userId) {
    await db
      .insert(readingList)
      .values({ userId, blogId })
      .onConflictDoNothing();
  }

  revalidatePath(`/blogs/${blogId}`);
  revalidatePath("/me");
}

export async function markBlogAsRead(formData: FormData) {
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id);
  if (!Number.isInteger(userId) || userId < 1) redirect("/login");

  const blogId = Number(formData.get("blogId"));
  if (!Number.isInteger(blogId) || blogId < 1) redirect("/me");

  await getDb()
    .update(readingList)
    .set({ read: true })
    .where(
      and(
        eq(readingList.userId, userId),
        eq(readingList.blogId, blogId),
        eq(readingList.read, false),
      ),
    );

  revalidatePath("/me");
}
