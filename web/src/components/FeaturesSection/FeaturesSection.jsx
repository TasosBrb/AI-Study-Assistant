import { Upload, FileText, MessageCircle, Brain, BarChart3, Download } from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Easy PDF Upload",
    description: "Simply drag and drop your study materials. We support all PDF formats and sizes."
  },
  {
    icon: FileText,
    title: "AI-Powered Summaries",
    description: "Get instant chapter breakdowns and key concept summaries from your documents."
  },
  {
    icon: MessageCircle,
    title: "Chat with Documents",
    description: "Ask questions about your study material and get instant, contextual answers."
  },
  {
    icon: Brain,
    title: "Smart Quiz Generation",
    description: "Automatically create multiple choice, true/false, and open-ended questions."
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description: "Monitor your learning progress with detailed analytics and performance insights."
  },
  {
    icon: Download,
    title: "Export & Print",
    description: "Download your flashcards and quizzes for offline study sessions."
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 sm:py-24 bg-white dark:bg-[#121212]">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        {/* Section header */}
        <div className="text-center mb-16 sm:mb-20">
          <span className="inline-block px-3 py-1 bg-orange-200 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-sm font-medium rounded-full mb-6 sm:mb-8 font-jetbrains-mono">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 font-jetbrains-mono">
            Everything you need to study effectively
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-jetbrains-mono">
            Transform any PDF into an interactive learning experience with our comprehensive suite of AI-powered study tools.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <feature.icon className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 font-jetbrains-mono">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-jetbrains-mono">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}