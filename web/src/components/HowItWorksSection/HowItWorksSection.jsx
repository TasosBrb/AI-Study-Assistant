import { Upload, Zap, MessageCircle, GraduationCap } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Your PDF",
    description: "Drag and drop any study material - textbooks, lecture notes, research papers, or handouts."
  },
  {
    icon: Zap,
    title: "AI Analysis",
    description: "Our AI instantly analyzes your document, creates summaries, and identifies key concepts and chapters."
  },
  {
    icon: MessageCircle,
    title: "Interactive Learning",
    description: "Chat with your document, generate custom quizzes, and create flashcards tailored to your needs."
  },
  {
    icon: GraduationCap,
    title: "Master the Material",
    description: "Track your progress, retake quizzes, and export materials for comprehensive learning."
  }
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-gray-50 dark:bg-[#1E1E1E]">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        {/* Section header */}
        <div className="text-center mb-16 sm:mb-20">
          <span className="inline-block px-3 py-1 bg-orange-200 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-sm font-medium rounded-full mb-6 sm:mb-8 font-jetbrains-mono">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 font-jetbrains-mono">
            From PDF to mastery in 4 simple steps
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-jetbrains-mono">
            Our streamlined process makes it easy to transform any document into an interactive learning experience.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              {/* Step number */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold font-jetbrains-mono">
                {index + 1}
              </div>
              
              {/* Icon */}
              <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-none dark:ring-1 dark:ring-gray-700 flex items-center justify-center mx-auto mb-6">
                <step.icon className="w-8 h-8 text-orange-600" />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 font-jetbrains-mono">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-jetbrains-mono">
                {step.description}
              </p>
              
              {/* Connector line (hidden on last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-200 dark:bg-gray-700 -translate-x-8"></div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16 sm:mt-20">
          <a
            href="/account/signup"
            className="inline-block px-8 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 active:bg-orange-800 transition-colors font-jetbrains-mono"
          >
            Try It Now - It's Free
          </a>
        </div>
      </div>
    </section>
  );
}