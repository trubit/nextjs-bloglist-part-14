import { desc, eq } from "drizzle-orm";
import { blogs, users } from "../../db/schema";
import { getDb } from "./db";

export const getUsers = () => getDb().select().from(users);

export const getUser = async (id: number) => {
  const [user] = await getDb().select().from(users).where(eq(users.id, id));
  return user;
};

export const getUserBlogs = (userId: number) =>
  getDb()
    .select()
    .from(blogs)
    .where(eq(blogs.userId, userId))
    .orderBy(desc(blogs.likes));
