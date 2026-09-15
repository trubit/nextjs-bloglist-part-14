import Link from "next/link";
import { getUsers } from "../lib/users";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div>
      <h2>users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Link href={`/users/${user.username}`}>{user.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
