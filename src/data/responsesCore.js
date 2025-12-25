// Core responses - always loaded (lightweight essentials only)
export const coreResponses = {
  // Default response
  default: {
    text: "I'm here to help you learn about HaiIntel! We're part of Vibrant Capital, building human-centered AI experiences. Ask me about our services, team, technology, or how to join us!",
    suggestions: [
      "What is HaiIntel?",
      "What services do you offer?",
      "What are the open positions?",
      "What's your tech stack?",
      "Show me code examples",
      "Tell me about Vibrant Capital",
    ],
  },

  // Help
  help: {
    text: "Here's what I can help you with:",
    list: [
      "Learn about HaiIntel and our mission",
      "Discover our AI development services",
      "Explore our technology stack",
      "Find out about career opportunities",
      "Learn about Vibrant Capital",
      "Get in touch with our team",
    ],
    listOrdered: false,
    suggestions: [
      "What is HaiIntel?",
      "What services do you offer?",
      "What are the open positions?",
      "What's your tech stack?",
      "Show me code examples",
      "Tell me about Vibrant Capital",
    ],
  },
};

// Keywords that map to core responses (loaded immediately)
export const coreKeywords = {
  help: "help",
  "what can you": "help",
};

// Keywords that require lazy-loaded responses
export const lazyKeywords = {
  // About HaiIntel
  haiintel: "what is haiintel",
  about: "what is haiintel",
  "who are you": "what is haiintel",
  company: "what is haiintel",

  // Services
  service: "services",
  offer: "services",
  "what do you do": "services",
  solutions: "services",

  // Vibrant Capital
  vibrant: "vibrant capital",
  capital: "vibrant capital",
  parent: "vibrant capital",

  // Tech Stack
  tech: "tech stack",
  technology: "tech stack",
  stack: "tech stack",
  tools: "tech stack",

  // Frontend
  frontend: "frontend technologies",
  react: "frontend technologies",
  "front-end": "frontend technologies",

  // Backend
  backend: "backend technologies",
  "back-end": "backend technologies",
  nodejs: "backend technologies",
  python: "backend technologies",
  api: "backend technologies",

  // Database & Cloud
  database: "databases and cloud",
  cloud: "databases and cloud",
  mongodb: "databases and cloud",
  postgresql: "databases and cloud",
  aws: "databases and cloud",

  // Team
  team: "team",
  culture: "team",
  people: "team",

  // Careers
  career: "careers",
  job: "careers",
  hire: "careers",
  hiring: "careers",
  work: "careers",
  position: "careers",

  // Projects
  project: "projects",
  portfolio: "projects",
  built: "projects",
  "what have you built": "projects",

  // Contact
  contact: "contact",
  email: "contact",
  reach: "contact",
  "get in touch": "contact",

  // Benefits
  benefit: "benefits",
  perk: "benefits",
  "why work": "benefits",
  "why join": "benefits",

  // Apply
  apply: "apply",
  "how to apply": "apply",
  join: "apply",

  // Interview
  interview: "interview process",
  "application process": "application process",

  // Analytics
  analytic: "analytics",
};

// Lazy load responses on demand
const responseCache = {};

export async function getResponseAsync(userMessage) {
  const msg = userMessage.toLowerCase().trim();

  // Check core keywords first (no lazy load)
  for (const [keyword, responseKey] of Object.entries(coreKeywords)) {
    if (msg.includes(keyword)) {
      return coreResponses[responseKey] || coreResponses.default;
    }
  }

  // Check if lazy loading is needed
  for (const [keyword, responseKey] of Object.entries(lazyKeywords)) {
    if (msg.includes(keyword)) {
      // Check cache first
      if (responseCache[responseKey]) {
        return responseCache[responseKey];
      }

      // Lazy load the response
      try {
        const module = await import("./responsesExtended.js");
        const response = module.extendedResponses[responseKey];
        if (response) {
          responseCache[responseKey] = response;
          return response;
        }
      } catch (error) {
        console.error("Failed to load response:", error);
      }
    }
  }

  // Check if exact match exists in extended responses
  if (!responseCache[msg]) {
    try {
      const module = await import("./responsesExtended.js");
      if (module.extendedResponses[msg]) {
        responseCache[msg] = module.extendedResponses[msg];
        return responseCache[msg];
      }
    } catch (error) {
      console.error("Failed to load response:", error);
    }
  } else if (responseCache[msg]) {
    return responseCache[msg];
  }

  // Default response
  return coreResponses.default;
}
