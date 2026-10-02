import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { users } from "./db/schema";
import { getDb } from "./app/lib/db";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" as const },
  providers: [
    CredentialsProvider({
      name: "Username and password",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = credentials?.username?.trim();
        const password = credentials?.password;
        if (!username || !password) return null;

        const [user] = await getDb()
          .select()
          .from(users)
          .where(eq(users.username, username))
          .limit(1);
        if (
          !user?.passwordHash ||
          !(await compare(password, user.passwordHash))
        ) {
          return null;
        }

        return {
          id: String(user.id),
          name: user.name,
          username: user.username,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) session.user.id = token.id;
      return session;
    },
  },
  pages: { signIn: "/login" },
};
