import { FileText, MessageCircle, Brain } from "lucide-react";

export function StudyMockup() {
  return (
    <div className="relative lg:pl-8 flex justify-center lg:justify-end">
      <div className="bg-white dark:bg-[#262626] rounded-2xl shadow-2xl dark:shadow-none dark:ring-1 dark:ring-gray-700 p-6 sm:p-8 w-full max-w-sm">
        {/* Interface header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
            Document Analysis
          </h3>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>

        {/* Document info */}
        <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-3 mb-3">
            <FileText className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 font-jetbrains-mono">
              Biology Textbook Ch.5
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 font-jetbrains-mono">
            ✓ Summary generated<br/>
            ✓ 3 chapters identified<br/>
            ✓ Ready for questions
          </p>
        </div>

        {/* Feature buttons */}
        <div className="space-y-3 mb-6">
          <button className="w-full flex items-center space-x-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
            <MessageCircle className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 font-jetbrains-mono">
              Chat with Document
            </span>
          </button>
          
          <button className="w-full flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
            <Brain className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 font-jetbrains-mono">
              Generate Quiz
            </span>
          </button>
        </div>

        {/* Recent activity */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 font-jetbrains-mono uppercase tracking-wide">
            Recent Activity
          </p>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-300 font-jetbrains-mono">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Quiz completed: 8/10 correct</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-300 font-jetbrains-mono">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Flashcards created: 15 cards</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}