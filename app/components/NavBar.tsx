import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth";
import LogoutButton from "./LogoutButton";

const NavBar = async () => {
  const session = await getServerSession(authOptions);
  return (
    <header className="border-b border-stone-200 bg-white">
      <nav className="mx-auto flex min-h-16 w-full max-w-5xl flex-wrap items-center gap-x-7 gap-y-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mr-2 text-lg font-bold tracking-wide text-emerald-900"
        >
          bloglist
        </Link>
        <div className="flex items-center gap-5 text-sm font-medium text-stone-600">
          <Link
            className="transition-colors hover:text-emerald-800"
            href="/blogs"
          >
            blogs
          </Link>
          <Link
            className="transition-colors hover:text-emerald-800"
            href="/users"
          >
            users
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-3 text-sm">
          {session?.user ? (
            <>
              <span className="max-w-36 truncate text-stone-600">
                {session.user.name}
              </span>
              <Link
                href="/me"
                className="rounded px-3 py-2 font-medium text-stone-700 transition-colors hover:bg-stone-100"
              >
                me
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded px-3 py-2 font-medium text-stone-700 transition-colors hover:bg-stone-100"
              >
                login
              </Link>
              <Link
                href="/register"
                className="rounded bg-emerald-800 px-3 py-2 font-semibold text-white transition-colors hover:bg-emerald-900"
              >
                register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
