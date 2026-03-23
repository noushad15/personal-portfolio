// ============================================
// 🎨 PORTFOLIO CONFIGURATION
// ============================================
// Manage all your site information from here!

export const siteConfig = {
  // Personal Information
  personal: {
    name: "Noushad Hossain",
    username: "noushad",
    tagline: "Software Developer, Engineering Leader & AI Enthusiast",
    title: "Software Developer, Engineering Leader & AI Enthusiast",
    age: 28,
    birthDate: "21st February 1998",
    location: "Dhaka, Bangladesh",
    avatar: "https://ugc.production.linktr.ee/6RJk9s2pQZ2yAdcxw3Ir_TXX2dLlNmwM2OFdf?io=true&size=avatar-v3_0",
    email: "sourav1023@gmail.com",
    resumeUrl: "#",
  },

  // About & Bio
  about: {
    intro: "Hi! I'm <strong>Noushad Hossain</strong>, a Software Engineer and Data & AI specialist from Bangladesh. I focus on building scalable data-driven platforms, backend systems, and AI-powered solutions.",

description: `I graduated with a degree in Electrical and Electronic Engineering, along with a second major in Computer Science and Engineering. 
I currently work as a Lead Software Engineer, where I design and develop scalable data platforms, analytics systems, and AI-integrated solutions.

I have hands-on experience across backend development, cloud infrastructure, and data engineering, working with technologies such as Python, AWS, Kubernetes, and modern CI/CD pipelines. 
My work includes building ETL systems, automation pipelines, AI-driven analytics tools, and high-performance APIs used in production environments.

I have also been actively involved in research and innovation, with multiple IEEE publications in robotics, embedded systems, and intelligent systems. 
Previously, I led robotics initiatives and contributed to building technical communities and mentoring engineers.

I am passionate about solving real-world problems through data and software, continuously learning, and contributing to impactful, scalable systems.`,
    
   highlights: [
  "🚀 Lead Software Engineer (Data, AI & Cloud Systems)",
  "💻 Backend & Data Platform Specialist (Python, AWS, Kubernetes)",
  "🤖 AI & Automation Enthusiast (LLMs, ETL, Analytics)",
  "🌍 IEEE Published Researcher & Robotics Leader"
]
  },

  // Experience
 experience: [
  {
    title: "Cogwheel Analytics - Lead Software Engineer",
    duration: "2025 - Present",
    description: "Leading the engineering team to design and build scalable data platforms and AI-powered analytics systems. Driving architecture decisions, implementing cloud-native solutions (AWS, Kubernetes), and integrating AI/LLM-based capabilities into business intelligence tools.",
    icon: "🚀"
  },
  {
    title: "Cogwheel Analytics - Senior Software Engineer",
    duration: "2023 - 2025",
    description: "Led full-stack development of data analytics platforms for the hospitality industry. Built scalable backend systems (Python, PostgreSQL), optimized AWS infrastructure, and implemented CI/CD pipelines with Docker and Kubernetes.",
    icon: "💻"
  },
  {
    title: "Staff Asia LTD - Team Lead (R&D)",
    duration: "2022 - 2023",
    description: "Managed R&D team and built ETL pipelines, data scraping systems, and automation tools. Developed backend services using Django and optimized business processes with data-driven solutions.",
    icon: "📊"
  },
  {
    title: "Staff Asia LTD - Data Analyst",
    duration: "2020 - 2022",
    description: "Worked on data analysis, recommendation systems, chatbot development (RASA), and marketing analytics automation. Built dashboards, APIs, and data pipelines using Python and Google APIs.",
    icon: "📈"
  }
],

  // Social Media
  social: {
  linkedin: "https://linkedin.com/in/noushadhossain",
  github: "https://github.com/noushad15",
  website: "https://noushadhossain.com",
  email: "mailto:noushad33815@gmail.com"
},

  // Skills & Technologies
  skills: {
  frontend: [
    { name: "Angular", level: 85, icon: "angular.svg" },
    { name: "JavaScript", level: 90, icon: "javascript.svg" },
    { name: "TypeScript", level: 85, icon: "typescript.svg" },
    { name: "HTML5", level: 90, icon: "html.svg" },
    { name: "CSS3", level: 85, icon: "css.svg" }
  ],

  backend: [
    { name: "Python", level: 95, icon: "python.svg" },
    { name: "FastAPI / Django", level: 90, icon: "fastapi.svg" },
    { name: "PostgreSQL", level: 90, icon: "postgresql.svg" },
    { name: "REST APIs", level: 95, icon: "api.svg" },
    { name: "ETL Pipelines", level: 90, icon: "data.svg" }
  ],

  cloud: [
    { name: "AWS (EC2, S3, Lambda, EKS)", level: 90, icon: "aws.svg" },
    { name: "Kubernetes", level: 85, icon: "kubernetes.svg" },
    { name: "Docker", level: 90, icon: "docker.svg" },
    { name: "CI/CD (GitHub Actions)", level: 90, icon: "github.svg" }
  ],

  data_ai: [
    { name: "Pandas / Data Analysis", level: 90, icon: "pandas.svg" },
    { name: "Machine Learning", level: 80, icon: "ml.svg" },
    { name: "LLMs / AI Integration", level: 85, icon: "ai.svg" },
    { name: "Data Visualization", level: 85, icon: "chart.svg" }
  ],

  tools: [
    { name: "Git", level: 95, icon: "git.svg" },
    { name: "Linux", level: 90, icon: "linux.svg" },
    { name: "Azure AI", level: 80, icon: "azure.svg" },
    { name: "Google APIs", level: 85, icon: "google.svg" }
  ]
},

  // Projects - Auto-fetched from GitHub
  githubUsername: "noushad15",

  // Goals
  goals: [
  "Build scalable AI-driven data platforms used by global companies",
  "Establish expertise in cloud-native and distributed systems architecture",
  "Contribute to impactful AI and data engineering solutions",
  "Work and grow in Germany’s tech ecosystem",
  "Continuously improve in system design, performance, and scalability",
  "Mentor engineers and build high-performing engineering teams"
],

  // SEO & Meta
  seo: {
  title: "Noushad Hossain | Software Engineer | Data & AI Specialist",
  description: "Lead Software Engineer specializing in data platforms, AI systems, and cloud infrastructure. Experienced in Python, AWS, Kubernetes, and scalable analytics solutions.",
  keywords: "Noushad Hossain, software engineer, data engineer, AI engineer, python developer, AWS, Kubernetes, analytics, Germany jobs, backend engineer",
  ogImage: "/og-image.png"
}
};

// Theme Colors (For each theme)
export const themes = {
  dark: {
    name: "Dark",
    colors: {
      primary: "#3B82F6",
      secondary: "#8B5CF6",
      accent: "#06B6D4",
      background: "#0F172A",
      surface: "#1E293B",
      text: "#F1F5F9",
      textSecondary: "#94A3B8",
    },
    styles: {
      fontWeight: "normal",
      headingWeight: "700",
      shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
      glow: "0 0 20px rgba(59, 130, 246, 0.3)",
      cardBorder: "1px solid rgba(148, 163, 184, 0.1)",
    }
  },
  
  light: {
    name: "Light",
    colors: {
      primary: "#2563EB",
      secondary: "#7C3AED",
      accent: "#0891B2",
      background: "#F8FAFC",
      surface: "#FFFFFF",
      text: "#0F172A",
      textSecondary: "#64748B",
    },
    styles: {
      fontWeight: "normal",
      headingWeight: "600",
      shadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      glow: "0 0 15px rgba(37, 99, 235, 0.2)",
      cardBorder: "1px solid rgba(226, 232, 240, 1)",
    }
  },
  
  neon: {
    name: "Neon",
    colors: {
      primary: "#FF00FF",
      secondary: "#00FFFF",
      accent: "#FFFF00",
      background: "#000000",
      surface: "#0A0A0A",
      text: "#FFFFFF",
      textSecondary: "#B3B3B3",
    },
    styles: {
      fontWeight: "500",
      headingWeight: "800",
      shadow: "0 0 10px rgba(255, 0, 255, 0.5)",
      glow: "0 0 30px rgba(255, 0, 255, 0.6), 0 0 60px rgba(0, 255, 255, 0.4)",
      cardBorder: "2px solid rgba(255, 0, 255, 0.3)",
    }
  },

  sunset: {
    name: "Sunset",
    colors: {
      primary: "#F97316",
      secondary: "#EC4899",
      accent: "#FBBF24",
      background: "#18181B",
      surface: "#27272A",
      text: "#FAFAFA",
      textSecondary: "#A1A1AA",
    },
    styles: {
      fontWeight: "normal",
      headingWeight: "700",
      shadow: "0 10px 25px -5px rgba(249, 115, 22, 0.3)",
      glow: "0 0 25px rgba(249, 115, 22, 0.4)",
      cardBorder: "1px solid rgba(249, 115, 22, 0.2)",
    }
  },

  forest: {
    name: "Forest",
    colors: {
      primary: "#10B981",
      secondary: "#14B8A6",
      accent: "#84CC16",
      background: "#064E3B",
      surface: "#065F46",
      text: "#ECFDF5",
      textSecondary: "#6EE7B7",
    },
    styles: {
      fontWeight: "normal",
      headingWeight: "700",
      shadow: "0 4px 6px -1px rgba(16, 185, 129, 0.3)",
      glow: "0 0 20px rgba(16, 185, 129, 0.4)",
      cardBorder: "1px solid rgba(16, 185, 129, 0.2)",
    }
  }
};

export default siteConfig;



