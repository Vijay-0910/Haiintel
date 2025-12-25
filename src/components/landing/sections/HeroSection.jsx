import { memo } from "react";
import { motion } from "framer-motion";

// Cloudinary with aggressive optimization
const heroImageMobile = "https://res.cloudinary.com/di9opoguc/image/upload/f_auto,q_auto:eco,w_640,c_limit/v1766678008/hero-intelligence-CXC1fGWY_eb8wfc.jpg";
const heroImageTablet = "https://res.cloudinary.com/di9opoguc/image/upload/f_auto,q_auto:eco,w_1024,c_limit/v1766678008/hero-intelligence-CXC1fGWY_eb8wfc.jpg";
const heroImageDesktop = "https://res.cloudinary.com/di9opoguc/image/upload/f_auto,q_auto:eco,w_1280,c_limit/v1766678008/hero-intelligence-CXC1fGWY_eb8wfc.jpg";
const heroImageFallback = "https://res.cloudinary.com/di9opoguc/image/upload/f_auto,q_auto:eco,w_1280/v1766678008/hero-intelligence-CXC1fGWY_eb8wfc.jpg";

const HeroSection = memo(({ onScrollToSection }) => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-16 sm:pt-20 px-4 sm:px-6 overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900"
    >
      {/* Background */}
      <motion.div
        className="absolute inset-0 z-0 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <img
          srcSet={`${heroImageMobile} 640w, ${heroImageTablet} 1024w, ${heroImageDesktop} 1280w`}
          sizes="100vw"
          src={heroImageFallback}
          alt="AI-powered enterprise intelligence background"
          className="absolute inset-0 w-full h-full object-cover"
          fetchPriority="high"
          decoding="async"
          width="1280"
          height="720"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(46,144,250,0.08),transparent_70%)]" />
      </motion.div>

      {/* Content */}
      <div className="container mx-auto relative z-10 px-2 sm:px-0">
        <div className="text-center max-w-5xl mx-auto">
          {/* Main Headline - LCP target */}
          <motion.div
            className="mb-4 sm:mb-6 md:mb-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <h1 className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-1 sm:mb-2 leading-tight">
              Intelligence.
            </h1>
            <h2 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight bg-gradient-to-r from-haiintel-cyan to-haiintel-accent bg-clip-text text-transparent">
              Not Just Software.
            </h2>
          </motion.div>

          <motion.p
            className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed px-2"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            style={{
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
            }}
          >
            Haiintel partners with CIOs to embed human-rooted AI into enterprise
            transformation — accelerating outcomes through domain-aware,
            intelligence-first systems.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 px-2"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <motion.button
              onClick={() => onScrollToSection("dos")}
              className="w-full sm:w-auto min-h-[44px] px-6 sm:px-8 py-3 sm:py-4 bg-white text-black rounded-full font-semibold text-sm sm:text-base hover:bg-gray-100 transition-all duration-150 shadow-lg flex items-center justify-center gap-2"
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
              className="w-full sm:w-auto min-h-[44px] px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-sm sm:text-base hover:bg-white/10 transition-all duration-150 shadow-lg"
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
