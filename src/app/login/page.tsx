import LoginForm from "@/components/auth/LoginForm";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-dvh flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Image
            src="/icons/icon-192.png"
            alt="Habit Tracker"
            width={64}
            height={64}
            className="rounded-2xl mx-auto mb-2"
          />
          <h1 className="text-2xl font-bold text-gray-900">
            Habit <span style={{ color: "#635bff" }}>Tracker</span>
          </h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to your account</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <LoginForm />
        </div>
        <p className="mt-4 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
