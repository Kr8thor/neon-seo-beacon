/**
 * SEO utility functions for Neon SEO Beacon
 */

/**
 * Validate if a URL is properly formatted
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Extract domain from URL
 */
export function getDomain(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return ''
  }
}

/**
 * Generate SEO-friendly slug from text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove multiple consecutive hyphens
    .trim()
}

/**
 * Calculate reading time from text content
 */
export function calculateReadingTime(text: string, wordsPerMinute = 200): string {
  const words = text.split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

/**
 * Extract meta description from HTML
 */
export function extractMetaDescription(html: string): string {
  const match = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i)
  return match ? match[1] : ''
}

/**
 * Extract title from HTML
 */
export function extractTitle(html: string): string {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i)
  return match ? match[1] : ''
}

/**
 * Validate meta description length
 */
export function validateMetaDescription(description: string): {
  isValid: boolean
  length: number
  feedback: string
} {
  const length = description.length
  
  if (length === 0) {
    return {
      isValid: false,
      length,
      feedback: 'Meta description is missing'
    }
  }
  
  if (length < 120) {
    return {
      isValid: false,
      length,
      feedback: 'Meta description is too short (minimum 120 characters)'
    }
  }
  
  if (length > 160) {
    return {
      isValid: false,
      length,
      feedback: 'Meta description is too long (maximum 160 characters)'
    }
  }
  
  return {
    isValid: true,
    length,
    feedback: 'Meta description length is optimal'
  }
}

/**
 * Validate title tag length
 */
export function validateTitle(title: string): {
  isValid: boolean
  length: number
  feedback: string
} {
  const length = title.length
  
  if (length === 0) {
    return {
      isValid: false,
      length,
      feedback: 'Title tag is missing'
    }
  }
  
  if (length < 30) {
    return {
      isValid: false,
      length,
      feedback: 'Title is too short (minimum 30 characters)'
    }
  }
  
  if (length > 60) {
    return {
      isValid: false,
      length,
      feedback: 'Title is too long (maximum 60 characters)'
    }
  }
  
  return {
    isValid: true,
    length,
    feedback: 'Title length is optimal'
  }
}

/**
 * Generate Open Graph image URL
 */
export function generateOGImage({
  title,
  description,
  template = 'default'
}: {
  title: string
  description?: string
  template?: string
}): string {
  const params = new URLSearchParams({
    title,
    template
  })
  
  if (description) {
    params.set('description', description)
  }
  
  return `/api/og?${params.toString()}`
}

/**
 * Check if URL is internal (same domain)
 */
export function isInternalUrl(url: string, baseUrl: string): boolean {
  try {
    const urlObj = new URL(url, baseUrl)
    const baseObj = new URL(baseUrl)
    return urlObj.hostname === baseObj.hostname
  } catch {
    return false
  }
}

/**
 * Extract keywords from text content
 */
export function extractKeywords(text: string, maxKeywords = 10): string[] {
  // Simple keyword extraction - in production, you'd use a more sophisticated algorithm
  const words = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3)
  
  const wordCount = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  return Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word)
}

/**
 * Calculate content density score
 */
export function calculateContentDensity(html: string): number {
  // Remove HTML tags and get text content
  const textContent = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  const htmlLength = html.length
  const textLength = textContent.length
  
  if (htmlLength === 0) return 0
  
  // Return percentage of text content vs HTML
  return Math.round((textLength / htmlLength) * 100)
}

/**
 * Check if URL is crawlable based on robots.txt rules
 */
export function isCrawlable(url: string, robotsTxt: string, userAgent = '*'): boolean {
  const lines = robotsTxt.split('\n')
  let currentUserAgent = ''
  let isRelevantSection = false
  
  for (let line of lines) {
    line = line.trim()
    
    if (line.startsWith('User-agent:')) {
      currentUserAgent = line.substring(11).trim()
      isRelevantSection = currentUserAgent === '*' || currentUserAgent === userAgent
      continue
    }
    
    if (!isRelevantSection) continue
    
    if (line.startsWith('Disallow:')) {
      const disallowPath = line.substring(9).trim()
      if (disallowPath && url.includes(disallowPath)) {
        return false
      }
    }
  }
  
  return true
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * Generate structured data for breadcrumbs
 */
export function generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url: string }>): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url
    }))
  }
}

/**
 * Check if image has proper alt text
 */
export function validateImageAlt(altText: string, filename: string): {
  isValid: boolean
  feedback: string
} {
  if (!altText || altText.trim() === '') {
    return {
      isValid: false,
      feedback: 'Image is missing alt text'
    }
  }
  
  if (altText.length < 10) {
    return {
      isValid: false,
      feedback: 'Alt text is too short (minimum 10 characters)'
    }
  }
  
  if (altText.length > 125) {
    return {
      isValid: false,
      feedback: 'Alt text is too long (maximum 125 characters)'
    }
  }
  
  // Check if alt text is just the filename
  if (altText.toLowerCase().includes(filename.toLowerCase().replace(/\.[^/.]+$/, ""))) {
    return {
      isValid: false,
      feedback: 'Alt text appears to be just the filename - make it more descriptive'
    }
  }
  
  return {
    isValid: true,
    feedback: 'Alt text is well-formatted'
  }
}