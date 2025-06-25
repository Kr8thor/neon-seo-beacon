export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl || 'https://neonseobeacon.com'
  
  try {
    // Static pages
    const staticPages = [
      { loc: '/', priority: '1.0', changefreq: 'daily' },
      { loc: '/pricing', priority: '0.9', changefreq: 'weekly' },
      { loc: '/features', priority: '0.8', changefreq: 'weekly' },
      { loc: '/docs', priority: '0.8', changefreq: 'weekly' },
      { loc: '/seo-tips', priority: '0.9', changefreq: 'daily' },
      { loc: '/help', priority: '0.7', changefreq: 'weekly' },
      { loc: '/contact', priority: '0.6', changefreq: 'monthly' },
      { loc: '/about', priority: '0.5', changefreq: 'monthly' },
      { loc: '/privacy', priority: '0.3', changefreq: 'yearly' },
      { loc: '/terms', priority: '0.3', changefreq: 'yearly' }
    ]
    
    // Get dynamic content from content module
    const { getSitemapData } = useContent()
    const contentPages = await getSitemapData()
    
    // Build XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
`
    
    // Add static pages
    staticPages.forEach(page => {
      xml += `  <url>
`
      xml += `    <loc>${siteUrl}${page.loc}</loc>
`
      xml += `    <lastmod>${new Date().toISOString()}</lastmod>
`
      xml += `    <changefreq>${page.changefreq}</changefreq>
`
      xml += `    <priority>${page.priority}</priority>
`
      xml += `  </url>
`
    })
    
    // Add content pages
    contentPages.forEach(page => {
      const lastmod = page.updatedAt || page.publishedAt || new Date().toISOString()
      const priority = page._path.includes('/seo-tips/') ? '0.8' : '0.6'
      const changefreq = page._path.includes('/seo-tips/') ? 'weekly' : 'monthly'
      
      xml += `  <url>
`
      xml += `    <loc>${siteUrl}${page._path}</loc>
`
      xml += `    <lastmod>${new Date(lastmod).toISOString()}</lastmod>
`
      xml += `    <changefreq>${changefreq}</changefreq>
`
      xml += `    <priority>${priority}</priority>
`
      xml += `  </url>
`
    })
    
    xml += `</urlset>`
    
    setHeader(event, 'Content-Type', 'application/xml')
    setHeader(event, 'Cache-Control', 'public, max-age=3600') // Cache for 1 hour
    
    return xml
  } catch (error) {
    console.error('Sitemap generation error:', error)
    
    setResponseStatus(event, 500)
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`
  }
})