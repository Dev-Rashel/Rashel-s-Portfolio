const now = new Date();

export const defaultSettings = {
  key: "main",
  siteName: "Rashel Mahmud",
  logo: "",
  logoMark: "RM",
  favicon: "/favicon.svg",
  siteTitle: "Full-Stack Developer",
  siteDescription: "A cinematic portfolio and digital garden by Rashel Mahmud.",
  keywords: ["full-stack developer", "react", "next.js", "node.js", "portfolio", "bangladesh"],
  colors: {
    accent: "#b794f6",
    accentSoft: "#eadcff",
    background: "#0b0817",
    surface: "#151027",
    foreground: "#f4f0fc",
  },
  defaultTheme: "dark" as const,
  navItems: [
    { label: "Home", href: "/", order: 0, visible: true },
    { label: "About", href: "/#about", order: 1, visible: true },
    { label: "Skills", href: "/#skills", order: 2, visible: true },
    { label: "Projects", href: "/#projects", order: 3, visible: true },
    { label: "Experience", href: "/#experience", order: 4, visible: true },
    { label: "Activities", href: "/#activities", order: 5, visible: true },
    { label: "Journal", href: "/blog", order: 6, visible: true },
    { label: "Contact", href: "/#contact", order: 7, visible: true },
  ],
  sectionVisibility: {
    about: true,
    skills: true,
    projects: true,
    experience: true,
    activities: true,
    blog: true,
    contact: true,
  },
  sectionOrder: ["about", "skills", "projects", "experience", "activities", "blog", "contact"] as Array<
    "about" | "skills" | "projects" | "experience" | "activities" | "blog" | "contact"
  >,
  sectionCopy: {
    about: {
      eyebrow: "01 — The person",
      title: "Curiosity, compiled into craft.",
      description: "A developer with an editor’s eye and an engineer’s discipline.",
    },
    skills: {
      eyebrow: "02 — Capabilities",
      title: "A toolkit built for the whole stack.",
      description: "From data models to motion design — the tools I reach for.",
    },
    projects: {
      eyebrow: "03 — Selected work",
      title: "Work that rewards a closer look.",
      description: "A collection of products, experiments, and problems solved with care.",
    },
    experience: {
      eyebrow: "04 — Timeline",
      title: "The path, so far.",
      description: "Education, experience, and the milestones between.",
    },
    activities: {
      eyebrow: "05 — Beyond code",
      title: "A wider view of the work.",
      description: "Community, competitions, workshops, and the moments that shape a craft.",
    },
    blog: {
      eyebrow: "06 — Journal",
      title: "Notes from the build.",
      description: "Writing about code, process, and the learning in between.",
    },
    contact: {
      eyebrow: "07 — Next chapter",
      title: "Let’s make something worth remembering.",
      description: "Have a role, a product, or a good problem? I’d love to hear about it.",
    },
  },
  footer: {
    tagline: "Designed and engineered with intention.",
    copyright: "Rashel Mahmud",
    links: [
      { label: "GitHub", href: "https://github.com/" },
      { label: "LinkedIn", href: "https://linkedin.com/" },
    ],
    showSocials: true,
    bigText: "Let’s make something matter.",
  },
  contact: {
    email: "hello@rashelmahmud.dev",
    phone: "",
    address: "Dhaka, Bangladesh",
    mapUrl: "",
    formTitle: "Tell me about the idea.",
    formDescription: "A role, a product, a collaboration — my inbox is open. I usually reply within 48 hours.",
    successMessage: "Message received. I’ll be in touch soon.",
  },
  seo: {
    titleTemplate: "%s — Rashel Mahmud",
    defaultTitle: "Rashel Mahmud — Full-Stack Developer",
    defaultDescription:
      "The portfolio and digital garden of Rashel Mahmud, a junior full-stack developer building thoughtful web experiences.",
    ogImage: "",
    twitterHandle: "@rashelbuilds",
    robots: "index, follow",
    googleVerification: "",
  },
};

export const defaultProfile = {
  key: "main",
  fullName: "Rashel Mahmud",
  designation: "Junior Full-Stack Developer",
  tagline: "Engineering quiet details into bold digital experiences.",
  heroIntro:
    "A junior full-stack developer crafting thoughtful, high-performance products from the database to the last pixel.",
  shortBio:
    "I build accessible, expressive web experiences with modern JavaScript, careful architecture, and an obsession with the details.",
  aboutBio:
    "I am a full-stack developer at the beginning of a long, deliberate journey. I enjoy the space where clean engineering meets considered design — where a product feels as good as it works.\n\nMy work focuses on the MERN ecosystem, with a growing love for interaction design, motion, and the small details that turn a functional interface into a memorable one.",
  journey:
    "My journey began with curiosity about how the web works. That curiosity became late nights building interfaces, then APIs, then complete products. Today I am sharpening my craft through real projects, collaboration, and an appetite for problems worth solving.",
  goals:
    "To grow into an engineer who can own a product end-to-end — with the technical depth to build it, the design sensitivity to shape it, and the discipline to ship it well.",
  educationSummary:
    "Computer Science & Engineering — Diploma / ongoing studies. Add your education through the dashboard.",
  interests: ["Interface design", "Motion systems", "Open source", "Product thinking"],
  achievements: ["Dean’s recognition — placeholder achievement", "National coding challenge — finalist"],
  profileImage:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=85",
  heroImage:
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=85",
  aboutImage:
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85",
  signatureImage: "",
  location: "Dhaka, Bangladesh",
  email: "hello@rashelmahmud.dev",
  phone: "",
  availability: "Open for junior roles & freelance",
  available: true,
  resume: { url: "", publicId: "", fileName: "" },
  socials: [
    { platform: "github", label: "GitHub", url: "https://github.com/", icon: "github", order: 0, visible: true },
    { platform: "linkedin", label: "LinkedIn", url: "https://linkedin.com/", icon: "linkedin", order: 1, visible: true },
    { platform: "x", label: "X / Twitter", url: "https://x.com/", icon: "twitter", order: 2, visible: true },
  ],
  stats: [
    { value: "12", suffix: "+", label: "Projects built" },
    { value: "2", suffix: "+", label: "Years learning" },
    { value: "18", suffix: "", label: "Technologies" },
  ],
  ctas: {
    projects: { label: "View projects", url: "/#projects", enabled: true },
    contact: { label: "Start a conversation", url: "/#contact", enabled: true },
    resume: { label: "Download résumé", url: "", enabled: true },
  },
};

export const defaultSkills = [
  { name: "HTML5", category: "Frontend", level: 92, icon: "code", order: 0, enabled: true, image: "", description: "" },
  { name: "CSS3", category: "Frontend", level: 90, icon: "palette", order: 1, enabled: true, image: "", description: "" },
  { name: "JavaScript", category: "Frontend", level: 86, icon: "braces", order: 2, enabled: true, image: "", description: "" },
  { name: "TypeScript", category: "Frontend", level: 80, icon: "file-code", order: 3, enabled: true, image: "", description: "" },
  { name: "React", category: "Frontend", level: 86, icon: "atom", order: 4, enabled: true, image: "", description: "" },
  { name: "Next.js", category: "Frontend", level: 84, icon: "layers", order: 5, enabled: true, image: "", description: "" },
  { name: "Tailwind CSS", category: "Frontend", level: 90, icon: "wind", order: 6, enabled: true, image: "", description: "" },
  { name: "Bootstrap", category: "Frontend", level: 82, icon: "layout", order: 7, enabled: true, image: "", description: "" },
  { name: "Node.js", category: "Backend", level: 82, icon: "server", order: 8, enabled: true, image: "", description: "" },
  { name: "Express.js", category: "Backend", level: 80, icon: "route", order: 9, enabled: true, image: "", description: "" },
  { name: "REST API", category: "Backend", level: 84, icon: "network", order: 10, enabled: true, image: "", description: "" },
  { name: "MongoDB", category: "Database", level: 80, icon: "database", order: 11, enabled: true, image: "", description: "" },
  { name: "Mongoose", category: "Database", level: 78, icon: "table", order: 12, enabled: true, image: "", description: "" },
  { name: "Firebase", category: "Database", level: 70, icon: "flame", order: 13, enabled: true, image: "", description: "" },
  { name: "Git", category: "Tools", level: 86, icon: "git-branch", order: 14, enabled: true, image: "", description: "" },
  { name: "GitHub", category: "Tools", level: 88, icon: "github", order: 15, enabled: true, image: "", description: "" },
  { name: "VS Code", category: "Tools", level: 90, icon: "terminal", order: 16, enabled: true, image: "", description: "" },
  { name: "Postman", category: "Tools", level: 82, icon: "send", order: 17, enabled: true, image: "", description: "" },
  { name: "Vercel", category: "Tools", level: 84, icon: "triangle", order: 18, enabled: true, image: "", description: "" },
  { name: "Figma", category: "Tools", level: 76, icon: "pen-tool", order: 19, enabled: true, image: "", description: "" },
  { name: "Redux Toolkit", category: "Frontend", level: 76, icon: "layers", order: 20, enabled: true, image: "", description: "" },
  { name: "Zustand", category: "Frontend", level: 70, icon: "atom", order: 21, enabled: true, image: "", description: "" },
  { name: "Framer Motion", category: "Frontend", level: 80, icon: "wind", order: 22, enabled: true, image: "", description: "" },
  { name: "Socket.IO", category: "Backend", level: 68, icon: "network", order: 23, enabled: true, image: "", description: "" },
  { name: "Prisma", category: "Database", level: 78, icon: "database", order: 24, enabled: true, image: "", description: "" },
  { name: "PostgreSQL", category: "Database", level: 72, icon: "database", order: 25, enabled: true, image: "", description: "" },
  { name: "MySQL", category: "Database", level: 74, icon: "table", order: 26, enabled: true, image: "", description: "" },
  { name: "Docker", category: "Tools", level: 62, icon: "layers", order: 27, enabled: true, image: "", description: "" },
  { name: "Jest", category: "Tools", level: 65, icon: "terminal", order: 28, enabled: true, image: "", description: "" },
  { name: "AWS", category: "Tools", level: 58, icon: "server", order: 29, enabled: true, image: "", description: "" },
];

export const defaultProjects = [
  {
    title: "Atelier — Design System",
    slug: "atelier-design-system",
    summary:
      "A quietly expressive component library and documentation experience built for product teams that care about the details.",
    content:
      "<h2>The brief</h2><p>Atelier is a design system built around a simple belief: consistency should feel human. The system brings together accessible components, motion primitives, and living documentation in one considered workspace.</p><h2>The build</h2><p>Built with Next.js, TypeScript, and an extensive token layer. Every component is keyboard accessible, themeable, and documented with interactive examples.</p><p>The result is a system that teams actually enjoy using — precise enough for engineering, expressive enough for design.</p>",
    thumbnail: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1400&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1400&q=85",
    ],
    githubUrl: "https://github.com/",
    liveUrl: "https://example.com/",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    category: "Design Engineering",
    features: ["Accessible primitives", "Theme tokens", "Motion recipes", "Interactive docs"],
    challenges:
      "Balancing aesthetic flexibility with strict accessibility guarantees, and designing motion that could be tuned or disabled without breaking the experience.",
    role: "Design & Development",
    year: "2025",
    featured: true,
    order: 0,
    published: true,
    seoTitle: "",
    seoDescription: "",
  },
  {
    title: "Meridian — Analytics Studio",
    slug: "meridian-analytics-studio",
    summary:
      "A calm, high-signal analytics workspace that turns noisy operational data into decisions teams can act on.",
    content:
      "<h2>Clarity at speed</h2><p>Meridian is a full-stack analytics platform for small product teams. It brings events, funnels, and cohort analysis into an interface designed to reduce cognitive load.</p><h2>Under the hood</h2><p>A Node.js API with MongoDB aggregation pipelines powers fast, flexible queries. The frontend uses Next.js server components where possible, with carefully scoped client islands for interaction.</p>",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=85",
    ],
    githubUrl: "https://github.com/",
    liveUrl: "https://example.com/",
    techStack: ["React", "Node.js", "Express", "MongoDB", "Recharts"],
    category: "Full-Stack",
    features: ["Event explorer", "Cohort analysis", "Saved reports", "Team workspaces"],
    challenges:
      "Designing aggregation queries that stay fast as event volume grows, while keeping the reporting UI understandable for non-technical users.",
    role: "Full-Stack Developer",
    year: "2025",
    featured: true,
    order: 1,
    published: true,
    seoTitle: "",
    seoDescription: "",
  },
  {
    title: "Field Notes — Journal",
    slug: "field-notes-journal",
    summary:
      "An editorial publishing platform for a slow, considered corner of the internet — built for reading, not scrolling.",
    content:
      "<h2>An antidote to the feed</h2><p>Field Notes is a personal publishing platform with a strong editorial point of view. Large type, generous whitespace, and subtle motion create a reading experience that respects attention.</p><h2>Implementation</h2><p>Content is managed through a custom admin dashboard with rich text editing and Cloudinary image delivery. The public site is statically rendered with incremental updates for speed.</p>",
    thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=85",
    gallery: [],
    githubUrl: "https://github.com/",
    liveUrl: "https://example.com/",
    techStack: ["Next.js", "MongoDB", "TipTap", "Cloudinary"],
    category: "Content Platform",
    features: ["Rich text editor", "Tag system", "Reading mode", "Image library"],
    challenges:
      "Creating a CMS simple enough to use daily while still supporting structured content, SEO metadata, and a fluid editorial layout.",
    role: "Design & Development",
    year: "2024",
    featured: false,
    order: 2,
    published: true,
    seoTitle: "",
    seoDescription: "",
  },
  {
    title: "Kōdo — Habit Companion",
    slug: "kodo-habit-companion",
    summary:
      "A gentle, offline-first habit tracker that helps people build consistency without turning life into a scoreboard.",
    content:
      "<h2>Less pressure, more presence</h2><p>Kōdo explores a softer approach to habit tracking. Rather than streaks and leaderboards, the app focuses on small moments of progress and thoughtful reflection.</p><h2>Technical notes</h2><p>Built as a PWA with local-first storage and background sync. Motion is used sparingly to reinforce progress and create calm feedback.</p>",
    thumbnail: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1400&q=85",
    gallery: [],
    githubUrl: "https://github.com/",
    liveUrl: "https://example.com/",
    techStack: ["Next.js", "Firebase", "PWA", "Framer Motion"],
    category: "Product",
    features: ["Offline-first", "Gentle reminders", "Weekly reflections", "Installable PWA"],
    challenges:
      "Making an offline-first data model resilient enough to handle conflicts, while keeping the interface almost entirely out of the user's way.",
    role: "Product & Frontend",
    year: "2024",
    featured: false,
    order: 3,
    published: true,
    seoTitle: "",
    seoDescription: "",
  },
];

export const defaultPosts = [
  {
    title: "Building interfaces that feel inevitable",
    slug: "interfaces-that-feel-inevitable",
    excerpt:
      "The best interactions rarely announce themselves. Notes on designing motion, rhythm, and feedback that disappear into the experience.",
    content:
      "<p>There is a particular quality in interfaces that feel like they could not have been designed any other way. The spacing is right. The motion arrives at the right time. Nothing feels added.</p><h2>Start with rhythm, not animation</h2><p>Before choosing an easing curve, define the rhythm of the page. How quickly does content arrive? Where does the eye rest? Motion should support that cadence, not compete with it.</p><blockquote>Good animation does not make an interface impressive. It makes it understandable.</blockquote><h2>Feedback is a conversation</h2><p>Every interaction is a small exchange. A button press, a route change, a form result — each one should acknowledge the person on the other side of the screen.</p><p>When I build, I keep a short list of questions: What just happened? What should the user understand? What should they feel? The answers rarely require a large animation. They usually require a precise one.</p>",
    coverImage: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=1400&q=85",
    gallery: [],
    category: "Technical Blog",
    tags: ["Motion", "Design", "Frontend"],
    publishedAt: new Date("2025-08-14"),
    published: true,
    draft: false,
    featured: true,
    readingTime: 4,
    seoTitle: "",
    seoDescription: "",
    seoKeywords: [],
  },
  {
    title: "What building a CMS taught me about product thinking",
    slug: "what-building-a-cms-taught-me",
    excerpt:
      "An admin dashboard is a product with its own users. A few lessons from building tools that people actually want to use.",
    content:
      "<p>Building a content management system changes the way you think about software. The person using the dashboard is not an afterthought — they are the product's most important user.</p><h2>Reduce the distance between intention and action</h2><p>Every extra field, modal, or confirmation is a small tax. The best admin tools make the common path obvious and the uncommon path possible.</p><h2>Design for confidence</h2><p>People need to know what will happen when they press publish. Clear states, useful previews, and forgiving drafts are not polish. They are the product.</p><p>I now design every public feature alongside its administrative counterpart. If the editing experience is painful, the public experience will eventually show it.</p>",
    coverImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1400&q=85",
    gallery: [],
    category: "Learning Journey",
    tags: ["Product", "CMS", "Process"],
    publishedAt: new Date("2025-06-02"),
    published: true,
    draft: false,
    featured: false,
    readingTime: 3,
    seoTitle: "",
    seoDescription: "",
    seoKeywords: [],
  },
  {
    title: "The quiet discipline of shipping small",
    slug: "the-quiet-discipline-of-shipping-small",
    excerpt:
      "Learning to trade the dramatic rewrite for the small, compounding improvement — one honest release at a time.",
    content:
      "<p>There is a version of progress that feels cinematic: the rewrite, the redesign, the grand relaunch. There is another version that is quieter and, in my experience, more reliable.</p><h2>Small is a strategy</h2><p>Small releases reduce uncertainty. They create feedback loops. They make it easier to understand what actually changed and why.</p><p>As a junior developer, I used to wait until a project felt complete. Now I try to ask a better question: what is the smallest useful thing I can ship today?</p>",
    coverImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1400&q=85",
    gallery: [],
    category: "Personal Thoughts",
    tags: ["Craft", "Career", "Learning"],
    publishedAt: new Date("2025-03-21"),
    published: true,
    draft: false,
    featured: false,
    readingTime: 2,
    seoTitle: "",
    seoDescription: "",
    seoKeywords: [],
  },
];

export const defaultExperience = [
  {
    role: "Full-Stack Developer (Freelance)",
    company: "Independent",
    companyUrl: "",
    location: "Remote",
    type: "Freelance",
    startDate: "2024-01",
    endDate: "",
    current: true,
    description:
      "Designing and building end-to-end web products for small businesses and independent founders — from data modelling and API design to interface systems and deployment.",
    highlights: [
      "Shipped four production projects with Next.js, Node.js, and MongoDB",
      "Built reusable admin systems and content workflows",
      "Improved Lighthouse performance scores across client builds",
    ],
    logo: "",
    order: 0,
    visible: true,
  },
  {
    role: "Frontend Developer Intern",
    company: "Studio North (Placeholder)",
    companyUrl: "",
    location: "Dhaka, Bangladesh",
    type: "Internship",
    startDate: "2023-06",
    endDate: "2023-12",
    current: false,
    description:
      "Collaborated with a small product team to translate design systems into responsive, animated interfaces. Worked closely with senior engineers on component architecture and accessibility.",
    highlights: ["Built and documented 20+ reusable components", "Improved mobile responsiveness across the product"],
    logo: "",
    order: 1,
    visible: true,
  },
];

export const defaultEducation = [
  {
    institution: "Your Institute (Placeholder)",
    degree: "Diploma in Computer Science & Engineering",
    field: "Computer Science",
    location: "Bangladesh",
    startDate: "2022-01",
    endDate: "2026-01",
    current: true,
    grade: "",
    description:
      "Focused on software engineering fundamentals, databases, web technologies, and object-oriented programming. Active participant in programming clubs and technical events.",
    logo: "",
    order: 0,
    visible: true,
  },
  {
    institution: "Your School (Placeholder)",
    degree: "Secondary School Certificate",
    field: "Science",
    location: "Bangladesh",
    startDate: "2020-01",
    endDate: "2022-01",
    current: false,
    grade: "",
    description: "",
    logo: "",
    order: 1,
    visible: true,
  },
];

export const defaultCertifications = [
  {
    title: "Responsive Web Design",
    issuer: "freeCodeCamp",
    issueDate: "2024-04",
    expiryDate: "",
    credentialId: "",
    credentialUrl: "https://freecodecamp.org/",
    image: "",
    description: "Foundations of responsive layout, accessibility, and modern CSS.",
    skills: ["HTML", "CSS", "Accessibility"],
    featured: true,
    order: 0,
    visible: true,
  },
  {
    title: "JavaScript Algorithms & Data Structures",
    issuer: "freeCodeCamp",
    issueDate: "2024-08",
    expiryDate: "",
    credentialId: "",
    credentialUrl: "https://freecodecamp.org/",
    image: "",
    description: "Core JavaScript, algorithmic thinking, and data structures.",
    skills: ["JavaScript", "Problem Solving"],
    featured: false,
    order: 1,
    visible: true,
  },
];

export const defaultActivities = [
  {
    title: "National Programming Contest",
    category: "Competition",
    description:
      "Competed in a national-level programming contest, solving algorithmic problems under pressure with a small team.",
    content: "",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=85",
    gallery: [],
    date: "2025-02",
    location: "Dhaka, Bangladesh",
    externalUrl: "",
    organizer: "National University",
    featured: true,
    order: 0,
    visible: true,
  },
  {
    title: "Web Craft Workshop",
    category: "Workshop",
    description:
      "Facilitated a hands-on workshop on building modern interfaces with React and Tailwind, guiding juniors through their first component system.",
    content: "",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=85",
    gallery: [],
    date: "2024-11",
    location: "Campus Lab",
    externalUrl: "",
    organizer: "Programming Club",
    featured: false,
    order: 1,
    visible: true,
  },
  {
    title: "Open Source Contribution Day",
    category: "Community",
    description:
      "Joined a local open-source contribution sprint, improving documentation and fixing accessibility issues in community projects.",
    content: "",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=85",
    gallery: [],
    date: "2024-09",
    location: "Dhaka, Bangladesh",
    externalUrl: "",
    organizer: "Open Source Bangladesh",
    featured: false,
    order: 2,
    visible: true,
  },
];

export const defaultAchievements = [
  {
    title: "Programming Contest Finalist",
    description: "Reached the final round of a national-level programming competition.",
    date: "2025-02",
    category: "Competition",
    image: "",
    link: "",
    issuer: "National University",
    featured: true,
    order: 0,
    visible: true,
  },
  {
    title: "Best Project Presentation",
    description: "Recognised for clarity, craft, and technical depth in a departmental project showcase.",
    date: "2024-12",
    category: "Academic",
    image: "",
    link: "",
    issuer: "Department of CSE",
    featured: false,
    order: 1,
    visible: true,
  },
];

export const defaultCategories = [
  { name: "Technical Blog", slug: "technical-blog", type: "post", description: "Deep dives and practical notes.", color: "#b794f6", order: 0 },
  { name: "Learning Journey", slug: "learning-journey", type: "post", description: "Notes from the road.", color: "#8fb8ff", order: 1 },
  { name: "Full-Stack", slug: "full-stack", type: "project", description: "End-to-end product engineering.", color: "#b794f6", order: 2 },
  { name: "Design Engineering", slug: "design-engineering", type: "project", description: "Where design meets code.", color: "#f0a6ca", order: 3 },
  { name: "Product", slug: "product", type: "project", description: "Products with a point of view.", color: "#8fb8ff", order: 4 },
  { name: "Content Platform", slug: "content-platform", type: "project", description: "Publishing and editorial tools.", color: "#d9c4ff", order: 5 },
  { name: "Competition", slug: "competition", type: "activity", description: "Competitive programming and hackathons.", color: "#b794f6", order: 6 },
  { name: "Workshop", slug: "workshop", type: "activity", description: "Teaching and facilitation.", color: "#8fb8ff", order: 7 },
  { name: "Community", slug: "community", type: "activity", description: "Community and open source.", color: "#f0a6ca", order: 8 },
];

export const seededAt = now;
