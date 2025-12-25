import { memo } from "react";
import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Create Account",
    description:
      "Sign up and configure your AI assistant with your brand voice and knowledge base",
    iconPath:
      "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
  },
  {
    step: "02",
    title: "Add to Website",
    description:
      "Copy and paste a single line of code into your website - works everywhere",
    iconPath: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
  },
  {
    step: "03",
    title: "Start Chatting",
    description: "Your AI assistant is live! Watch customer satisfaction soar",
    iconPath:
      "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
  },
];

// Step Card - Memoized
const StepCard = memo(({ item, isDarkMode, isLast }) => (
  <div className="relative text-center">
    <div className="relative inline-block mb-6">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-haiintel-blue to-haiintel-cyan flex items-center justify-center text-white mx-auto">
        <svg
          className="w-10 h-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d={item.iconPath}
          />
        </svg>
      </div>
      <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-haiintel-accent text-black text-sm font-bold flex items-center justify-center">
        {item.step}
      </span>
    </div>
    <h3
      className={`text-xl sm:text-2xl font-bold mb-4 ${
        isDarkMode ? "text-haiintel-text" : "text-gray-900"
      }`}
    >
      {item.title}
    </h3>
    <p
      className={`leading-relaxed ${
        isDarkMode ? "text-gray-400" : "text-gray-600"
      }`}
    >
      {item.description}
    </p>

    {/* Connector Line */}
    {!isLast && (
      <div
        className={`hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r ${
          isDarkMode ? "from-haiintel-cyan/50" : "from-haiintel-blue/30"
        } to-transparent`}
      />
    )}
  </div>
));
StepCard.displayName = "StepCard";

const HowItWorksSection = memo(({ isDarkMode }) => (
  <section
    id="dos"
    className={`py-20 sm:py-24 px-4 sm:px-6 relative overflow-hidden transition-colors duration-200 ${
      isDarkMode ? "bg-haiintel-dark" : "bg-white"
    }`}
    style={{ contentVisibility: "auto", containIntrinsicSize: "0 700px" }}
  >
    {/* Background */}
    <div
      className={`absolute inset-0 ${
        isDarkMode
          ? "bg-gradient-to-r from-haiintel-blue/5 to-haiintel-accent/5"
          : "bg-gradient-to-r from-blue-50 to-orange-50"
      }`}
    />

    <div className="container mx-auto max-w-6xl relative z-10">
      {/* Header */}
      <div className="text-center mb-12 sm:mb-16">
        <motion.span
          className={`text-sm font-semibold tracking-wider uppercase mb-4 block ${
            isDarkMode ? "text-haiintel-accent" : "text-orange-500"
          }`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Simple Setup
        </motion.span>
        <motion.h2
          className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-6 ${
            isDarkMode ? "text-haiintel-text" : "text-gray-900"
          }`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Get Started in Minutes
        </motion.h2>
        <motion.p
          className={`text-base sm:text-lg max-w-2xl mx-auto ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Three simple steps to transform your customer support
        </motion.p>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
          >
            <StepCard
              item={item}
              isDarkMode={isDarkMode}
              isLast={index === steps.length - 1}
            />
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-12 sm:mt-16">
        <motion.button
          className="px-10 py-4 bg-gradient-to-r from-haiintel-blue to-haiintel-cyan rounded-full text-white font-semibold text-lg shadow-intelligence hover:opacity-90 transition-all duration-150"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Free Trial
        </motion.button>
      </div>
    </div>
  </section>
));

HowItWorksSection.displayName = "HowItWorksSection";

export default HowItWorksSection;
