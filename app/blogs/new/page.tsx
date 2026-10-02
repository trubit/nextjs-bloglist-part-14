import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth";
import Link from "next/link";
import NewBlogForm from "./NewBlogForm";

export default async function NewBlogPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=%2Fblogs%2Fnew");

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/blogs"
        className="text-sm font-semibold text-emerald-800 hover:text-emerald-950"
      >
        ← Back to blogs
      </Link>
      <div className="mb-7 mt-6 border-b border-stone-200 pb-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-emerald-800">
          Share something worth reading
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900">
          Add a blog
        </h1>
      </div>
      <NewBlogForm />
    </div>
  );
}
