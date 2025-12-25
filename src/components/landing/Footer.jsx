import { memo } from "react";
// import logoWhite from "../../assets/white-logo-nobg-1-bLeBMUHY.svg";

const footerLinks = {
  product: ["Features", "Integrations", "Pricing", "Changelog"],
  resources: ["Documentation", "API Reference", "Blog", "Community"],
  company: ["About Us", "Careers", "Contact", "Partners"],
};

const socialLinks = [
  { name: "Twitter", icon: "𝕏" },
  { name: "LinkedIn", icon: "in" },
  { name: "GitHub", icon: "⌘" },
];

const legalLinks = ["Privacy", "Terms", "Security"];

// Brand Column - Memoized
const BrandColumn = memo(({ isDarkMode }) => (
  <div className="col-span-2">
    <div className="flex items-center gap-2 mb-4">
      {/* <img
        src={logoWhite}
        alt="HaiIntel Logo"
        loading="lazy"
        decoding="async"
        width="48"
        height="48"
        className={`h-12 w-auto ${!isDarkMode ? "invert" : ""}`}
      /> */}
    </div>
    <p
      className={`mb-6 text-sm leading-relaxed ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}
    >
      AI-powered chat widget for modern businesses. Deliver exceptional customer
      experiences with intelligent conversations.
    </p>

    {/* Social Links - CSS hover */}
    <div className="flex gap-3">
      {socialLinks.map((social) => (
        <a
          key={social.name}
          href="#"
          aria-label={social.name}
          className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all duration-150 text-sm font-medium hover:scale-110 hover:-translate-y-0.5 ${
            isDarkMode
              ? "bg-haiintel-darker/80 border-haiintel-border text-gray-400 hover:text-white hover:border-haiintel-cyan hover:bg-haiintel-cyan/20"
              : "bg-white border-gray-200 text-gray-500 hover:text-haiintel-blue hover:border-haiintel-blue hover:bg-haiintel-blue/10"
          }`}
        >
          {social.icon}
        </a>
      ))}
    </div>
  </div>
));
BrandColumn.displayName = "BrandColumn";

// Link Column - Memoized
const LinkColumn = memo(({ title, links, isDarkMode }) => (
  <div>
    <h4
      className={`font-semibold mb-4 text-sm ${isDarkMode ? "text-haiintel-text" : "text-gray-900"}`}
    >
      {title}
    </h4>
    <ul className="space-y-3">
      {links.map((item) => (
        <li key={item}>
          <a
            href="#"
            className={`transition-colors duration-150 text-sm ${isDarkMode ? "text-gray-500 hover:text-haiintel-cyan" : "text-gray-600 hover:text-haiintel-blue"}`}
          >
            {item}
          </a>
        </li>
      ))}
    </ul>
  </div>
));
LinkColumn.displayName = "LinkColumn";

// Bottom Bar - Memoized
const BottomBar = memo(({ isDarkMode }) => (
  <div
    className={`pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 ${isDarkMode ? "border-haiintel-border/50" : "border-gray-200"}`}
  >
    <p className={`text-sm ${isDarkMode ? "text-gray-600" : "text-gray-500"}`}>
      © 2025 HaiIntel. All rights reserved.
    </p>
    <div className="flex items-center gap-6 text-sm">
      {legalLinks.map((link) => (
        <a
          key={link}
          href="#"
          className={`transition-colors duration-150 ${isDarkMode ? "text-gray-500 hover:text-haiintel-cyan" : "text-gray-600 hover:text-haiintel-blue"}`}
        >
          {link}
        </a>
      ))}
    </div>
  </div>
));
BottomBar.displayName = "BottomBar";

const Footer = memo(({ isDarkMode }) => (
  <footer
    className={`py-12 sm:py-16 px-4 sm:px-6 border-t transition-colors duration-200 ${isDarkMode ? "bg-black border-haiintel-border/50" : "bg-gray-50 border-gray-200"}`}
    style={{ contentVisibility: "auto", containIntrinsicSize: "0 400px" }}
  >
    <div className="container mx-auto max-w-6xl">
      {/* Main Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
        <BrandColumn isDarkMode={isDarkMode} />
        <LinkColumn
          title="Product"
          links={footerLinks.product}
          isDarkMode={isDarkMode}
        />
        <LinkColumn
          title="Resources"
          links={footerLinks.resources}
          isDarkMode={isDarkMode}
        />
        <LinkColumn
          title="Company"
          links={footerLinks.company}
          isDarkMode={isDarkMode}
        />
      </div>

      <BottomBar isDarkMode={isDarkMode} />
    </div>
  </footer>
));

Footer.displayName = "Footer";

export default Footer;
