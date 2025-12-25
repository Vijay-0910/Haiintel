// HaiIntel Chat - Real Content from HaiIntel.com
// Hardcoded responses for the UI Developer Challenge

export const mockResponses = {
  // Welcome message
  welcome: {
    text: "Welcome to **HaiIntel**! 👋\n\nPart of *Vibrant Capital*, we build human-centered AI experiences that merge design, performance, and intelligence.\n\n**How can I help you today?**",
    suggestions: [
      "What is HaiIntel?",
      "What services do you offer?",
      "Tell me about Vibrant Capital",
      "Show me code examples",
      "What's your tech stack?",
      "Show me your projects",
    ],
  },

  // Code example response
  "show me code": {
    text: 'Here\'s an example of how to integrate our AI Chat Widget into your React application:\n\n```javascript\nimport { ChatWidget } from \'@haiintel/chat-widget\';\n\nfunction App() {\n  return (\n    <div className="app">\n      <ChatWidget\n        apiKey="your-api-key"\n        theme="dark"\n        position="bottom-right"\n      />\n    </div>\n  );\n}\n\nexport default App;\n```\n\n**Features:**\n- ✅ Easy integration\n- ✅ Customizable themes\n- ✅ Real-time responses\n- ✅ Markdown support\n\n**Installation:**\n\n```bash\nnpm install @haiintel/chat-widget\n```\n\nThat\'s it! The widget is ready to use.',
    suggestions: [
      "Can I customize the chat widget?",
      "How do I integrate this?",
      "What's your tech stack?",
      "Tell me about analytics features",
      "What services do you offer?",
      "Show me your projects",
    ],
  },

  // About HaiIntel
  "what is haiintel": {
    thinking:
      "The user is asking about HaiIntel. I should provide a comprehensive overview that highlights our core mission, our relationship with Vibrant Capital, and what makes us unique in the AI space. I'll focus on the human-centered approach and our design-first philosophy.",
    text: "HaiIntel is part of Vibrant Capital, building human-centered AI experiences that merge design, performance, and intelligence. We create AI solutions that are not just powerful, but also intuitive, beautiful, and purpose-built for real-world impact.",
    details: [
      {
        icon: "🎨",
        title: "Design-First Approach",
        description: "Beautiful, intuitive interfaces that users actually love",
      },
      {
        icon: "⚡",
        title: "High Performance",
        description: "Lightning-fast AI responses optimized for scale",
      },
      {
        icon: "🧠",
        title: "Intelligent by Default",
        description: "Advanced AI that understands context and intent",
      },
      {
        icon: "👥",
        title: "Human-Centered",
        description: "Technology that augments human capabilities",
      },
    ],
    suggestions: [
      "What services do you offer?",
      "Tell me about Vibrant Capital",
      "What's your tech stack?",
      "Show me your projects",
      "What are the open positions?",
      "How do I integrate this?",
    ],
  },

  // Services
  services: {
    thinking:
      "The user wants to know about our services. I should present our comprehensive service offerings in a clear, organized way that demonstrates our full-stack AI capabilities - from strategy to design to implementation.",
    text: "HaiIntel offers comprehensive AI development and design services:",
    list: [
      "Custom AI Application Development - Tailored solutions for your unique needs",
      "AI-Powered Web & Mobile Apps - Beautiful interfaces with intelligent backends",
      "Conversational AI & Chatbots - Natural language experiences that users love",
      "AI Integration Services - Seamlessly add AI to your existing products",
      "Design & UX for AI Products - Making AI feel natural and intuitive",
      "AI Strategy Consulting - Identify opportunities and create roadmaps",
    ],
    listOrdered: false,
    suggestions: [
      "What's your tech stack?",
      "Show me your projects",
      "Can I customize the chat widget?",
      "How do I integrate this?",
      "What are the open positions?",
      "Tell me about analytics features",
    ],
  },

  // Vibrant Capital
  "vibrant capital": {
    text: "HaiIntel is proudly part of Vibrant Capital, a venture studio that builds and invests in transformative technology companies. Together, we're creating the future of human-AI collaboration.",
    details: [
      {
        icon: "🚀",
        title: "Venture Studio Model",
        description:
          "We build companies from the ground up with dedicated resources",
      },
      {
        icon: "💡",
        title: "Innovation Focus",
        description:
          "Exploring cutting-edge AI, Web3, and emerging technologies",
      },
      {
        icon: "🤝",
        title: "Portfolio Support",
        description:
          "Shared resources, expertise, and network across all ventures",
      },
    ],
    suggestions: [
      "What is HaiIntel?",
      "What services do you offer?",
      "Show me your projects",
      "What's your tech stack?",
      "What are the open positions?",
      "How do I integrate this?",
    ],
  },

  // Tech Stack
  "tech stack": {
    text: "We leverage the latest AI and web technologies to build exceptional products:",
    details: [
      {
        icon: "🤖",
        title: "AI & ML",
        description: "OpenAI GPT-4, Claude, Anthropic, LangChain, Vector DBs",
      },
      {
        icon: "⚛️",
        title: "Frontend",
        description: "React, Next.js, Vite, Tailwind CSS, Framer Motion",
      },
      {
        icon: "🔧",
        title: "Backend",
        description: "Node.js, Python, FastAPI, MongoDB, PostgreSQL, Redis",
      },
      {
        icon: "☁️",
        title: "Cloud & DevOps",
        description: "Vercel, AWS, Docker, CI/CD, Serverless",
      },
    ],
    chart: {
      title: "Technology Expertise",
      labels: ["AI/ML", "Frontend", "Backend", "Design"],
      values: [95, 92, 90, 94],
    },
    suggestions: [
      "What frontend technologies do you use?",
      "What backend technologies do you support?",
      "What databases and cloud platforms do you use?",
      "Show me code examples",
      "How do I integrate this?",
      "What services do you offer?",
    ],
  },

  // Team & Culture
  team: {
    text: "We're looking for developers who can not only code and design but also leverage AI tools effectively to accelerate and enhance their workflow.",
    details: [
      {
        icon: "👨‍💻",
        title: "AI-Enhanced Development",
        description: "We use AI tools to code faster, smarter, and better",
      },
      {
        icon: "🎨",
        title: "Design + Engineering",
        description: "We value developers who understand both craft and code",
      },
      {
        icon: "🚀",
        title: "Fast-Paced Environment",
        description: "Ship quickly, iterate rapidly, learn constantly",
      },
      {
        icon: "🌟",
        title: "Innovation-Driven",
        description: "Always exploring new technologies and approaches",
      },
    ],
    suggestions: [
      "What are the open positions?",
      "Why work at HaiIntel?",
      "What's your tech stack?",
      "How do I apply?",
      "What's the interview process?",
      "Show me your projects",
    ],
  },

  // Careers
  careers: {
    text: "Join HaiIntel and help us build the future of human-centered AI experiences!",
    list: [
      "Full-Stack AI Developers - Build intelligent applications end-to-end",
      "Frontend Engineers - Create beautiful, performant user interfaces",
      "AI/ML Engineers - Develop and fine-tune AI models",
      "Product Designers - Design intuitive AI-powered experiences",
      "DevOps Engineers - Build scalable, reliable infrastructure",
      "AI Prompt Engineers - Craft exceptional AI interactions",
    ],
    listOrdered: false,
    stats: [
      { value: "Remote OK", label: "Work From Anywhere" },
      { value: "Competitive", label: "Salary + Equity" },
      { value: "Learning", label: "Budget & Time" },
    ],
    suggestions: [
      "Tell me about your team",
      "Why work at HaiIntel?",
      "How do I apply?",
      "What's the interview process?",
      "What are the open positions?",
      "What's your tech stack?",
    ],
  },

  // Projects
  projects: {
    text: "Some of the exciting AI projects we're building:",
    details: [
      {
        icon: "💬",
        title: "Intelligent Chat Widgets",
        description: "Beautiful, context-aware chat experiences for websites",
      },
      {
        icon: "📊",
        title: "AI Analytics Dashboards",
        description: "Real-time insights powered by machine learning",
      },
      {
        icon: "🎯",
        title: "Smart Recommendation Engines",
        description: "Personalized suggestions that users actually want",
      },
      {
        icon: "🔍",
        title: "AI-Powered Search",
        description: "Natural language search that understands intent",
      },
    ],
    suggestions: [
      "What's your tech stack?",
      "What services do you offer?",
      "Can I customize the chat widget?",
      "How do I integrate this?",
      "Show me code examples",
      "What are the open positions?",
    ],
  },

  // Contact
  contact: {
    text: "Let's build something amazing together! Here's how to reach us:",
    list: [
      "🌐 Website: www.haiintel.com",
      "💼 Parent Company: Vibrant Capital",
      "📍 Location: Remote-First (Global Team)",
      "📧 Careers: careers@haiintel.com",
      "🤝 Partnerships: hello@haiintel.com",
    ],
    listOrdered: false,
    suggestions: [
      "What are the open positions?",
      "What services do you offer?",
      "What's your tech stack?",
      "Show me your projects",
      "How do I integrate this?",
      "Tell me about Vibrant Capital",
    ],
  },

  // Benefits
  benefits: {
    text: "Why work at HaiIntel?",
    list: [
      "🌍 Remote-First Culture - Work from anywhere in the world",
      "💰 Competitive Compensation - Salary + equity in our ventures",
      "📚 Learning Budget - Books, courses, conferences covered",
      "🤖 AI Tools Access - Latest AI tools and technologies",
      "⏰ Flexible Hours - Focus on output, not hours",
      "🚀 Fast Growth - Wear many hats, learn quickly, advance fast",
      "🎯 Impact - Work on products used by thousands",
      "👥 Amazing Team - Work with brilliant, passionate people",
    ],
    listOrdered: false,
    suggestions: [
      "What are the open positions?",
      "Tell me about your team",
      "How do I apply?",
      "What's the application process?",
      "What's the interview process?",
      "What's your tech stack?",
    ],
  },

  // Apply
  apply: {
    text: "Ready to join HaiIntel? Here's how to apply:",
    list: [
      "1. Check our open positions at haiintel.com/careers",
      "2. Send your resume/portfolio to careers@haiintel.com",
      "3. Include a brief note about what excites you about AI",
      "4. Show us something you've built (GitHub, portfolio, etc.)",
      "5. We'll review and get back to you within 5 business days",
    ],
    listOrdered: true,
    stats: [
      { value: "5 days", label: "Response Time" },
      { value: "2-3 rounds", label: "Interview Process" },
      { value: "100%", label: "Remote OK" },
    ],
    suggestions: [
      "Why work at HaiIntel?",
      "What are the open positions?",
      "Tell me about your team",
      "What's the interview process?",
      "What's the application process?",
      "What's your tech stack?",
    ],
  },

  // Frontend Technologies
  "frontend technologies": {
    text: "Our frontend stack is built for performance and developer experience:",
    details: [
      {
        icon: "⚛️",
        title: "React 18+",
        description:
          "Modern React with hooks, Suspense, and concurrent features",
      },
      {
        icon: "🚀",
        title: "Next.js & Vite",
        description: "SSR with Next.js and lightning-fast builds with Vite",
      },
      {
        icon: "🎨",
        title: "Tailwind CSS",
        description: "Utility-first CSS for rapid UI development",
      },
      {
        icon: "✨",
        title: "Framer Motion",
        description: "Production-ready animations and interactions",
      },
    ],
    suggestions: [
      "What backend technologies do you support?",
      "What databases and cloud platforms do you use?",
      "Show me code examples",
      "What's your tech stack?",
      "How do I integrate this?",
      "What services do you offer?",
    ],
  },

  // Backend Technologies
  "backend technologies": {
    text: "Our backend infrastructure is scalable, secure, and developer-friendly:",
    details: [
      {
        icon: "🟢",
        title: "Node.js & Express",
        description: "Fast, scalable JavaScript runtime for APIs",
      },
      {
        icon: "🐍",
        title: "Python & FastAPI",
        description: "High-performance Python APIs for AI/ML workloads",
      },
      {
        icon: "🔌",
        title: "REST & GraphQL",
        description: "Flexible API architectures for any use case",
      },
      {
        icon: "🔐",
        title: "Authentication",
        description: "JWT, OAuth, and enterprise SSO support",
      },
    ],
    suggestions: [
      "What databases and cloud platforms do you use?",
      "What frontend technologies do you use?",
      "Show me code examples",
      "How do I integrate this?",
      "What's your tech stack?",
      "What services do you offer?",
    ],
  },

  // Database & Cloud
  "databases and cloud": {
    text: "We use modern cloud infrastructure and databases optimized for AI workloads:",
    details: [
      {
        icon: "🗄️",
        title: "MongoDB & PostgreSQL",
        description: "Flexible NoSQL and robust relational databases",
      },
      {
        icon: "⚡",
        title: "Redis & Caching",
        description: "In-memory data structures for lightning-fast performance",
      },
      {
        icon: "☁️",
        title: "AWS & Vercel",
        description: "Scalable cloud infrastructure with edge deployment",
      },
      {
        icon: "🔍",
        title: "Vector Databases",
        description: "Pinecone, Weaviate for AI embeddings and semantic search",
      },
    ],
    suggestions: [
      "What frontend technologies do you use?",
      "What backend technologies do you support?",
      "Show me code examples",
      "What's your tech stack?",
      "How do I integrate this?",
      "What services do you offer?",
    ],
  },

  // Interview Process
  "interview process": {
    text: "Our interview process is designed to be respectful of your time while giving us a good sense of your skills:",
    list: [
      "1. Initial Chat (30 min) - Get to know each other, discuss your background",
      "2. Technical Assessment (1-2 hours) - Build something real, showcase your skills",
      "3. Team Interview (45 min) - Meet potential teammates, deep dive on experience",
      "4. Final Discussion (30 min) - Talk compensation, expectations, questions",
    ],
    listOrdered: true,
    stats: [
      { value: "5 days", label: "Average Response" },
      { value: "2-3 rounds", label: "Interview Rounds" },
      { value: "1-2 weeks", label: "Total Process" },
    ],
    suggestions: [
      "How do I apply?",
      "Why work at HaiIntel?",
      "What are the open positions?",
      "Tell me about your team",
      "What's the application process?",
      "What's your tech stack?",
    ],
  },

  // Application Process
  "application process": {
    text: "Here's our simple, straightforward application process:",
    list: [
      "1. Visit haiintel.com/careers or email careers@haiintel.com",
      "2. Share your resume, portfolio, or GitHub profile",
      "3. Tell us what excites you about AI and HaiIntel",
      "4. Include links to projects you're proud of",
      "5. We'll review and respond within 5 business days",
    ],
    listOrdered: true,
    suggestions: [
      "What's the interview process?",
      "Why work at HaiIntel?",
      "What are the open positions?",
      "Tell me about your team",
      "How do I apply?",
      "What's your tech stack?",
    ],
  },

  // Analytics
  analytics: {
    thinking:
      "The user is asking about analytics. I should show them relevant data with a downloadable chart to demonstrate our analytics capabilities.",
    text: "Here's an overview of our chat widget analytics features. You can download the chart data by clicking the download button on the chart.",
    chart: {
      title: "Monthly User Engagement",
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      values: [1200, 1900, 2400, 2100, 2800, 3200],
    },
    stats: [
      { value: "3.2K", label: "Active Users" },
      { value: "85%", label: "Satisfaction" },
      { value: "2.4min", label: "Avg. Session" },
    ],
    suggestions: [
      "How do I set up analytics?",
      "Can I customize the chat widget?",
      "How do I integrate this?",
      "What other features are available?",
      "Show me code examples",
      "What's your tech stack?",
    ],
  },

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

// Intelligent response matcher
export const getResponse = (userMessage) => {
  const msg = userMessage.toLowerCase().trim();

  // Keyword mappings
  const keywords = {
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

    // Help
    help: "help",
    "what can you": "help",
  };

  // Find matching keyword
  for (const [keyword, responseKey] of Object.entries(keywords)) {
    if (msg.includes(keyword)) {
      return mockResponses[responseKey] || mockResponses.default;
    }
  }

  // Check for exact match
  if (mockResponses[msg]) {
    return mockResponses[msg];
  }

  // Default response
  return mockResponses.default;
};

// Export welcome message
export const getWelcomeMessage = () => mockResponses.welcome;
