"use client";

import { useEffect, useActionState } from "react";
import { useRouter } from "next/navigation";
import { createBlog, type BlogFormState } from "../../actions/blogs";
import { useNotification } from "../../components/NotificationContext";

const initialState: BlogFormState = {};

export default function NewBlogForm() {
  const [state, action, pending] = useActionState(createBlog, initialState);
  const { showNotification } = useNotification();
  const router = useRouter();

  useEffect(() => {
    if (!state.notification) return;

    showNotification(state.notification.message, state.notification.type);
    if (state.notification.type === "success") router.push("/blogs");
  }, [router, showNotification, state.notification]);

  return (
    <form action={action} className="space-y-5">
      <div className="space-y-1.5">
        <label
          htmlFor="title"
          className="block text-sm font-semibold text-stone-800"
        >
          Title
        </label>
        <input
          id="title"
          name="title"
          minLength={5}
          defaultValue={state.values?.title}
          placeholder="A clear, specific title"
          className="w-full rounded border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none placeholder:text-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
          required
        />
        {state.errors?.title && (
          <p className="text-sm text-rose-700" role="alert">
            {state.errors.title}
          </p>
        )}
      </div>
      <div className="space-y-1.5">
        <label
          htmlFor="author"
          className="block text-sm font-semibold text-stone-800"
        >
          Author
        </label>
        <input
          id="author"
          name="author"
          minLength={5}
          defaultValue={state.values?.author}
          placeholder="Author or publication"
          className="w-full rounded border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none placeholder:text-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
          required
        />
        {state.errors?.author && (
          <p className="text-sm text-rose-700" role="alert">
            {state.errors.author}
          </p>
        )}
      </div>
      <div className="space-y-1.5">
        <label
          htmlFor="url"
          className="block text-sm font-semibold text-stone-800"
        >
          URL
        </label>
        <input
          id="url"
          name="url"
          type="url"
          minLength={5}
          defaultValue={state.values?.url}
          placeholder="https://example.com/article"
          className="w-full rounded border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none placeholder:text-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
          required
        />
        {state.errors?.url && (
          <p className="text-sm text-rose-700" role="alert">
            {state.errors.url}
          </p>
        )}
      </div>
      <button
        type="submit"
        data-testid="create-blog-button"
        disabled={pending}
        className="rounded bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-900 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
      >
        {pending ? "Adding blog..." : "Create"}
      </button>
    </form>
  );
}
