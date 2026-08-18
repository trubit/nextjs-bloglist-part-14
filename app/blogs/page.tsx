import Link from "next/link";
import { getBlogs } from "../lib/blogs";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ filter?: string }>;
};

export default async function BlogsPage({ searchParams }: Props) {
  const { filter = "" } = await searchParams;

  const blogs = getBlogs()
    .filter((blog) => blog.title.toLowerCase().includes(filter.toLowerCase()))
    .toSorted((a, b) => b.likes - a.likes);

  async function search(formData: FormData) {
    "use server";
    const filter = formData.get("filter") as string;
    redirect(`/blogs?filter=${encodeURIComponent(filter)}`);
  }

  return (
    <div>
      <h2>blogs</h2>
      <Link href="/blogs/new">create new</Link>

      <form action={search} style={{ margin: "1rem 0" }}>
        <input name="filter" defaultValue={filter} placeholder="search blogs" />
        <button type="submit">search</button>
      </form>

      <div>
        {blogs.map((blog) => (
          <div key={blog.id} style={{ marginBottom: "0.5rem" }}>
            <Link href={`/blogs/${blog.id}`}>
              {blog.title} {blog.author}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
