import Link from "next/link";
import { getBlogs, type Blog } from "../lib/blogs";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ filter?: string }>;
};

export const dynamic = "force-dynamic";

export default async function BlogsPage({ searchParams }: Props) {
  const { filter = "" } = await searchParams;

  const blogs: Blog[] = (await getBlogs())
    .filter((blog: Blog) =>
      blog.title.toLowerCase().includes(filter.toLowerCase()),
    )
    .toSorted((a: Blog, b: Blog) => b.likes - a.likes);

  async function search(formData: FormData) {
    "use server";
    const filter = formData.get("filter") as string;
    redirect(`/blogs?filter=${encodeURIComponent(filter)}`);
  }

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-emerald-800">
            The reading list
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            Blogs
          </h1>
        </div>
        <Link
          href="/blogs/new"
          className="rounded bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
        >
          Add a blog
        </Link>
      </div>

      <form action={search} className="flex max-w-xl gap-2">
        <label className="sr-only" htmlFor="blog-filter">
          Search blogs
        </label>
        <input
          id="blog-filter"
          name="filter"
          data-testid="filter-input"
          defaultValue={filter}
          placeholder="Search by title"
          className="min-w-0 flex-1 rounded border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none placeholder:text-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
        />
        <button
          type="submit"
          data-testid="search-button"
          className="rounded border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
        >
          Search
        </button>
      </form>

      <div
        data-testid="blogs-list"
        className="divide-y divide-stone-200 border-y border-stone-200"
      >
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <article key={blog.id} className="group py-5">
              <Link
                href={`/blogs/${blog.id}`}
                className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-2"
              >
                <span className="text-lg font-semibold text-stone-900 transition-colors group-hover:text-emerald-800">
                  {blog.title}
                </span>
                <span className="text-sm text-stone-500">{blog.author}</span>
              </Link>
              <p className="mt-2 text-xs font-medium uppercase tracking-wide text-stone-400">
                {blog.likes} {blog.likes === 1 ? "like" : "likes"}
              </p>
            </article>
          ))
        ) : (
          <p className="py-10 text-sm text-stone-500">
            No blogs match this search.
          </p>
        )}
      </div>
    </div>
  );
}
