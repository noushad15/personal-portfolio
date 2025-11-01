# 🌟 Noushad Hossain - Portfolio Website

> **Lead Software Engineer & AI Innovator** - Modern portfolio website showcasing expertise in AI, data engineering, and scalable backend systems.

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2-61dafb?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38b2ac?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-0.159-000000?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-10.16-ff69b4?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

## 🚀 Live Demo

🌐 **[View Live Website](https://noushadhossain.com)**

## 📋 About

This is a modern, responsive portfolio website built for **Noushad Hossain**, a Lead Software Engineer specializing in AI-driven analytics platforms, data engineering, and scalable backend systems. The portfolio showcases professional experience, technical skills, and GitHub projects with dynamic content fetching.

### 👨‍💻 About Noushad

- **🏢 Current Role:** Lead Engineer at Cogwheel Analytics
- **🎯 Specialization:** AI & Data Automation, Backend Development, ETL Pipelines
- **🌍 Location:** Dhaka, Bangladesh (Open to relocation in Germany)
- **🎓 Background:** 4+ Years in Backend, APIs, and Cloud Solutions
- **📚 Research:** IEEE-Published Researcher in Robotics & Data Communication

## ✨ Features

### 🎨 **Design & UI/UX**
- **🌓 Multi-Theme Support** - Dark, Light, Neon, Sunset, Forest themes
- **📱 Fully Responsive** - Mobile-first design with smooth animations
- **🎯 Modern UI** - Clean, professional design with gradient effects
- **⚡ Smooth Animations** - Framer Motion powered transitions

### 🚀 **Technical Features**
- **🔗 GitHub Integration** - Auto-fetches repositories from GitHub API
- **🎪 3D Animations** - Interactive Three.js components and particle effects
- **📊 Dynamic Content** - Real-time project data and statistics
- **🎭 Interactive Elements** - Hover effects, modals, and smooth scrolling

### 📄 **Content Sections**
- **🏠 Hero Section** - Interactive introduction with animated elements
- **👤 About Section** - Professional background and highlights
- **💼 Experience Timeline** - Career progression and achievements
- **🛠️ Skills Showcase** - Technical expertise with proficiency levels
  - Backend Development (Python, FastAPI, Node.js)
  - Frontend Technologies (Vue.js, Angular, React)
  - AI & Data Automation (ML, LangChain, Analytics)
  - Tools & Platforms (AWS, GCP, Docker)
- **💻 Projects Portfolio** - GitHub repositories with live stats
- **📞 Contact Information** - Professional contact details and social links

## 🛠️ Tech Stack

### **Frontend Framework**
- **Next.js 14** - React framework with SSR and API routes
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development

### **Styling & Design**
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready motion library
- **React Icons** - Comprehensive icon library

### **3D & Animations**
- **Three.js** - 3D graphics library
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for react-three-fiber
- **React Particles** - Interactive particle backgrounds

### **Data & API**
- **GitHub REST API** - Dynamic project fetching
- **SWR** - Data fetching with caching
- **Custom API Routes** - Next.js API integration

### **Development Tools**
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🚦 Getting Started

### Prerequisites

- **Node.js 22.x** or higher
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/umutxyp/Personal-Website.git
   cd Personal-Website
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables** (optional)
   ```bash
   cp .env.example .env.local
   ```
   Add your GitHub token for higher API rate limits:
   ```env
   GITHUB_TOKEN=your_github_token_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── components/           # React components
│   ├── ContactSection.js    # Contact information
│   ├── ExperienceSection.js # Career timeline
│   ├── HeroSection.js       # Landing page hero
│   ├── NewHeader.js         # Navigation header
│   ├── ProjectsSection.js   # GitHub projects
│   ├── SkillsSection.js     # Technical skills
│   ├── ThemeSwitcher.js     # Theme toggle
│   └── 3d/                  # 3D components
│       ├── AnimatedSphere.js
│       ├── ParticleField.js
│       └── Scene3D.js
├── contexts/            # React contexts
│   └── ThemeContext.js      # Theme management
├── lib/                 # Utilities and config
│   └── config.js            # Site configuration
├── pages/               # Next.js pages
│   ├── _app.jsx             # App wrapper
│   ├── _document.jsx        # HTML document
│   ├── index.jsx            # Home page
│   ├── projects.jsx         # Projects page
│   ├── contact.jsx          # Contact page
│   └── api/                 # API routes
│       └── github-repos.js  # GitHub integration
├── public/              # Static assets
│   └── assets/              # Images and icons
├── styles/              # CSS styles
│   └── globals.css          # Global styles
├── next.config.js       # Next.js configuration
├── tailwind.config.js   # Tailwind CSS config
└── package.json         # Dependencies and scripts
```

## ⚙️ Configuration

### Site Configuration

All site content is managed through `lib/config.js`:

```javascript
export const siteConfig = {
  // Personal Information
  personal: {
    name: "Noushad Hossain",
    title: "Lead Software Engineer & AI Innovator",
    email: "sourav1023@gmail.com",
    location: "Dhaka, Bangladesh",
    // ... more config
  },
  
  // Skills, Experience, Social Links
  skills: { /* ... */ },
  experience: [ /* ... */ ],
  social: { /* ... */ },
  
  // GitHub Integration
  githubUsername: "noushad15",
};
```

### Theme Configuration

Multiple themes available in `lib/config.js`:

- **🌙 Dark Theme** - Professional dark mode
- **☀️ Light Theme** - Clean light interface  
- **💫 Neon Theme** - Cyberpunk-inspired design
- **🌅 Sunset Theme** - Warm gradient colors
- **🌲 Forest Theme** - Nature-inspired greens

## 🚀 Deployment

### **Vercel (Recommended)**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/umutxyp/Personal-Website)

```bash
npm install -g vercel
vercel --prod
```

### **Netlify**

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/umutxyp/Personal-Website)

### **Manual Deployment**

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📊 Performance

- **⚡ Lighthouse Score:** 95+ Performance
- **🔍 SEO Optimized:** Meta tags, structured data
- **📱 Mobile First:** Responsive design
- **🎯 Core Web Vitals:** Optimized loading and interactivity

## 🔧 Customization

### Adding New Sections

1. Create component in `components/`
2. Add to page in `pages/index.jsx`
3. Update configuration in `lib/config.js`

### Modifying Themes

Edit theme colors in `lib/config.js`:

```javascript
export const themes = {
  customTheme: {
    name: "Custom",
    colors: {
      primary: "#your-color",
      secondary: "#your-color",
      // ... more colors
    }
  }
}
```

### GitHub Integration

Update GitHub username in `config.js` and `pages/api/github-repos.js`:

```javascript
githubUsername: "your-username"
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit changes** (`git commit -m 'Add AmazingFeature'`)
4. **Push to branch** (`git push origin feature/AmazingFeature`)
5. **Open Pull Request**

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Noushad Hossain**
- 🌐 Website: [noushadhossain.com](https://noushadhossain.com)
- 💼 LinkedIn: [linkedin.com/in/noushadhossain](https://linkedin.com/in/noushadhossain)
- 🐱 GitHub: [@noushad15](https://github.com/noushad15)
- 📧 Email: sourav1023@gmail.com

## 🙏 Acknowledgments

- **Original Template:** Built upon umutxyp's portfolio framework
- **Icons:** React Icons library
- **Animations:** Framer Motion
- **3D Graphics:** Three.js and React Three Fiber
- **Styling:** Tailwind CSS

---

<div align="center">

**⭐ Star this repository if it helped you build your portfolio!**

Made with ❤️ by [Noushad Hossain](https://noushadhossain.com)

</div>