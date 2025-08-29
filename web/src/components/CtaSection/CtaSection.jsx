export function CtaSection() {
  return (
    <section className="py-16 sm:py-24 bg-orange-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 font-jetbrains-mono">
          Ready to revolutionize your studying?
        </h2>
        <p className="text-xl text-orange-100 mb-8 font-jetbrains-mono">
          Join thousands of students who are already learning smarter with AI Study Assistant.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="/account/signup"
            className="px-8 py-3 bg-white text-orange-600 rounded-lg font-medium hover:bg-gray-100 active:bg-gray-200 transition-colors font-jetbrains-mono"
          >
            Start Learning for Free
          </a>
          <p className="text-orange-100 text-sm font-jetbrains-mono">
            No credit card required • Free forever
          </p>
        </div>
      </div>
    </section>
  );
}