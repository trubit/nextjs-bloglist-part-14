import { integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
});

export const blogs = pgTable("blogs", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  author: varchar("author", { length: 255 }).notNull().default(""),
  url: text("url").notNull(),
  likes: integer("likes").notNull().default(0),
  userId: integer("user_id").references(() => users.id),
});

export type Blog = typeof blogs.$inferSelect;
export type User = typeof users.$inferSelect;
