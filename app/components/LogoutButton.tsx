"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded border border-stone-300 px-3 py-2 font-medium text-stone-700 transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-800"
    >
      logout
    </button>
  );
}
