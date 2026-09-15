import Link from "next/link";
import { notFound } from "next/navigation";
import { getUser, getUserBlogs } from "../../lib/users";

type Props = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function UserPage({ params }: Props) {
  const { id } = await params;
  const userId = Number(id);
  const user = await getUser(userId);

  if (!user) {
    notFound();
  }

  const blogs = await getUserBlogs(userId);

  return (
    <div>
      <h2>{user.name}</h2>
      <p>username: {user.username}</p>
      <h3>added blogs</h3>
      <ul>
        {blogs.map((blog) => (
          <li key={blog.id}>
            <Link href={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
