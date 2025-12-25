import { memo } from "react";
import { motion } from "framer-motion";

const badges = [
  "Free 14-day trial",
  "No credit card required",
  "Cancel anytime",
];

// Trust Badges - Memoized
const TrustBadges = memo(({ isDarkMode }) => (
  <div
    className={`flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm ${
      isDarkMode ? "text-gray-400" : "text-gray-600"
    }`}
  >
    {badges.map((badge, index) => (
      <span key={index} className="flex items-center gap-2">
        <svg
          className="w-5 h-5 text-green-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
        {badge}
      </span>
    ))}
  </div>
));
TrustBadges.displayName = "TrustBadges";

const CTASection = memo(({ isDarkMode }) => (
  <section
    id="techstack"
    className={`py-20 sm:py-24 px-4 sm:px-6 relative overflow-hidden transition-colors duration-200 ${
      isDarkMode ? "" : "bg-white"
    }`}
    style={{ contentVisibility: "auto", containIntrinsicSize: "0 500px" }}
  >
    {/* Background */}
    <div
      className={`absolute inset-0 ${
        isDarkMode
          ? "bg-gradient-to-b from-haiintel-darker via-haiintel-dark to-black"
          : "bg-gradient-to-b from-gray-50 via-white to-gray-100"
      }`}
    />

    <div className="container mx-auto max-w-4xl relative z-10">
      <motion.div
        className={`text-center p-8 sm:p-12 rounded-3xl border backdrop-blur-sm ${
          isDarkMode
            ? "bg-gradient-to-br from-haiintel-blue/20 to-haiintel-accent/20 border-haiintel-border"
            : "bg-gradient-to-br from-blue-50 to-orange-50 border-gray-200"
        }`}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <motion.h2
          className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-6 ${
            isDarkMode ? "text-haiintel-text" : "text-gray-900"
          }`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Ready to Transform Your Customer Experience?
        </motion.h2>
        <motion.p
          className={`text-lg sm:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Join thousands of businesses using HaiIntel to deliver exceptional
          support at scale
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 sm:mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.button
            className={`px-10 py-4 rounded-full font-semibold text-lg transition-all duration-150 ${
              isDarkMode
                ? "bg-white text-black hover:bg-gray-100"
                : "bg-haiintel-blue text-white hover:bg-haiintel-blue/90"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Free Trial
          </motion.button>
          <motion.button
            className={`px-10 py-4 bg-transparent border-2 rounded-full font-semibold text-lg transition-all duration-150 ${
              isDarkMode
                ? "border-haiintel-cyan text-haiintel-cyan hover:bg-haiintel-cyan/10"
                : "border-haiintel-blue text-haiintel-blue hover:bg-haiintel-blue/10"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Book a Demo
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <TrustBadges isDarkMode={isDarkMode} />
        </motion.div>
      </motion.div>
    </div>
  </section>
));

CTASection.displayName = "CTASection";

export default CTASection;
