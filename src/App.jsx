import { useState, useEffect, lazy, Suspense, useCallback, memo } from "react";
import Navbar from "./components/landing/Navbar";
import HeroSection from "./components/landing/sections/HeroSection";
import { useInView } from "./hooks/useInView";

// Lazy load each section
const BannerSection = lazy(
  () => import("./components/landing/sections/BannerSection")
);
const FeaturesSection = lazy(
  () => import("./components/landing/sections/FeaturesSection")
);
const HowItWorksSection = lazy(
  () => import("./components/landing/sections/HowItWorksSection")
);
const UseCasesSection = lazy(
  () => import("./components/landing/sections/UseCasesSection")
);
const CTASection = lazy(
  () => import("./components/landing/sections/CTASection")
);
const Footer = lazy(() => import("./components/landing/Footer"));
const ChatWidget = lazy(() => import("./components/ChatWidget"));

// Lazy Section wrapper - only loads when in view
const LazySection = memo(({ Component, isDarkMode, ...props }) => {
  const [ref, isInView] = useInView({ rootMargin: "50px", threshold: 0 });
  const [hasLoaded, setHasLoaded] = useState(false);

  // Load once and keep loaded
  useEffect(() => {
    if (isInView && !hasLoaded) {
      setHasLoaded(true);
    }
  }, [isInView, hasLoaded]);

  return (
    <div ref={ref} style={{ minHeight: hasLoaded ? "auto" : "400px" }}>
      {hasLoaded ? (
        <Suspense fallback={null}>
          <Component isDarkMode={isDarkMode} {...props} />
        </Suspense>
      ) : null}
    </div>
  );
});
LazySection.displayName = "LazySection";

function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [shouldLoadChat, setShouldLoadChat] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("haiintel-theme");
      return saved ? saved === "dark" : true;
    }
    return true;
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDarkMode);
    localStorage.setItem("haiintel-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  // Load chat widget immediately - Framer Motion will handle the animation delay
  useEffect(() => {
    setShouldLoadChat(true);
  }, []);

  const toggleTheme = useCallback(() => setIsDarkMode((p) => !p), []);
  const toggleMobileMenu = useCallback(
    () => setIsMobileMenuOpen((p) => !p),
    []
  );
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);
  const scrollToSection = useCallback((id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      // Use instant scroll for better performance, add custom smooth scroll with RAF
      const targetPosition = element.offsetTop;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 600;
      let start = null;

      const animation = (currentTime) => {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);

        // Easing function for smooth animation
        const ease =
          progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        window.scrollTo(0, startPosition + distance * ease);

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      };

      requestAnimationFrame(animation);
    }
  }, []);

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-haiintel-dark" : "bg-gray-50"
      }`}
    >
      <Navbar
        isDarkMode={isDarkMode}
        activeSection={activeSection}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleTheme={toggleTheme}
        onToggleMobileMenu={toggleMobileMenu}
        onCloseMobileMenu={closeMobileMenu}
        onScrollToSection={scrollToSection}
      />

      {/* Critical: Hero loads immediately for LCP */}
      <HeroSection onScrollToSection={scrollToSection} />

      {/* Below fold: Only load when visible */}
      <LazySection Component={BannerSection} isDarkMode={isDarkMode} />
      <LazySection Component={FeaturesSection} isDarkMode={isDarkMode} />
      <LazySection Component={HowItWorksSection} isDarkMode={isDarkMode} />
      <LazySection Component={UseCasesSection} isDarkMode={isDarkMode} />
      <LazySection Component={CTASection} isDarkMode={isDarkMode} />
      <LazySection Component={Footer} isDarkMode={isDarkMode} />

      {/* Chat widget - delays until interaction */}
      {shouldLoadChat && (
        <Suspense fallback={null}>
          <ChatWidget isDarkMode={isDarkMode} />
        </Suspense>
      )}
    </div>
  );
}

export default memo(App);
