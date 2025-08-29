import { StudyMockup } from "./StudyMockup";

export function HeroSection() {
  return (
    <section className="pt-16 pb-12 sm:pb-20 bg-gray-50 dark:bg-[#1E1E1E] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[85vh]">
          {/* Left column: Hero text and CTA */}
          <div className="space-y-6 sm:space-y-8 pt-4 sm:pt-8 text-center lg:text-left">
            {/* Main headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-gray-100 leading-tight font-jetbrains-mono">
              Study Smarter with AI
            </h1>

            {/* Subtext paragraph */}
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl font-jetbrains-mono">
              Transform your PDFs into interactive study materials. Get AI-powered summaries, generate quizzes, create flashcards, and chat with your documents for deeper understanding.
            </p>

            {/* Feature list */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <div className="flex items-center space-x-2 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-orange-800 dark:text-orange-200 font-jetbrains-mono">PDF Analysis</span>
              </div>
              <div className="flex items-center space-x-2 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-orange-800 dark:text-orange-200 font-jetbrains-mono">AI Chat</span>
              </div>
              <div className="flex items-center space-x-2 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-orange-800 dark:text-orange-200 font-jetbrains-mono">Quiz Generation</span>
              </div>
            </div>

            {/* CTA button */}
            <div className="pt-4 sm:pt-6">
              <a
                href="/account/signup"
                className="inline-block px-8 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 active:bg-orange-800 transition-colors font-jetbrains-mono"
              >
                Start Learning for Free
              </a>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-jetbrains-mono">
                No credit card required
              </p>
            </div>
          </div>

          {/* Right column: Study interface mockup */}
          <StudyMockup />
        </div>
      </div>
    </section>
  );
}