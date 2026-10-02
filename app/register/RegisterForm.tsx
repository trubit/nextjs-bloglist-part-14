"use client";

import { useActionState } from "react";
import { registerUser, type RegisterFormState } from "../actions/auth";

const initialState: RegisterFormState = {};

export default function RegisterForm() {
  const [state, action, pending] = useActionState(registerUser, initialState);

  return (
    <form action={action}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" autoComplete="name" required />
        {state.errors?.name && (
          <p role="alert" data-testid="name-error">
            {state.errors.name}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="username">Username</label>
        <input id="username" name="username" autoComplete="username" required />
        {state.errors?.username && (
          <p role="alert" data-testid="username-error">
            {state.errors.username}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
        />
        {state.errors?.password && (
          <p role="alert" data-testid="password-error">
            {state.errors.password}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="passwordConfirm">Confirm Password</label>
        <input
          id="passwordConfirm"
          name="passwordConfirm"
          type="password"
          autoComplete="new-password"
          required
        />
        {state.errors?.passwordConfirm && (
          <p role="alert" data-testid="passwordConfirm-error">
            {state.errors.passwordConfirm}
          </p>
        )}
      </div>
      <button type="submit" disabled={pending} data-testid="register-button">
        {pending ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
