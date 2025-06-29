export default defineEventHandler((event: any) => {
  const config = useRuntimeConfig();
  const siteUrl = config.public.siteUrl || "https://audit.mardenseo.com";

  const robotsTxt = `# Robots.txt for Marden SEO Audit
# Generated automatically

User-agent: *
Allow: /

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /dashboard/
Disallow: /settings/
Disallow: /billing/
Disallow: /_nuxt/

# Allow SEO-friendly pages
Allow: /seo-tips/
Allow: /docs/
Allow: /help/
Allow: /pricing
Allow: /features

# Sitemap location
Sitemap: ${siteUrl}/sitemap.xml

# Crawl delay for bots
Crawl-delay: 1

# Specific bot instructions
User-agent: Googlebot
Crawl-delay: 0

User-agent: Bingbot
Crawl-delay: 1

# Block AI training crawlers (optional)
User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /`;

  setHeader(event, "Content-Type", "text/plain");
  setHeader(event, "Cache-Control", "public, max-age=86400"); // Cache for 24 hours

  return robotsTxt;
});
