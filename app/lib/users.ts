import { users } from "../../db/schema";
import { getDb } from "./db";

export const getUsers = () =>
  getDb()
    .select({ id: users.id, username: users.username, name: users.name })
    .from(users);

export const getUserWithBlogs = (username: string) =>
  getDb().query.users.findFirst({
    where: (users, { eq }) => eq(users.username, username),
    columns: { id: true, username: true, name: true },
    with: {
      blogs: {
        orderBy: (blogs, { asc }) => asc(blogs.title),
      },
    },
  });
