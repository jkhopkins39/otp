import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import { LoginForm } from "@/components/admin/login-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await isAuthed()) redirect("/admin");

  return (
    <section className="container flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </section>
  );
}
