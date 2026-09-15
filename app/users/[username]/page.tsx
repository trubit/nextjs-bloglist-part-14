import Link from "next/link";
import { notFound } from "next/navigation";
import { getUserWithBlogs } from "../../lib/users";

type Props = {
  params: Promise<{ username: string }>;
};

export const dynamic = "force-dynamic";

export default async function UserPage({ params }: Props) {
  const { username } = await params;
  const user = await getUserWithBlogs(username);

  if (!user) {
    notFound();
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <p>username: {user.username}</p>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>
            <Link href={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
