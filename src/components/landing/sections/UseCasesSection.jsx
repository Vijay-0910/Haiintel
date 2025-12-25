import { memo } from "react";
import { m } from "framer-motion";

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

// Use Case Card - Memoized
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

const UseCasesSection = memo(({ isDarkMode }) => (
  <section
    id="leadership"
    className={`py-20 sm:py-24 px-4 sm:px-6 transition-colors duration-200 ${
      isDarkMode ? "bg-haiintel-darker" : "bg-gray-100"
    }`}
    style={{ contentVisibility: "auto", containIntrinsicSize: "0 600px" }}
  >
    <div className="container mx-auto max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12 sm:mb-16">
        <m.span
          className={`text-sm font-semibold tracking-wider uppercase mb-4 block ${
            isDarkMode ? "text-haiintel-green" : "text-green-600"
          }`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Use Cases
        </m.span>
        <m.h2
          className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-6 ${
            isDarkMode ? "text-haiintel-text" : "text-gray-900"
          }`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Built for Every Industry
        </m.h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {useCases.map((useCase, index) => (
          <m.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <UseCaseCard useCase={useCase} isDarkMode={isDarkMode} />
          </m.div>
        ))}
      </div>
    </div>
  </section>
));

UseCasesSection.displayName = "UseCasesSection";

export default UseCasesSection;
