import { memo } from "react";
import { motion } from "framer-motion";

const HeroSection = memo(({ onScrollToSection }) => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden"
    >
      {/* Background */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <img
          src="https://img.sanishtech.com/u/eeb2ea7052137150d3a8349e9e443d62.jpg"
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(46,144,250,0.08),transparent_70%)]" />
      </motion.div>

      {/* Content */}
      <div className="container mx-auto relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Main Headline - LCP target */}
          <motion.div
            className="mb-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-2 leading-tight">
              Intelligence.
            </h1>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-[#00d4ff]">
              Not Just Software.
            </h2>
          </motion.div>

          <motion.p
            className="text-base sm:text-lg md:text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            Haiintel partners with CIOs to embed human-rooted AI into enterprise
            transformation — accelerating outcomes through domain-aware,
            intelligence-first systems.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <motion.button
              onClick={() => onScrollToSection("dos")}
              className="px-8 py-4 bg-white text-black rounded-full font-semibold text-base hover:bg-gray-100 transition-all duration-150 shadow-lg flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Meet Haiintel HaiPODs
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </motion.button>
            <motion.button
              onClick={() => onScrollToSection("products")}
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-base hover:bg-white/10 transition-all duration-150"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore HaiProducts
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";

export default HeroSection;
