import { BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-[#0A0A0A] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="w-8 h-8 text-orange-600" />
              <div className="text-xl font-bold font-jetbrains-mono">
                AI Study Assistant
              </div>
            </div>
            <p className="text-gray-400 mb-4 font-jetbrains-mono">
              Transform your PDFs into interactive study materials with AI-powered summaries, quizzes, and chat functionality.
            </p>
            <p className="text-sm text-gray-500 font-jetbrains-mono">
              © 2025 AI Study Assistant. All rights reserved.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 font-jetbrains-mono">Product</h3>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-gray-400 hover:text-white transition-colors font-jetbrains-mono">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors font-jetbrains-mono">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/dashboard" className="text-gray-400 hover:text-white transition-colors font-jetbrains-mono">
                  Dashboard
                </a>
              </li>
            </ul>
          </div>

          {/* Account links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 font-jetbrains-mono">Account</h3>
            <ul className="space-y-2">
              <li>
                <a href="/account/signin" className="text-gray-400 hover:text-white transition-colors font-jetbrains-mono">
                  Sign In
                </a>
              </li>
              <li>
                <a href="/account/signup" className="text-gray-400 hover:text-white transition-colors font-jetbrains-mono">
                  Sign Up
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}