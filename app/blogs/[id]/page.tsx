import { getBlogs, likeBlog } from "../../lib/blogs";
import { notFound, redirect } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function BlogPage({ params }: Props) {
  const { id } = await params;
  const blogs = getBlogs();
  const blog = blogs.find((b) => b.id === Number(id));

  if (!blog) {
    notFound();
  }

  async function incrementLikes(formData: FormData) {
    "use server";

    const blogId = Number(formData.get("id"));
    likeBlog(blogId);
    redirect(`/blogs/${blogId}`);
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <div>author: {blog.author}</div>
      <div>
        url: <a href={blog.url}>{blog.url}</a>
      </div>
      <div>likes: {blog.likes}</div>
      <form action={incrementLikes}>
        <input type="hidden" name="id" value={blog.id} />
        <button type="submit">like</button>
      </form>
    </div>
  );
}
