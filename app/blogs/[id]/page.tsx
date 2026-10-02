import { getBlog, likeBlog } from "../../lib/blogs";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth";
import { addBlogToReadingList } from "../../actions/reading-list";

type Props = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function BlogPage({ params }: Props) {
  const { id } = await params;
  const blog = await getBlog(Number(id));

  if (!blog) {
    notFound();
  }
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id);
  const canAddToReadingList =
    Number.isInteger(userId) && userId > 0 && blog.userId !== userId;

  async function incrementLikes(formData: FormData) {
    "use server";

    const blogId = Number(formData.get("id"));
    await likeBlog(blogId);
    redirect(`/blogs/${blogId}`);
  }

  return (
    <article className="mx-auto max-w-3xl" data-testid="blog-detail">
      <Link
        href="/blogs"
        className="text-sm font-semibold text-emerald-800 hover:text-emerald-950"
      >
        ← All blogs
      </Link>
      <div className="mt-6 border-b border-stone-200 pb-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-emerald-800">
          Blog entry
        </p>
        <h1
          data-testid="blog-title"
          className="text-3xl font-bold leading-tight tracking-tight text-stone-900 sm:text-4xl"
        >
          {blog.title}
        </h1>
        <p className="mt-4 text-sm text-stone-600">
          Written by{" "}
          <span
            data-testid="blog-author"
            className="font-semibold text-stone-800"
          >
            {blog.author}
          </span>
        </p>
      </div>
      <div className="space-y-6 py-6">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-500">
            Original link
          </h2>
          <a
            href={blog.url}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block break-all text-sm font-medium text-emerald-800 underline decoration-emerald-300 underline-offset-4 hover:text-emerald-950"
          >
            {blog.url}
          </a>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-stone-200 pt-5">
          <p className="text-sm text-stone-600">
            <span className="font-semibold text-stone-900">{blog.likes}</span>{" "}
            {blog.likes === 1 ? "like" : "likes"}
          </p>
          <form action={incrementLikes}>
            <input type="hidden" name="id" value={blog.id} />
            <button
              type="submit"
              className="rounded border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-800 transition-colors hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
            >
              Like this blog
            </button>
          </form>
          {canAddToReadingList && (
            <form action={addBlogToReadingList}>
              <input type="hidden" name="blogId" value={blog.id} />
              <button
                type="submit"
                data-testid="add-to-reading-list-button"
                className="rounded bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
              >
                Add to reading list
              </button>
            </form>
          )}
        </div>
      </div>
    </article>
  );
}
