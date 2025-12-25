import { memo, useCallback } from "react";

const navItems = [
  { id: "products", label: "HaiProducts" },
  { id: "dos", label: "HaiPODs" },
  { id: "leadership", label: "Leadership" },
  { id: "techstack", label: "Tech Stack" },
];

// Sun icon for light mode
const SunIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
      clipRule="evenodd"
    />
  </svg>
);

// Moon icon for dark mode
const MoonIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>
);

const Navbar = memo(
  ({
    isDarkMode,
    activeSection,
    isMobileMenuOpen,
    onToggleTheme,
    onToggleMobileMenu,
    onCloseMobileMenu,
    onScrollToSection,
  }) => {
    const handleNavClick = useCallback(
      (id) => {
        onScrollToSection(id);
        onCloseMobileMenu();
      },
      [onScrollToSection, onCloseMobileMenu]
    );

    return (
      <nav
        className={`fixed top-0 left-0 right-0 z-40 backdrop-blur-sm ${
          isDarkMode ? "bg-black/80" : "bg-white/90 shadow-sm"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-8 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div
              className="cursor-pointer"
              onClick={() => onScrollToSection("home")}
            >
              <img
                src="/logo.svg"
                alt="HaiIntel"
                width="70"
                height="60"
                className={`h-[55px] sm:h-[65px] w-auto ${
                  !isDarkMode ? "invert" : ""
                }`}
              />
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onScrollToSection(item.id)}
                  className={`text-base font-medium transition-colors ${
                    activeSection === item.id
                      ? isDarkMode
                        ? "text-white"
                        : "text-haiintel-blue"
                      : isDarkMode
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={onToggleTheme}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isDarkMode
                    ? "bg-haiintel-border hover:bg-haiintel-border/80 text-yellow-400"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
                aria-label="Toggle theme"
              >
                {isDarkMode ? <SunIcon /> : <MoonIcon />}
              </button>
              <button
                className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all ${
                  isDarkMode
                    ? "bg-white text-black hover:bg-gray-100"
                    : "bg-haiintel-dark text-white"
                }`}
              >
                Get Started
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={onToggleTheme}
                className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  isDarkMode
                    ? "bg-haiintel-border text-yellow-400"
                    : "bg-gray-200 text-gray-700"
                }`}
                aria-label="Toggle theme"
              >
                {isDarkMode ? <SunIcon /> : <MoonIcon />}
              </button>
              <button
                onClick={onToggleMobileMenu}
                className="w-10 h-10 flex flex-col items-center justify-center"
                aria-label="Toggle menu"
              >
                <span
                  className={`block w-6 h-0.5 mb-1.5 transition-transform ${
                    isDarkMode ? "bg-white" : "bg-gray-800"
                  } ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
                />
                <span
                  className={`block w-6 h-0.5 mb-1.5 transition-opacity ${
                    isDarkMode ? "bg-white" : "bg-gray-800"
                  } ${isMobileMenuOpen ? "opacity-0" : ""}`}
                />
                <span
                  className={`block w-6 h-0.5 transition-transform ${
                    isDarkMode ? "bg-white" : "bg-gray-800"
                  } ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-200 ${
            isMobileMenuOpen ? "max-h-96" : "max-h-0"
          } ${isDarkMode ? "bg-black/95" : "bg-white/95"}`}
        >
          <div className="container mx-auto px-4 py-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`block w-full text-left text-lg py-3 px-4 rounded-lg mb-1 ${
                  activeSection === item.id
                    ? isDarkMode
                      ? "text-haiintel-cyan bg-haiintel-cyan/10"
                      : "text-haiintel-blue bg-haiintel-blue/10"
                    : isDarkMode
                      ? "text-gray-300 hover:bg-haiintel-border/50"
                      : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              className={`w-full mt-4 py-3 rounded-lg font-medium ${
                isDarkMode
                  ? "bg-white text-black"
                  : "bg-haiintel-dark text-white"
              }`}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>
    );
  }
);

Navbar.displayName = "Navbar";

export default Navbar;
