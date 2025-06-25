# 🚀 Neon SEO Beacon - Nuxt 3 Edition

![Neon SEO Beacon](https://img.shields.io/badge/Neon%20SEO%20Beacon-v2.0-blue?style=for-the-badge)
![Nuxt 3](https://img.shields.io/badge/Nuxt-3.x-00DC82?style=for-the-badge&logo=nuxt.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-06B6D4?style=for-the-badge&logo=tailwind-css)

> **Enterprise-grade SEO audit tool** built with Nuxt 3, featuring AI-powered insights, comprehensive analysis, and professional reporting capabilities.

## ✨ Features

### 🔍 SEO Analysis Engine
- **Comprehensive Technical SEO Audit** - 50+ checkpoints
- **AI-Powered Recommendations** - Claude AI integration
- **Real-time Progress Tracking** - Live audit updates
- **Performance Monitoring** - Core Web Vitals analysis
- **Mobile-First Analysis** - Responsive design evaluation
- **Content Quality Assessment** - Smart content analysis

### 📊 Professional Reporting
- **White-label Reports** - Custom branding for agencies
- **Executive Summaries** - Business-focused insights
- **Detailed Technical Reports** - Developer-friendly outputs
- **Historical Tracking** - Progress over time
- **Export Capabilities** - PDF, CSV, JSON formats

### 🤖 AI Integration
- **Claude AI Recommendations** - Intelligent insights
- **Prioritized Action Items** - Impact-based suggestions
- **Custom Analysis** - Context-aware recommendations
- **Best Practice Guidance** - Industry standards

### 🎯 Content Management
- **SEO Knowledge Base** - Comprehensive guides
- **Dynamic Documentation** - Always up-to-date
- **Search Functionality** - Find content quickly
- **Categorized Content** - Organized by difficulty

## 🛠️ Tech Stack

### Frontend
- **[Nuxt 3](https://nuxt.com/)** - Vue.js meta-framework
- **[Vue 3](https://vuejs.org/)** - Progressive JavaScript framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[Heroicons](https://heroicons.com/)** - Beautiful SVG icons

### Backend & Services
- **[Supabase](https://supabase.com/)** - Backend as a Service
- **[Anthropic Claude](https://www.anthropic.com/)** - AI recommendations
- **[Nuxt Content](https://content.nuxt.com/)** - File-based CMS
- **[Pinia](https://pinia.vuejs.org/)** - State management

### Development Tools
- **[Vite](https://vitejs.dev/)** - Lightning-fast build tool
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[Vitest](https://vitest.dev/)** - Unit testing

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.17.0 or higher
- **npm** or **pnpm** package manager
- **Supabase** account and project
- **Anthropic API** key (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kr8thor/neon-seo-beacon.git
   cd neon-seo-beacon
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Supabase Configuration
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # Anthropic (Claude) API
   ANTHROPIC_API_KEY=your_anthropic_api_key
   
   # Application Settings
   API_URL=http://localhost:3000
   SITE_URL=http://localhost:3000
   ```

4. **Set up Supabase database**
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Run the database migrations (see `/docs/database-setup.md`)

5. **Start development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
neon-seo-beacon/
├── 📁 assets/              # Static assets (CSS, images)
├── 📁 components/          # Vue components
├── 📁 composables/         # Vue composables
├── 📁 content/             # Content files (Markdown)
│   ├── 📁 docs/           # Documentation
│   ├── 📁 seo-tips/       # SEO guides
│   ├── 📁 help/           # Help articles
│   └── 📁 blog/           # Blog posts
├── 📁 layouts/             # Application layouts
├── 📁 pages/               # Application pages
├── 📁 public/              # Public static files
├── 📁 server/              # Server-side code
│   ├── 📁 api/            # API routes
│   └── 📁 routes/         # Server routes
├── 📁 stores/              # Pinia stores
├── 📁 types/               # TypeScript types
├── 📁 utils/               # Utility functions
├── 📄 nuxt.config.ts       # Nuxt configuration
├── 📄 tailwind.config.js   # Tailwind configuration
└── 📄 tsconfig.json        # TypeScript configuration
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run generate     # Generate static site

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # Run TypeScript checks

# Testing
npm run test         # Run tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage
```

### Code Quality

This project uses strict TypeScript and ESLint configurations:

- **TypeScript**: Strict mode enabled with additional checks
- **ESLint**: Nuxt-recommended configuration
- **Prettier**: Automatic code formatting
- **Husky**: Git hooks for quality checks

### Content Management

Content is managed through **Nuxt Content** with Markdown files:

```markdown
---
title: "Your Article Title"
description: "Article description"
category: "Technical SEO"
difficulty: "Beginner"
readTime: "5 min"
tags: ["seo", "technical"]
publishedAt: 2024-01-01
featured: true
---

# Your Article Content

Write your content in Markdown...
```

## 🌐 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** automatically on push to main

### Netlify

1. **Connect your repository** to Netlify
2. **Set build command**: `npm run generate`
3. **Set publish directory**: `dist`
4. **Add environment variables**

### Docker

```bash
# Build Docker image
docker build -t neon-seo-beacon .

# Run container
docker run -p 3000:3000 neon-seo-beacon
```

## 📊 SEO Features

### Technical SEO Analysis
- Meta tags validation
- URL structure analysis
- Site speed optimization
- Mobile responsiveness
- Schema markup validation
- Robots.txt analysis
- Sitemap validation

### Content Analysis
- Keyword optimization
- Content quality assessment
- Heading structure analysis
- Internal linking evaluation
- Image optimization
- Alt text validation

### Performance Monitoring
- Core Web Vitals
- Page load times
- Resource optimization
- Caching analysis
- CDN utilization

## 🔐 Security

- **HTTPS Enforcement** - SSL/TLS certificates
- **Content Security Policy** - XSS protection
- **Rate Limiting** - API protection
- **Input Validation** - Zod schema validation
- **Authentication** - Supabase Auth
- **CORS Configuration** - Cross-origin protection

## 📈 Analytics & Monitoring

### Built-in Analytics
- User engagement tracking
- Audit performance metrics
- Feature usage statistics
- Error monitoring

### External Integrations
- Google Analytics 4
- Sentry error tracking
- Uptime monitoring
- Performance monitoring

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:

- Code of conduct
- Development process
- Submitting pull requests
- Reporting issues

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Add** tests if applicable
5. **Run** quality checks
6. **Submit** a pull request

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Nuxt Team** - For the amazing framework
- **Anthropic** - For Claude AI integration
- **Supabase** - For the backend infrastructure
- **Tailwind CSS** - For the beautiful styling
- **Vue.js Community** - For the ecosystem

## 📞 Support

- **Documentation**: [docs.neonseobeacon.com](https://docs.neonseobeacon.com)
- **Community**: [GitHub Discussions](https://github.com/Kr8thor/neon-seo-beacon/discussions)
- **Issues**: [GitHub Issues](https://github.com/Kr8thor/neon-seo-beacon/issues)
- **Email**: support@neonseobeacon.com

---

<div align="center">
  <strong>Built with ❤️ by the Neon SEO Beacon Team</strong>
  <br>
  <a href="https://neonseobeacon.com">Website</a> •
  <a href="https://docs.neonseobeacon.com">Documentation</a> •
  <a href="https://github.com/Kr8thor/neon-seo-beacon">GitHub</a>
</div>