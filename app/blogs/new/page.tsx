import { redirect } from "next/navigation";
import { addBlog } from "../../lib/blogs";

export default function NewBlogPage() {
  async function createBlog(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const url = formData.get("url") as string;

    addBlog({ title, author, url });

    redirect("/blogs");
  }

  return (
    <div>
      <h2>create a new blog</h2>

      <form action={createBlog}>
        <div>
          title
          <input name="title" required />
        </div>
        <div>
          author
          <input name="author" />
        </div>
        <div>
          url
          <input name="url" required />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
}
