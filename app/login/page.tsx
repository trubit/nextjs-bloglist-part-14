"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(formData: FormData) {
    setError("");
    setPending(true);
    const result = await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirect: false,
    });
    setPending(false);

    if (result?.error) {
      setError("Invalid username or password.");
      return;
    }

    const callbackUrl = searchParams.get("callbackUrl");
    const destination = callbackUrl
      ? new URL(callbackUrl, window.location.origin)
      : new URL("/", window.location.origin);
    sessionStorage.setItem("login-success", "true");
    window.location.assign(
      destination.origin === window.location.origin
        ? `${destination.pathname}${destination.search}${destination.hash}`
        : "/",
    );
  }

  return (
    <div>
      <h2>log in</h2>
      <form action={submit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            autoComplete="username"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
        {error && (
          <p role="alert" data-testid="error-message">
            {error}
          </p>
        )}
        <button type="submit" disabled={pending} data-testid="login-button">
          {pending ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
