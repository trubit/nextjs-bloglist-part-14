import { eq, sql } from "drizzle-orm";
import { blogs } from "../../db/schema";
import { getDb } from "./db";

export type Blog = {
  id: number;
  title: string;
  author: string;
  url: string;
  likes: number;
  userId: number | null;
};

export const getBlogs = (): Promise<Blog[]> => getDb().select().from(blogs);

export const getBlog = async (id: number) => {
  const [blog] = await getDb().select().from(blogs).where(eq(blogs.id, id));
  return blog;
};

export const addBlog = async (blog: Omit<Blog, "id" | "likes" | "userId">) => {
  const [newBlog] = await getDb().insert(blogs).values(blog).returning();
  return newBlog;
};

export const likeBlog = async (id: number) => {
  const [blog] = await getDb()
    .update(blogs)
    .set({ likes: sql`${blogs.likes} + 1` })
    .where(eq(blogs.id, id))
    .returning();
  return blog;
};
