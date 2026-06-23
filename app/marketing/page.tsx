import Link from "next/link";

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-900 shadow-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            TodoSaaS
          </div>
          <div className="space-x-4">
            <Link
              href="/login"
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
            >
              Get Started
            </Link>
            <Link
              href="/admin"
              className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition text-sm"
            >
              Admin
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Organize Your Tasks
          <span className="block text-blue-600 dark:text-blue-400">
            Boost Your Productivity
          </span>
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          TodoSaaS is the simplest way to manage your daily tasks and stay organized. Create, track, and complete your todos with ease.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            href="/signup"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition transform hover:scale-105"
          >
            Start Free Today
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 rounded-lg font-semibold text-lg hover:bg-blue-50 dark:hover:bg-slate-800 transition"
          >
            Sign In
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8">
            <div className="text-4xl mb-4">✓</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Easy to Use
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Simple and intuitive interface to manage your tasks efficiently.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Secure
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your data is encrypted and securely stored with industry-leading security.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Fast & Responsive
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Lightning-fast performance with a responsive design for all devices.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-700 mt-20">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 TodoSaaS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
