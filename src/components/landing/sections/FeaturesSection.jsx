import { memo } from "react";
import { motion } from "framer-motion";

const features = [
  {
    iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
    title: "Instant Responses",
    description: "Lightning-fast AI responses that feel natural and human-like",
    color: "from-yellow-500 to-orange-500",
  },
  {
    iconPath: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    title: "Enterprise Security",
    description: "Bank-grade encryption and compliance with global standards",
    color: "from-green-500 to-emerald-500",
  },
  {
    iconPath: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z",
    title: "Rich Media Support",
    description: "Share images, charts, documents, and interactive content",
    color: "from-purple-500 to-pink-500",
  },
  {
    iconPath: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    title: "Multi-Language",
    description: "Communicate in 50+ languages with automatic translation",
    color: "from-blue-500 to-cyan-500",
  },
  {
    iconPath: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    title: "Analytics Dashboard",
    description: "Track conversations, sentiment, and customer insights",
    color: "from-red-500 to-rose-500",
  },
  {
    iconPath: "M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z",
    title: "Easy Integration",
    description: "One line of code to add to any website or application",
    color: "from-indigo-500 to-violet-500",
  },
];

// Feature Card - Memoized with CSS-only hover
const FeatureCard = memo(({ feature, isDarkMode }) => (
  <div
    className={`group p-6 backdrop-blur-sm border rounded-2xl transition-all duration-150 hover:-translate-y-1 hover:scale-[1.02] ${
      isDarkMode
        ? "bg-haiintel-dark/50 border-haiintel-border hover:border-haiintel-cyan/30"
        : "bg-white border-gray-200 hover:border-haiintel-blue/30 shadow-sm"
    }`}
  >
    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform duration-150`}>
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feature.iconPath} />
      </svg>
    </div>
    <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? "text-haiintel-text" : "text-gray-900"}`}>
      {feature.title}
    </h3>
    <p className={`text-sm leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
      {feature.description}
    </p>
  </div>
));
FeatureCard.displayName = "FeatureCard";

const FeaturesSection = memo(({ isDarkMode }) => (
  <section
    id="products"
    className={`py-20 sm:py-24 px-4 sm:px-6 transition-colors duration-200 ${isDarkMode ? "bg-haiintel-dark" : "bg-gray-100"}`}
    style={{ contentVisibility: "auto", containIntrinsicSize: "0 800px" }}
  >
    <div className="container mx-auto max-w-6xl">
      {/* Section Header */}
      <div className="text-center mb-12 sm:mb-16">
        <motion.span
          className={`text-sm font-semibold tracking-wider uppercase mb-4 block ${isDarkMode ? "text-haiintel-cyan" : "text-haiintel-blue"}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Powerful Features
        </motion.span>
        <motion.h2
          className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-6 ${isDarkMode ? "text-haiintel-text" : "text-gray-900"}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          AI-Powered Conversations
        </motion.h2>
        <motion.p
          className={`text-base sm:text-lg max-w-2xl mx-auto ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Transform customer interactions with intelligent, context-aware responses
        </motion.p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <FeatureCard feature={feature} isDarkMode={isDarkMode} />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
));

FeaturesSection.displayName = "FeaturesSection";

export default FeaturesSection;
