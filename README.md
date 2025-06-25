# Neon SEO Beacon - Nuxt Migration

This is the Nuxt.js version of the Neon SEO Beacon platform, featuring modern SSR/SSG capabilities with @nuxt/content for content management.

## 🚀 Features

- **Nuxt 3**: Modern Vue.js framework with SSR/SSG
- **@nuxt/content**: File-based CMS for SEO tips and documentation
- **Supabase Integration**: Authentication and database
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Full type safety
- **SEO Optimized**: Meta tags, structured data, and sitemap generation
- **PWA Ready**: Offline support and app-like experience
- **Component Library**: Reusable UI components

## 📋 Prerequisites

- Node.js 18.17.0 or higher
- npm or yarn package manager
- Supabase account and project
- Anthropic API key (for AI features)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kr8thor/neon-seo-beacon.git
   cd neon-seo-beacon
   git checkout nuxt-migration
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the following environment variables:
   ```env
   # Supabase
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # Anthropic AI
   ANTHROPIC_API_KEY=your_anthropic_api_key
   
   # Site Configuration
   NUXT_PUBLIC_SITE_URL=http://localhost:3000
   NUXT_PUBLIC_SITE_NAME="Neon SEO Beacon"
   ```

4. **Database Setup**
   
   Run the following SQL in your Supabase SQL editor:
   ```sql
   -- Create audits table
   CREATE TABLE audits (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES auth.users(id),
     url TEXT NOT NULL,
     status TEXT DEFAULT 'processing',
     score INTEGER CHECK (score >= 0 AND score <= 100),
     results JSONB,
     error TEXT,
     processing_time_ms INTEGER,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     completed_at TIMESTAMP WITH TIME ZONE,
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   -- Create audit progress table
   CREATE TABLE audit_progress (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     audit_id UUID REFERENCES audits(id) ON DELETE CASCADE,
     step INTEGER NOT NULL,
     total_steps INTEGER NOT NULL,
     message TEXT,
     data JSONB,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   -- Enable RLS
   ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
   ALTER TABLE audit_progress ENABLE ROW LEVEL SECURITY;
   
   -- Create policies
   CREATE POLICY "Users can manage their own audits" ON audits
     FOR ALL USING (auth.uid() = user_id);
   
   CREATE POLICY "Users can view their audit progress" ON audit_progress
     FOR SELECT USING (
       EXISTS (
         SELECT 1 FROM audits 
         WHERE audits.id = audit_progress.audit_id 
         AND audits.user_id = auth.uid()
       )
     );
   ```

## 🚀 Development

1. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:3000`

2. **Build for production**
   ```bash
   npm run build
   ```

3. **Preview production build**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
├── assets/
│   └── css/              # Global stylesheets
├── components/
│   ├── ui/               # Reusable UI components
│   ├── AppNavigation.vue # Main navigation
│   └── AppFooter.vue     # Site footer
├── composables/
│   ├── useContent.js     # Content management utilities
│   └── useSEO.js         # SEO utilities
├── content/
│   ├── seo-tips/         # SEO guides and tips
│   └── docs/             # Documentation
├── layouts/
│   └── default.vue       # Default layout
├── middleware/
│   ├── auth.js           # Authentication middleware
│   └── guest.js          # Guest-only middleware
├── pages/
│   ├── auth/             # Authentication pages
│   ├── dashboard.vue     # User dashboard
│   ├── index.vue         # Homepage
│   └── pricing.vue       # Pricing page
├── plugins/
│   └── pinia.client.js   # Pinia store setup
├── server/
│   └── api/              # Server API routes
├── stores/
│   └── notification.js   # Global notification store
└── nuxt.config.ts        # Nuxt configuration
```

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Components**: Pre-built component classes in `assets/css/main.css`
- **Responsive Design**: Mobile-first approach
- **Dark Mode Ready**: Prepared for dark mode implementation
- **Accessibility**: WCAG compliant styles

## 🔐 Authentication

- **Supabase Auth**: Email/password and OAuth providers
- **Middleware Protection**: Route-level authentication
- **Session Management**: Automatic token refresh
- **User Profiles**: Extended user data

## 📝 Content Management

- **@nuxt/content**: File-based content management
- **Markdown Support**: Rich content with frontmatter
- **SEO Optimization**: Automatic meta tags and structured data
- **Search Functionality**: Built-in content search
- **Dynamic Routing**: Automatic page generation

## 🔧 API Routes

- `POST /api/audits` - Create new audit
- `GET /api/audits/[id]` - Get audit details
- `GET /api/audits/[id]/progress` - SSE progress stream
- `DELETE /api/audits/[id]` - Delete audit

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - automatic deployments on push

### Netlify

1. **Build command**: `npm run build`
2. **Publish directory**: `.output/public`
3. **Set environment variables** in Netlify dashboard

### Docker

```bash
# Build image
docker build -t neon-seo-beacon .

# Run container
docker run -p 3000:3000 neon-seo-beacon
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Run linting
npm run lint

# Run type checking
npm run typecheck
```

## 📈 Performance Optimization

- **SSR/SSG**: Server-side rendering and static generation
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Nuxt Image module
- **Caching**: Aggressive caching strategies
- **Bundle Analysis**: Built-in bundle analyzer

## 🔍 SEO Features

- **Meta Tags**: Automatic meta tag generation
- **Structured Data**: JSON-LD schema markup
- **Sitemap**: Automatic sitemap generation
- **Robots.txt**: SEO-friendly robots configuration
- **Open Graph**: Social media optimization
- **Core Web Vitals**: Performance optimization

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [https://neonseobeacon.com/docs](https://neonseobeacon.com/docs)
- **Issues**: [GitHub Issues](https://github.com/Kr8thor/neon-seo-beacon/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Kr8thor/neon-seo-beacon/discussions)
- **Email**: support@neonseobeacon.com

## 🗺️ Roadmap

- [ ] Advanced SEO analysis features
- [ ] Real-time collaboration
- [ ] Advanced reporting dashboard
- [ ] Mobile app development
- [ ] White-label solutions
- [ ] API rate limiting and quotas
- [ ] Advanced user management
- [ ] Integration marketplace

---

**Built with ❤️ using Nuxt 3, Supabase, and Tailwind CSS**