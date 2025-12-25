import { memo } from "react";
import { m } from "framer-motion";

const benefits = [
  "24/7 instant customer support without human agents",
  "Reduce support tickets by up to 70%",
  "Increase customer satisfaction scores",
  "Seamless handoff to human agents when needed",
];

// Chat Preview - Memoized
const ChatPreview = memo(({ isDarkMode }) => (
  <div className="relative">
    <div className="bg-haiintel-dark/50 rounded-3xl p-4 sm:p-6 border border-haiintel-border">
      <div className="bg-haiintel-darker rounded-2xl overflow-hidden shadow-xl border border-haiintel-border">
        {/* Mini chat header */}
        <div className="px-4 py-3 bg-haiintel-dark/80 border-b border-haiintel-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-haiintel-blue to-haiintel-accent flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <div>
            <p className="text-white text-sm font-medium">HaiIntel Assistant</p>
            <p className="text-gray-400 text-xs">Online</p>
          </div>
        </div>

        {/* Mini chat messages */}
        <div className="p-4 space-y-3">
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-full bg-haiintel-blue/20 flex-shrink-0" />
            <div className="bg-haiintel-dark px-3 py-2 rounded-xl rounded-tl-sm max-w-[80%]">
              <p className="text-white text-xs">
                Hi! How can I help you today?
              </p>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <div className="bg-haiintel-blue px-3 py-2 rounded-xl rounded-tr-sm max-w-[80%]">
              <p className="text-white text-xs">I need help with my order</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-full bg-haiintel-blue/20 flex-shrink-0" />
            <div className="bg-haiintel-dark px-3 py-2 rounded-xl rounded-tl-sm max-w-[80%]">
              <p className="text-white text-xs">
                I'd be happy to help! Could you please share your order number?
              </p>
            </div>
          </div>
        </div>

        {/* Mini input */}
        <div className="px-4 py-3 border-t border-haiintel-border">
          <div className="bg-haiintel-dark rounded-xl px-4 py-2">
            <span className="text-gray-500 text-xs">Type a message...</span>
          </div>
        </div>
      </div>
    </div>

    {/* Floating stats - CSS only */}
    <div
      className={`absolute -bottom-4 -left-4 rounded-xl shadow-xl p-4 border ${
        isDarkMode
          ? "bg-haiintel-dark border-haiintel-border"
          : "bg-white border-gray-200"
      }`}
    >
      <p
        className={`text-2xl font-bold ${
          isDarkMode ? "text-haiintel-cyan" : "text-haiintel-blue"
        }`}
      >
        98%
      </p>
      <p
        className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
      >
        Satisfaction Rate
      </p>
    </div>

    <div
      className={`absolute -top-4 -right-4 rounded-xl shadow-xl p-4 border ${
        isDarkMode
          ? "bg-haiintel-dark border-haiintel-border"
          : "bg-white border-gray-200"
      }`}
    >
      <p
        className={`text-2xl font-bold ${
          isDarkMode ? "text-haiintel-green" : "text-green-500"
        }`}
      >
        2.5s
      </p>
      <p
        className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
      >
        Avg Response
      </p>
    </div>
  </div>
));
ChatPreview.displayName = "ChatPreview";

// Benefit Item - Memoized
const BenefitItem = memo(({ item, isDarkMode }) => (
  <div className="flex items-center gap-3">
    <div
      className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
        isDarkMode ? "bg-haiintel-green/20" : "bg-green-100"
      }`}
    >
      <svg
        className={`w-4 h-4 ${
          isDarkMode ? "text-haiintel-green" : "text-green-600"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </div>
    <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
      {item}
    </span>
  </div>
));
BenefitItem.displayName = "BenefitItem";

const BannerSection = memo(({ isDarkMode }) => (
  <section
    className={`py-16 sm:py-20 px-4 sm:px-6 transition-colors duration-200 ${
      isDarkMode ? "bg-haiintel-darker" : "bg-white"
    }`}
    style={{ contentVisibility: "auto", containIntrinsicSize: "0 600px" }}
  >
    <div className="container mx-auto max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Content */}
        <m.div
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <m.span
            className={`text-sm font-semibold tracking-wider uppercase mb-4 block ${
              isDarkMode ? "text-haiintel-cyan" : "text-haiintel-blue"
            }`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Why Choose Us
          </m.span>
          <m.h2
            className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight ${
              isDarkMode ? "text-haiintel-text" : "text-gray-900"
            }`}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Conversations That{" "}
            <span
              className={
                isDarkMode ? "text-haiintel-cyan" : "text-haiintel-blue"
              }
            >
              Convert
            </span>
          </m.h2>
          <m.p
            className={`text-base sm:text-lg mb-8 leading-relaxed ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Our AI-powered chat widget understands context, remembers
            conversations, and delivers personalized responses that feel
            genuinely human.
          </m.p>

          {/* Benefits List */}
          <div className="space-y-4">
            {benefits.map((item, index) => (
              <m.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
              >
                <BenefitItem item={item} isDarkMode={isDarkMode} />
              </m.div>
            ))}
          </div>

          <m.button
            className="mt-8 px-8 py-4 bg-gradient-to-r from-haiintel-blue to-haiintel-cyan text-white rounded-full font-semibold hover:opacity-90 transition-all duration-150 shadow-intelligence"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try It Free
          </m.button>
        </m.div>

        {/* Right Content */}
        <m.div
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <ChatPreview isDarkMode={isDarkMode} />
        </m.div>
      </div>
    </div>
  </section>
));

BannerSection.displayName = "BannerSection";

export default BannerSection;
