import { users } from "../../db/schema";
import { getDb } from "./db";

export const getUsers = () => getDb().select().from(users);

export const getUserWithBlogs = (username: string) =>
  getDb().query.users.findFirst({
    where: (users, { eq }) => eq(users.username, username),
    with: {
      blogs: {
        orderBy: (blogs, { asc }) => asc(blogs.title),
      },
    },
  });
