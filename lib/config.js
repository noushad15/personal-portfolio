// ============================================
// 🎨 PORTFOLIO CONFIGURATION
// ============================================
// Manage all your site information from here!

export const siteConfig = {
  // Personal Information
  personal: {
    name: "Noushad Hossain",
    username: "noushad",
    tagline: "Lead Software Engineer & AI Innovator",
    title: "Lead Software Engineer, AI Innovator & Tech Community Builder",
    age: 28,
    birthDate: "21st February 1998",
    location: "Dhaka, Bangladesh (Open to relocation in Europe)",
    avatar: "/assets/techs/2.jpeg",
    email: "sourav1023@gmail.com",
    resumeUrl: "https://drive.google.com/file/d/1mHVFmrg7HbUHP18roUOotEZFa3AXcGQD/view?usp=sharing",
  },

  // About & Bio
  about: {
    intro: "Hi! I'm <strong>Noushad Hossain</strong>, a software engineer passionate about building data-driven systems, AI-powered applications, and scalable backend platforms.",
    
    description: `I'm currently leading the engineering team at <strong>Cogwheel Analytics</strong>, where we build analytics platforms and AI-driven solutions for hospitality and edTech industries. 
    With over 4 years of experience in backend development, data engineering, and AI integration, I specialize in designing scalable architectures, ETL pipelines, and automation systems.  
    My work blends engineering precision with creative problem-solving — from developing LLM-based analytics tools to mentoring engineers in technical excellence.  
    Beyond work, I actively contribute to tech communities, share insights on innovation, and explore AI applications that simplify data workflows and business intelligence.`,
    
    highlights: [
      "💼 Lead Engineer at Cogwheel Analytics (AI & Analytics Platform)",
      "🤖 Experienced in Data Engineering, ETL, and AI/LLM Integration",
      "🚀 5+ Years in Backend, APIs, and Cloud-based Solutions (AWS, GCP)",
      "📚 IEEE-Published Researcher in Robotics & Data Communication",
      "🌍 Open to relocation and collaboration opportunities in Europe"
    ]
  },

  // Experience
  experience: [
    {
      title: "Lead Engineer - Cogwheel Analytics",
      duration: "Apr 2025 – Present",
      description: "Leading the software engineering team to design and develop scalable AI-driven systems for data analytics. Providing architectural direction, mentoring developers, and building cloud-native pipelines and APIs that power real-time business intelligence across the hospitality industry.",
      icon: "🚀"
    },
    {
      title: "Senior Software Engineer - Cogwheel Analytics",
      duration: "Jul 2023 – Mar 2025",
      description: "Developed and optimized backend microservices using FastAPI and Python for KPI analytics and visualization platforms. Built data pipelines integrating multiple hospitality sources, and automated data cleaning and reporting workflows to enhance data reliability and scalability.",
      icon: "💻"
    },
    {
      title: "R&D Team Lead - Staff Asia",
      duration: "Jun 2022 – Jun 2023",
      description: "Managed a cross-functional team building edTech platforms and recommendation systems. Designed personalized learning algorithms, automated analytics via Google App Script, and improved internal operations with Django-based automation tools.",
      icon: "🧠"
    },
    {
      title: "Data Analyst & Developer (R&D) - Staff Asia",
      duration: "Nov 2020 – Jun 2022",
      description: "Created data analytics dashboards using Streamlit and Google Data Studio. Integrated Facebook, Bing, and Google Ads APIs for marketing automation and developed chatbots and recommendation systems using RASA and Python.",
      icon: "📊"
    }
  ],

  // Social Media
  social: {
    facebook: "https://www.facebook.com/noushad.hossain.886718",
    github: "https://github.com/noushad15",
    linkedin: "https://linkedin.com/in/noushadhossain"
  },

  // Skills & Technologies
  skills: {
    befe: [
      { name: "Python (FastAPI, Django)", level: 95, icon: "python.svg" },
      { name: "NextJS", level: 85, icon: "nextjs.svg" },
      { name: "ETL Pipelines", level: 90, icon: "data.svg" },
      { name: "PostgreSQL", level: 90, icon: "postgresql.svg" },
      { name: "MySQL", level: 85, icon: "mysql.svg" },
      { name: "Angular", level: 80, icon: "angular.svg" },
      { name: "HTML5", level: 95, icon: "html.svg" },
      { name: "CSS3", level: 90, icon: "css.svg" },
      { name: "JavaScript", level: 90, icon: "javascript.svg" },
      { name: "TypeScript", level: 80, icon: "typescript.svg" },
    ],

    aidata: [
      { name: "Business Intelligence", level: 90, icon: "bi.svg" },
      { name: "Machine Learning (Scikit-learn)", level: 85, icon: "ml.svg" },
      { name: "LLM", level: 95, icon: "llm.svg" },
      { name: "Promt Engineering", level: 95, icon: "promt.svg" },
      { name: "LangChain & OpenAI", level: 90, icon: "ai.svg" },
      { name: "Data Analytics (Pandas)", level: 95, icon: "pandas.svg" },
      { name: "Apache Airflow", level: 80, icon: "airflow.svg" },
      { name: "TensorFlow", level: 75, icon: "tensorflow.svg" },
      { name: "Data Visualization (Streamlit)", level: 85, icon: "streamlit.svg" },
      { name: "Automation Scripts", level: 95, icon: "automation.svg" },
    ],
    
    tools: [
      { name: "AWS", level: 85, icon: "aws.svg" },
      { name: "GCP", level: 80, icon: "gcp.svg" },
      { name: "Docker", level: 85, icon: "docker.svg" },
      { name: "GitHub", level: 90, icon: "github.svg" },
      { name: "Linux", level: 85, icon: "linux.svg" },
      { name: "VS Code", level: 90, icon: "vscode.svg" },
    ]
  },

  // Projects - Auto-fetched from GitHub
  githubUsername: "noushad15",

  // Goals
  goals: [
    "Build AI-integrated analytics tools that empower business insights",
    "Develop scalable data infrastructure for global industries",
    "Create open-source tools for AI and data automation",
    "Contribute to the European tech and AI ecosystem",
    "Mentor developers in building data-driven platforms",
    "Establish a community promoting innovation and learning"
  ],

  // SEO & Meta
  seo: {
    title: "Noushad Hossain | Lead Software Engineer & AI Innovator",
    description: "Lead Software Engineer specializing in AI, data engineering, and scalable backend systems. Building analytics platforms and mentoring teams at Cogwheel Analytics.",
    keywords: "noushad hossain, ai engineer, data engineer, software developer, fastapi, python, backend developer, analytics, etl pipelines, llm, cogwheel analytics, bangladesh engineer",
    ogImage: "/og-image.png",
    twitterHandle: "@noushad"
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



//
