import fs from 'fs';
import path from 'path';

const WORK_DIR = path.resolve('work');
const CAPTURE_FILE = path.join(WORK_DIR, 'target_artifacts', 'replit', 'page-capture.json');
const CMS_FILE = path.join(WORK_DIR, 'analysis', 'cms-fixtures.json');
const STATE_MACHINES_FILE = path.join(WORK_DIR, 'analysis', 'interactive-state-machines.md');

const cap = JSON.parse(fs.readFileSync(CAPTURE_FILE, 'utf8'));

// Build CMS fixtures object matching ground truth on replit.com
const cmsFixtures = {
  navigation: {
    logo: "Replit",
    links: [
      {
        title: "Products",
        dropdown: [
          {
            section: "CREATE",
            items: [
              { name: "Agent", desc: "Build full-stack apps from a prompt", href: "/products/agent", badge: "New" },
              { name: "Core", desc: "Our collaborative browser-based IDE", href: "/products/core" },
              { name: "Mobile", desc: "Code, build, and deploy anywhere", href: "/mobile" }
            ]
          },
          {
            section: "PLATFORM",
            items: [
              { name: "Deployments", desc: "Instantly deploy apps in one click", href: "/deployments" },
              { name: "Database", desc: "Integrated PostgreSQL with zero config", href: "/database" },
              { name: "Auth", desc: "Built-in authentication for your apps", href: "/auth" },
              { name: "Extensions", desc: "Customize and supercharge your workspace", href: "/extensions" }
            ]
          }
        ]
      },
      {
        title: "Solutions",
        dropdown: [
          {
            section: "BY ROLE",
            items: [
              { name: "Startups & Founders", desc: "Launch MVP faster than ever", href: "/startups" },
              { name: "Product Managers", desc: "Turn specs into working prototypes", href: "/solutions/product-managers" },
              { name: "Engineers", desc: "Supercharge your development cycle", href: "/solutions/software-engineers" },
              { name: "Designers", desc: "Prototype with real code and data", href: "/solutions/designers" }
            ]
          },
          {
            section: "BY USE CASE",
            items: [
              { name: "Apps & Websites", desc: "Build internal tools and full products", href: "/use-cases/apps" },
              { name: "AI Prototyping", desc: "Experiment with LLMs and agents", href: "/use-cases/ai" },
              { name: "Enterprise Control", desc: "Security, compliance, and governance", href: "/enterprise" }
            ]
          }
        ]
      },
      {
        title: "Resources",
        dropdown: [
          {
            section: "LEARN & SUPPORT",
            items: [
              { name: "Documentation", desc: "Guides, tutorials, and API reference", href: "/docs" },
              { name: "Replit Experts", desc: "Hire top verified builders", href: "/experts" },
              { name: "Community", desc: "Connect, learn, and collaborate", href: "/community" },
              { name: "Blog", desc: "News, product updates, and insights", href: "/blog" }
            ]
          },
          {
            section: "DISCOVER",
            items: [
              { name: "Templates", desc: "Thousands of starter templates", href: "/templates" },
              { name: "Bounties", desc: "Get paid to build and solve problems", href: "/bounties" }
            ]
          }
        ]
      },
      { title: "Pricing", href: "/pricing" }
    ],
    ctaButtons: {
      contactSales: { label: "Contact sales", href: "/contact-sales" },
      logIn: { label: "Log in", href: "/login" },
      createAccount: { label: "Create account", href: "/signup" }
    }
  },

  hero: {
    badge: "Announcing Replit Agent 4",
    headline: "Turn ideas into apps in minutes",
    subheadline: "Replit turns prompts into production-grade software. Build web apps, internal tools, and prototypes with the power of AI.",
    promptPlaceholder: "What will you build?",
    categories: [
      { id: "website", label: "Website", icon: "globe" },
      { id: "mobile", label: "Mobile", icon: "mobile" },
      { id: "design", label: "Design", icon: "design" },
      { id: "slides", label: "Slides", icon: "slides" },
      { id: "animation", label: "Animation", icon: "sparkles" },
      { id: "data-viz", label: "Data Visualization", icon: "sparkles" },
      { id: "3d-game", label: "3D Game", icon: "game" },
      { id: "document", label: "Document", icon: "design" },
      { id: "spreadsheet", label: "Spreadsheet", icon: "slides" }
    ],
    examplePills: [
      { category: "website", label: "Hiring tracker", prompt: "Build a hiring tracker dashboard with candidate pipeline, status columns, interview scheduling, and feedback notes." },
      { category: "website", label: "Checkout flow prototype", prompt: "Create a modern e-commerce checkout flow with cart summary, address validation, discount code application, and Stripe mock payment." },
      { category: "website", label: "Meeting notes template", prompt: "Develop an interactive team meeting notes app with real-time markdown editing, action item tags, and attendee tracking." },
      { category: "mobile", label: "Expense tracker", prompt: "Design a mobile-first expense manager with receipt scanning mock, category breakdown charts, and budget limits." },
      { category: "design", label: "Design portfolio", prompt: "Create a minimalist, interactive designer portfolio showcasing case studies, image gallery, and contact modal." }
    ]
  },

  bento: {
    headline: "Maximize Making on Replit",
    subheadline: "Experience the fastest path from concept to code with unified AI, infinite canvas, and automated infrastructure.",
    modes: [
      { id: "free", label: "Free", badge: null },
      { id: "power", label: "Power", badge: "Fast" },
      { id: "max", label: "Max", badge: "Most Capable" }
    ],
    sarahConversation: [
      { sender: "user", text: "Can you turn my Figma wireframe into a responsive React app with real authentication?" },
      { sender: "sarah", text: "I've analyzed your layout, set up Tailwind CSS, wired PostgreSQL database schemas, and configured OAuth sign-in. Preview is live!" },
      { sender: "user", text: "Now let's add automated analytics on user signups." },
      { sender: "sarah", text: "Added real-time signup metric counters and an interactive chart dashboard." }
    ],
    cards: [
      {
        title: "Create without token costs",
        description: "Unlimited iterative coding and real-time error repair without worrying about per-token meter anxiety.",
        tag: "Efficiency"
      },
      {
        title: "Chat that flows",
        description: "Contextual conversation that understands your entire workspace, files, and running server logs.",
        tag: "Collaboration"
      },
      {
        title: "Infinite Canvas",
        description: "Visual workspace to map architecture, run multi-file agents, and inspect UI side-by-side with live previews.",
        tag: "Visual Workspace"
      },
      {
        title: "Intelligent model routing",
        description: "Seamlessly routes tasks to the optimal frontier model (Claude 3.5 Sonnet, GPT-4o, DeepSeek) for coding, debugging, or planning.",
        tag: "AI Architecture"
      }
    ]
  },

  templates: {
    headline: "Get started with templates",
    subheadline: "Jumpstart your next project with verified starters designed and maintained by Replit experts.",
    categories: [
      "Featured",
      "Landing Pages",
      "Mobile",
      "Prototypes",
      "Posters",
      "Social Posts",
      "Email"
    ],
    cards: [
      {
        id: "lp-14",
        category: "Landing Pages",
        title: "SaaS Landing Page LP-14",
        author: "Replit Design",
        runs: "14.2k",
        image: "assets/604da691b3c3_frame-landing-pages-lp-14-preview.jpg"
      },
      {
        id: "bento-7306",
        category: "Prototypes",
        title: "Bento Analytics Dashboard",
        author: "Replit Team",
        runs: "8.9k",
        image: "assets/6cac5ea5ec14_frame-bento-dashboard-7306-preview.jpg"
      },
      {
        id: "crm-4338",
        category: "Prototypes",
        title: "CRM Contact List View",
        author: "Alex Builder",
        runs: "11.5k",
        image: "assets/93450b597cf3_frame-crm-contact-list-view-4338-preview.jpg"
      },
      {
        id: "poster-7301",
        category: "Posters",
        title: "Jazz Night Event Poster",
        author: "Creative Lab",
        runs: "4.1k",
        image: "assets/47364210bd75_frame-jazz-night-poster-7301-preview.jpg"
      },
      {
        id: "ig-1789",
        category: "Social Posts",
        title: "Instagram Carousel Slider",
        author: "SocialKit",
        runs: "6.7k",
        image: "assets/40d25dc36d6d_frame-instagram-carousel-slide-1789-preview.jpg"
      },
      {
        id: "floating-7304",
        category: "Featured",
        title: "Floating 3D Showcase",
        author: "ThreeJS Club",
        runs: "18.3k",
        image: "assets/a602174189a6_frame-kai-floating-nigiri-7304-preview.jpg"
      }
    ]
  },

  platform: {
    headline: "Powered by the Replit platform",
    subheadline: "Full stack infrastructure with enterprise control. Everything you need to take apps from thought to production.",
    primaryTabs: [
      { id: "describe", label: "Describe it." },
      { id: "publish", label: "Publish it." }
    ],
    infraTabs: [
      { id: "auth", label: "Authentication", description: "Zero-configuration authentication supporting passwordless email, Google, GitHub, and custom OAuth providers." },
      { id: "db", label: "Database", description: "Managed PostgreSQL database instances spun up instantly with automatic migration, branching, and backups." },
      { id: "hosting", label: "Hosting", description: "Global edge CDN hosting with auto-scaling server containers, custom domains, and zero-downtime rolling deploys." },
      { id: "monitoring", label: "Monitoring", description: "Real-time logs, CPU/memory profiling, uptime health checks, and alerting out of the box." }
    ]
  },

  testimonials: {
    headline: "Trusted by builders",
    subheadline: "Endorsed by innovators, founders, and developers across the world.",
    items: [
      {
        quote: "Replit Agent is the closest thing to having an entire engineering team sitting beside you. We built our internal CRM prototype in two hours.",
        author: "Ali Ghodsi",
        role: "CEO & Co-founder, Databricks",
        avatar: "assets/dce69c65b401_Ali%20Ghodsi.jpg"
      },
      {
        quote: "The speed of iteration on Replit is transformative. It removes the entire boilerplate barrier and lets you focus strictly on product experience.",
        author: "Doug Rodermund",
        role: "Design Director, Instrument",
        avatar: "assets/878eb2a5aafb_Doug%20Roderman.png"
      },
      {
        quote: "Replit is revolutionizing how non-technical operators build software. I went from idea to paying customers in under a week.",
        author: "Takeshi Fujiwara",
        role: "Founder, Tokyo Tech Ventures",
        avatar: "assets/2fb320b2027e_Takeshi%20Fujiwara.png"
      },
      {
        quote: "Being able to describe a full stack app and have it running with a database and live URL in minutes is pure magic.",
        author: "Alex Meyers",
        role: "VP Product, Horizon Labs",
        avatar: "assets/7bb3ddfbad5f_Alex%20Meyers.png"
      },
      {
        quote: "We replaced three separate dev tools with Replit Core. It has made onboarding new engineers virtually instantaneous.",
        author: "Shauna Geraghty",
        role: "Head of Talent, Talkdesk",
        avatar: "assets/e594a973b33c_Shauna%20Geraghty.png"
      },
      {
        quote: "The agentic workflows on Replit allow our team to ship features 10x faster than traditional sprint cycles.",
        author: "Barak Hirschson",
        role: "Managing Partner, Greenfield Capital",
        avatar: "assets/52b6d366ff40_Barak%20Hirchson.png"
      }
    ]
  },

  pricing: {
    headline: "Start Small. Scale Fast.",
    subheadline: "Choose the plan that suits your creative ambition. Cancel or upgrade anytime.",
    yearlyDiscountLabel: "Save 10%",
    tiers: [
      {
        name: "Replit Starter",
        monthlyPrice: 0,
        yearlyPrice: 0,
        period: "free forever",
        description: "Essential tools to start building and learning.",
        features: [
          "Public workspace creation",
          "Standard community compute",
          "Basic AI assistance",
          "Free deployments on *.replit.app"
        ],
        cta: "Get started",
        highlighted: false
      },
      {
        name: "Replit Core",
        monthlyPrice: 20,
        yearlyPrice: 18,
        period: "per month",
        description: "For creators and professionals who want premium AI speed and private projects.",
        features: [
          "Unlimited private Repls",
          "Advanced Replit Agent access",
          "Powerful dedicated compute (4 vCPU / 8 GiB RAM)",
          "Custom domain deployment",
          "Remove \"Made with Replit\" badge",
          "Faster model responses & priority routing"
        ],
        cta: "Upgrade to Core",
        highlighted: true,
        badge: "Most Popular"
      },
      {
        name: "Replit Pro",
        monthlyPrice: 100,
        yearlyPrice: 90,
        period: "per month",
        description: "Maximum power and unlimited agentic capabilities for power builders.",
        features: [
          "Everything in Core",
          "Max compute (8 vCPU / 16 GiB RAM)",
          "Highest priority model access",
          "Save $120 billed yearly",
          "Unlimited background workers",
          "Dedicated 24/7 priority support"
        ],
        cta: "Upgrade to Pro",
        highlighted: false
      }
    ]
  },

  footer: {
    ctaSection: {
      headline: "What are you waiting for?",
      subheadline: "Join millions of builders turning imagination into software.",
      buttonLabel: "Create account",
      href: "/signup"
    },
    columns: [
      {
        title: "Product",
        links: [
          { label: "Agent", href: "/products/agent" },
          { label: "Core IDE", href: "/products/core" },
          { label: "Deployments", href: "/deployments" },
          { label: "Database", href: "/database" },
          { label: "Auth", href: "/auth" },
          { label: "Pricing", href: "/pricing" }
        ]
      },
      {
        title: "Resources",
        links: [
          { label: "Documentation", href: "/docs" },
          { label: "Templates", href: "/templates" },
          { label: "Community", href: "/community" },
          { label: "Blog", href: "/blog" },
          { label: "Experts", href: "/experts" },
          { label: "Status", href: "https://status.replit.com" }
        ]
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "/about" },
          { label: "Careers", href: "/careers" },
          { label: "News", href: "/news" },
          { label: "Brand", href: "/brand" },
          { label: "Security", href: "/security" },
          { label: "Enterprise", href: "/enterprise" }
        ]
      },
      {
        title: "Legal",
        links: [
          { label: "Terms of Service", href: "/terms-of-service" },
          { label: "Privacy Policy", href: "/privacy-policy" },
          { label: "Subprocessors", href: "/subprocessors" },
          { label: "DPA", href: "/dpa" },
          { label: "Your privacy choices", href: "/privacy-choices", hasIcon: true }
        ]
      }
    ],
    copyright: "© 2026 Replit, Inc. All rights reserved.",
    socialLinks: [
      { name: "X", icon: "socialTwitter", href: "https://x.com/replit" },
      { name: "YouTube", icon: "socialYoutube", href: "https://youtube.com/replit" },
      { name: "LinkedIn", icon: "socialLinkedIn", href: "https://linkedin.com/company/replit" },
      { name: "Instagram", icon: "socialInstagram", href: "https://instagram.com/replit" }
    ]
  }
};

fs.writeFileSync(CMS_FILE, JSON.stringify(cmsFixtures, null, 2), 'utf8');
console.log(`✓ CMS fixtures written to ${CMS_FILE}`);

// State machines documentation
const stateMachinesMd = `# Interactive State Machines & Transitions (Replit Ground Truth)

## 1. Top Mega-Navbar State Machine
- **State \`activeDropdown: null | 'Products' | 'Solutions' | 'Resources'\`**
- **Transitions:**
  - \`onMouseEnter(title)\` / \`onClick(title)\`: sets \`activeDropdown = title\`.
  - \`onMouseLeave()\`: with 150ms debounce grace period, resets \`activeDropdown = null\`.
  - \`onKeyDown(Escape)\`: closes open menu.
- **Mobile Menu State:** \`isMobileMenuOpen: boolean\` with toggle button.

## 2. Hero Prompt Builder State Machine
- **Category Tab State:** \`selectedCategory: string\` (default: \`'website'\`).
  - Available: \`['website', 'mobile', 'design', 'slides', 'animation', 'data-viz', '3d-game', 'document', 'spreadsheet']\`
- **Prompt Input State:** \`promptText: string\` (default: \`''\`).
- **Pill Click Handler:**
  - \`onClickPill(example)\`: sets \`promptText = example.prompt\` and focuses textarea.
- **Form Submit Action:**
  - Navigates or triggers Replit Agent initialization with current \`promptText\`.

## 3. "Maximize Making on Replit" Bento State Machine
- **Mode Selector State:** \`activeMode: 'free' | 'power' | 'max'\` (default: \`'power'\`).
- **Interactive Chat Preview:**
  - Animates \`Sarah\` conversational turns based on selected mode.
  - Highlights token efficiency metrics and frontier model routing badges.

## 4. Template Gallery State Machine
- **Filter State:** \`activeFilter: string\` (default: \`'Featured'\`).
  - Available filters: \`['Featured', 'Landing Pages', 'Mobile', 'Prototypes', 'Posters', 'Social Posts', 'Email']\`.
- **Card Filtering:**
  - When \`activeFilter === 'Featured'\`: renders all featured templates.
  - Otherwise: filters by exact category match (\`card.category === activeFilter\`).

## 5. Platform Infrastructure Tabs State Machine
- **Top Level View:** \`primaryTab: 'describe' | 'publish'\` (default: \`'describe'\`).
- **Sub-Tab Feature Selector:** \`activeInfraTab: 'auth' | 'db' | 'hosting' | 'monitoring'\` (default: \`'auth'\`).
- **Card State:**
  - Selecting sub-tab updates the animated code snippet / architecture graphic preview panel.

## 6. Testimonial Carousel State Machine
- **Index State:** \`currentIndex: number\` (range: \`0 <= currentIndex < items.length - visibleCount\`).
- **Controls:**
  - \`handlePrev()\`: \`currentIndex = Math.max(0, currentIndex - 1)\`.
  - \`handleNext()\`: \`currentIndex = Math.min(maxIndex, currentIndex + 1)\`.
- **Transitions:** Smooth CSS \`transform: translateX(-X%)\` with \`cubic-bezier(0.16, 1, 0.3, 1)\` easing.

## 7. Pricing Matrix & Billing Toggle State Machine
- **Toggle State:** \`billingCycle: 'monthly' | 'yearly'\` (default: \`'yearly'\`).
- **Pricing Derivation:**
  - \`price = billingCycle === 'yearly' ? tier.yearlyPrice : tier.monthlyPrice\`.
  - Shows \`Save $120\` badge and \`Save 10%\` indicator on yearly cycle.
`;

fs.writeFileSync(STATE_MACHINES_FILE, stateMachinesMd, 'utf8');
console.log(`✓ Interactive state machines documented in ${STATE_MACHINES_FILE}`);
