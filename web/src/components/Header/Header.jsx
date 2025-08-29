import { Menu, BookOpen, LogOut } from "lucide-react";
import { useState } from "react";
import useUser from "@/utils/useUser";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: user, loading } = useUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <BookOpen className="w-8 h-8 text-orange-600" />
          <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
            AI Study Assistant
          </div>
        </div>

        {/* Navigation menu - hidden on mobile, shown on larger screens */}
        <div className="hidden sm:flex items-center space-x-4 lg:space-x-8">
          <a 
            href="/"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors font-jetbrains-mono"
          >
            Home
          </a>
          <a 
            href="#features"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors font-jetbrains-mono"
          >
            Features
          </a>
          <a 
            href="#how-it-works"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors font-jetbrains-mono"
          >
            How It Works
          </a>
          
          {/* Auth buttons */}
          {loading ? (
            <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          ) : user ? (
            <div className="flex items-center space-x-4">
              <a
                href="/dashboard"
                className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors font-jetbrains-mono"
              >
                Dashboard
              </a>
              <a
                href="/account/logout"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <LogOut size={20} />
              </a>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <a
                href="/account/signin"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors font-jetbrains-mono"
              >
                Sign In
              </a>
              <a
                href="/account/signup"
                className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors font-jetbrains-mono"
              >
                Get Started
              </a>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button 
          className="sm:hidden p-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800">
          <div className="px-4 py-3 space-y-3">
            <a 
              href="/"
              className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors font-jetbrains-mono"
            >
              Home
            </a>
            <a 
              href="#features"
              className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors font-jetbrains-mono"
            >
              Features
            </a>
            <a 
              href="#how-it-works"
              className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors font-jetbrains-mono"
            >
              How It Works
            </a>
            
            {user ? (
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <a
                  href="/dashboard"
                  className="block px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors font-jetbrains-mono text-center"
                >
                  Dashboard
                </a>
                <a
                  href="/account/logout"
                  className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors font-jetbrains-mono"
                >
                  Sign Out
                </a>
              </div>
            ) : (
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <a
                  href="/account/signin"
                  className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors font-jetbrains-mono"
                >
                  Sign In
                </a>
                <a
                  href="/account/signup"
                  className="block px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors font-jetbrains-mono text-center"
                >
                  Get Started
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}