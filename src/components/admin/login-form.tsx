"use client";

import { useActionState } from "react";
import { AlertCircle, Lock, LogIn } from "lucide-react";
import { login, type LoginState } from "@/app/admin/actions";

const initialState: LoginState = {};

const inputBase =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground " +
  "placeholder:text-muted-foreground/70 transition-colors focus-visible:outline-none " +
  "focus-visible:ring-2 focus-visible:ring-ring";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-5 rounded-2xl border border-border surface-card p-6 shadow-soft sm:p-8"
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-gold-ink shadow-gold">
          <Lock className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-xl font-bold">Admin sign in</h1>
          <p className="text-sm text-muted-foreground">
            Sign in with your Supabase admin account.
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          autoFocus
          className={inputBase}
          placeholder="admin@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputBase}
        />
      </div>

      {state.error ? (
        <p
          className="flex items-center gap-1.5 text-sm text-red-500"
          role="alert"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-gradient px-6 text-sm font-medium text-gold-ink shadow-gold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-gold-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
        <LogIn className="h-4 w-4" />
      </button>
    </form>
  );
}
