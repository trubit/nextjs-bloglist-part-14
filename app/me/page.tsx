import { asc, eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth";
import { generateApiToken } from "../actions/me";
import { markBlogAsRead } from "../actions/reading-list";
import { getDb } from "../lib/db";
import { blogs, readingList, users } from "../../db/schema";

export const dynamic = "force-dynamic";

export default async function MePage() {
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id);
  if (!Number.isInteger(userId) || userId < 1) redirect("/login");

  const [user] = await getDb()
    .select({ name: users.name, username: users.username, token: users.token })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!user) redirect("/login");

  const savedBlogs = await getDb()
    .select({
      id: blogs.id,
      title: blogs.title,
      author: blogs.author,
      url: blogs.url,
      read: readingList.read,
    })
    .from(readingList)
    .innerJoin(blogs, eq(readingList.blogId, blogs.id))
    .where(eq(readingList.userId, userId))
    .orderBy(asc(blogs.title));
  const unreadBlogs = savedBlogs.filter((blog) => !blog.read);
  const readBlogs = savedBlogs.filter((blog) => blog.read);

  return (
    <section className="mx-auto max-w-2xl" data-testid="user-profile">
      <div className="mb-7 border-b border-stone-200 pb-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-emerald-800">
          Account
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900">
          My profile
        </h1>
      </div>

      <dl className="grid gap-4 sm:grid-cols-[130px_1fr]">
        <dt className="text-sm font-semibold text-stone-600">Name</dt>
        <dd data-testid="user-name" className="text-sm text-stone-900">
          {user.name}
        </dd>
        <dt className="text-sm font-semibold text-stone-600">Username</dt>
        <dd data-testid="user-username" className="text-sm text-stone-900">
          {user.username}
        </dd>
      </dl>

      <div
        data-testid="api-token-section"
        className="mt-8 border-t border-stone-200 pt-6"
      >
        <h2 className="text-lg font-semibold text-stone-900">API token</h2>
        <div className="mt-4 rounded border border-stone-200 bg-white p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
            Current token
          </p>
          {user.token ? (
            <div data-testid="token-display">
              <code
                data-testid="api-token"
                className="block break-all rounded bg-stone-100 px-3 py-2 font-mono text-sm text-stone-800"
              >
                {user.token}
              </code>
            </div>
          ) : (
            <p
              data-testid="no-token-message"
              className="text-sm text-stone-600"
            >
              No token has been generated yet.
            </p>
          )}
        </div>
        <form action={generateApiToken} className="mt-4">
          <button
            type="submit"
            data-testid="generate-token-button"
            className="rounded bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
          >
            Generate new token
          </button>
        </form>
      </div>

      <div
        data-testid="reading-list-section"
        className="mt-8 border-t border-stone-200 pt-6"
      >
        <h2 className="text-lg font-semibold text-stone-900">Reading list</h2>
        {savedBlogs.length === 0 ? (
          <p
            data-testid="empty-reading-list"
            className="mt-4 text-sm text-stone-600"
          >
            No blogs in your reading list yet.
          </p>
        ) : (
          <div className="mt-5 space-y-7">
            <section
              data-testid="unread-section"
              aria-labelledby="unread-heading"
            >
              <h3
                id="unread-heading"
                className="text-sm font-semibold text-stone-700"
              >
                Unread ({unreadBlogs.length})
              </h3>
              {unreadBlogs.length > 0 ? (
                <ul className="mt-3 divide-y divide-stone-200 border-y border-stone-200">
                  {unreadBlogs.map((blog) => (
                    <li
                      key={blog.id}
                      className="flex flex-wrap items-center justify-between gap-3 py-4"
                    >
                      <div>
                        <Link
                          href={`/blogs/${blog.id}`}
                          className="font-semibold text-stone-900 hover:text-emerald-800"
                        >
                          {blog.title}
                        </Link>
                        <p className="mt-1 text-sm text-stone-500">
                          {blog.author}
                        </p>
                      </div>
                      <form action={markBlogAsRead}>
                        <input type="hidden" name="blogId" value={blog.id} />
                        <button
                          type="submit"
                          data-testid={`mark-read-${blog.id}`}
                          className="rounded bg-emerald-700 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
                        >
                          Mark as read
                        </button>
                      </form>
                    </li>
                  ))}
                </ul>
              ) : (
                <p
                  data-testid="no-unread-blogs"
                  className="mt-2 text-sm text-stone-500"
                >
                  No unread blogs.
                </p>
              )}
            </section>

            <section aria-labelledby="read-heading">
              <h3
                id="read-heading"
                className="text-sm font-semibold text-stone-700"
              >
                Read ({readBlogs.length})
              </h3>
              {readBlogs.length > 0 ? (
                <ul className="mt-3 divide-y divide-stone-200 border-y border-stone-200">
                  {readBlogs.map((blog) => (
                    <li
                      key={blog.id}
                      className="flex flex-wrap items-center justify-between gap-3 py-4"
                    >
                      <div>
                        <Link
                          href={`/blogs/${blog.id}`}
                          className="font-semibold text-stone-900 hover:text-emerald-800"
                        >
                          {blog.title}
                        </Link>
                        <p className="mt-1 text-sm text-stone-500">
                          {blog.author}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-stone-500">
                  No read blogs yet.
                </p>
              )}
            </section>
          </div>
        )}
      </div>
    </section>
  );
}
