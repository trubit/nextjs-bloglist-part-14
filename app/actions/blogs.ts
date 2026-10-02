"use server";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { readingList } from "../../db/schema";
import { authOptions } from "../../auth";
import { addBlog } from "../lib/blogs";
import { getDb } from "../lib/db";

export type BlogFormState = {
  errors?: Partial<Record<"title" | "author" | "url", string>>;
  values?: { title: string; author: string; url: string };
  notification?: { message: string; type: "success" | "error" };
};

export async function createBlog(
  _previousState: BlogFormState,
  formData: FormData,
): Promise<BlogFormState> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login?callbackUrl=%2Fblogs%2Fnew");

  const title = String(formData.get("title") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const errors: NonNullable<BlogFormState["errors"]> = {};

  if (title.length < 5) errors.title = "Title must be at least 5 characters.";
  if (author.length < 5)
    errors.author = "Author must be at least 5 characters.";
  if (url.length < 5) errors.url = "URL must be at least 5 characters.";
  if (Object.keys(errors).length > 0) {
    return {
      errors,
      values: { title, author, url },
      notification: {
        message: "Check the highlighted blog details.",
        type: "error",
      },
    };
  }

  const userId = Number(session.user.id);
  const blog = await addBlog({ title, author, url, userId });
  await getDb().insert(readingList).values({ userId, blogId: blog.id });
  return {
    notification: { message: "Blog created successfully.", type: "success" },
  };
}
