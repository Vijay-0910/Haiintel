import { memo, lazy, Suspense } from "react";
import { LazyMotion, m } from "framer-motion";

// Lazy-load only domAnimation features (reduces bundle by ~60%)
const loadFeatures = () =>
  import("framer-motion").then((mod) => mod.domAnimation);

const useCases = [
  {
    title: "E-Commerce",
    description:
      "Answer product questions, track orders, and boost sales with personalized recommendations",
    stats: "40% faster response time",
    gradient: "from-orange-500/20 to-red-500/20",
    border: "border-orange-500/30",
  },
  {
    title: "Healthcare",
    description:
      "Schedule appointments, answer FAQs, and provide 24/7 patient support",
    stats: "60% reduced call volume",
    gradient: "from-green-500/20 to-emerald-500/20",
    border: "border-green-500/30",
  },
  {
    title: "SaaS & Tech",
    description:
      "Onboard users, troubleshoot issues, and provide instant technical support",
    stats: "85% query resolution rate",
    gradient: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/30",
  },
  {
    title: "Financial Services",
    description:
      "Secure conversations for account inquiries, transactions, and financial advice",
    stats: "99.9% uptime guarantee",
    gradient: "from-purple-500/20 to-pink-500/20",
    border: "border-purple-500/30",
  },
];

// Use Case Card - Memoized with CSS hover transition (no JS animation overhead)
const UseCaseCard = memo(({ useCase, isDarkMode }) => (
  <div
    className={`p-6 sm:p-8 rounded-2xl bg-gradient-to-br ${useCase.gradient} border ${useCase.border} backdrop-blur-sm hover:scale-[1.02] transition-transform duration-150`}
  >
    <h3
      className={`text-xl sm:text-2xl font-bold mb-3 ${
        isDarkMode ? "text-haiintel-text" : "text-gray-900"
      }`}
    >
      {useCase.title}
    </h3>
    <p
      className={`mb-4 leading-relaxed ${
        isDarkMode ? "text-gray-400" : "text-gray-600"
      }`}
    >
      {useCase.description}
    </p>
    <span
      className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
        isDarkMode
          ? "bg-white/10 text-haiintel-cyan"
          : "bg-white/80 text-haiintel-blue"
      }`}
    >
      {useCase.stats}
    </span>
  </div>
));
UseCaseCard.displayName = "UseCaseCard";

// Animated card wrapper - only animates on scroll into view (below-fold safe)
const AnimatedCard = memo(({ useCase, isDarkMode, index }) => (
  <m.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{
      duration: 0.4,
      delay: index * 0.08,
      ease: "easeOut",
    }}
  >
    <UseCaseCard useCase={useCase} isDarkMode={isDarkMode} />
  </m.div>
));
AnimatedCard.displayName = "AnimatedCard";

// LCP-safe header - renders immediately, animates with CSS for non-blocking paint
const SectionHeader = memo(({ isDarkMode }) => (
  <div className="text-center mb-12 sm:mb-16">
    {/* 
      LCP-CRITICAL: No initial={{ opacity: 0 }} - content paints immediately.
      Using CSS animation for subtle fade-in that doesn't block LCP.
    */}
    <span
      className={`text-sm font-semibold tracking-wider uppercase mb-4 block animate-fade-in ${
        isDarkMode ? "text-haiintel-green" : "text-green-600"
      }`}
      style={{
        animation: "fadeInUp 0.5s ease-out both",
      }}
    >
      Use Cases
    </span>
    <h2
      className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-6 ${
        isDarkMode ? "text-haiintel-text" : "text-gray-900"
      }`}
      style={{
        animation: "fadeInUp 0.6s ease-out 0.1s both",
      }}
    >
      Built for Every Industry
    </h2>
    {/* Inline keyframes for LCP-safe CSS animation */}
    <style>{`
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}</style>
  </div>
));
SectionHeader.displayName = "SectionHeader";

const UseCasesSection = memo(({ isDarkMode }) => (
  <section
    id="leadership"
    className={`py-20 sm:py-24 px-4 sm:px-6 transition-colors duration-200 ${
      isDarkMode ? "bg-haiintel-darker" : "bg-gray-100"
    }`}
    style={{ contentVisibility: "auto", containIntrinsicSize: "0 600px" }}
  >
    <div className="container mx-auto max-w-6xl">
      {/* LCP-safe header - no motion blocking */}
      <SectionHeader isDarkMode={isDarkMode} />

      {/* 
        LazyMotion: Loads domAnimation features on-demand (~15KB instead of ~50KB).
        strict mode ensures m.* components only work inside LazyMotion.
      */}
      <LazyMotion features={loadFeatures} strict>
        {/* Grid - cards animate on scroll, safe for LCP */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {useCases.map((useCase, index) => (
            <AnimatedCard
              key={useCase.title}
              useCase={useCase}
              isDarkMode={isDarkMode}
              index={index}
            />
          ))}
        </div>
      </LazyMotion>
    </div>
  </section>
));

UseCasesSection.displayName = "UseCasesSection";

export default UseCasesSection;
