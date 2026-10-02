import { eq } from "drizzle-orm";
import { users } from "../../../db/schema";
import { getDb } from "../../lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authorization = request.headers.get("authorization");
  const match = authorization?.match(/^Bearer\s+(.+)$/i);
  const token = match?.[1].trim();

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [user] = await getDb()
    .select({ id: users.id, username: users.username, name: users.name })
    .from(users)
    .where(eq(users.token, token))
    .limit(1);

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const blogs = await getDb().query.blogs.findMany({
    where: (blogs, { eq }) => eq(blogs.userId, user.id),
    columns: { author: true, title: true, url: true },
  });

  return Response.json({
    ...user,
    createdBlogs: blogs,
  });
}
