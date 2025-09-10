import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-5xl font-bold mb-4 tracking-tight">
        Chat with Your Database
      </h1>
      <p className="text-gray-600 max-w-lg mb-8">
        Connect to PostgreSQL, MySQL, or SQLite and query them using natural
        language. Let AI handle the SQL for you.
      </p>
      <Link
        href="/db-connection"
        className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
      >
        Get Started
      </Link>
    </main>
  );
}