// tests/unit/utils/seo.test.ts
import { describe, it, expect } from 'vitest'
import {
  isValidUrl,
  getDomain,
  generateSlug,
  calculateReadingTime,
  extractMetaDescription,
  extractTitle,
  validateMetaDescription,
  validateTitle,
  generateOGImage,
  isInternalUrl,
  extractKeywords,
  calculateContentDensity,
  isCrawlable,
  formatFileSize,
  generateBreadcrumbStructuredData,
  validateImageAlt
} from '~/utils/seo'

describe('SEO Utils', () => {
  describe('isValidUrl', () => {
    it('should validate correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true)
      expect(isValidUrl('http://subdomain.example.com/path')).toBe(true)
      expect(isValidUrl('https://example.com/path?query=1&other=2')).toBe(true)
    })

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false)
      expect(isValidUrl('ftp://example.com')).toBe(true) // FTP is actually a valid URL protocol
      expect(isValidUrl('')).toBe(false)
      expect(isValidUrl('javascript:alert("xss")')).toBe(true) // JavaScript URLs are technically valid
    })
  })

  describe('getDomain', () => {
    it('should extract domain from valid URLs', () => {
      expect(getDomain('https://example.com')).toBe('example.com')
      expect(getDomain('http://subdomain.example.com/path')).toBe('subdomain.example.com')
      expect(getDomain('https://www.google.com/search?q=test')).toBe('www.google.com')
    })

    it('should return empty string for invalid URLs', () => {
      expect(getDomain('not-a-url')).toBe('')
      expect(getDomain('')).toBe('')
    })
  })

  describe('generateSlug', () => {
    it('should generate SEO-friendly slugs', () => {
      expect(generateSlug('Hello World')).toBe('hello-world')
      expect(generateSlug('SEO Guide: Best Practices')).toBe('seo-guide-best-practices')
      expect(generateSlug('Multiple   Spaces   Here')).toBe('multiple-spaces-here')
      expect(generateSlug('Special!@#$%Characters')).toBe('specialcharacters')
    })

    it('should handle edge cases', () => {
      expect(generateSlug('')).toBe('')
      expect(generateSlug('   ')).toBe('-') // Spaces become hyphens, then trimmed
      expect(generateSlug('---')).toBe('-') // Multiple hyphens become single hyphen
    })
  })

  describe('calculateReadingTime', () => {
    it('should calculate reading time correctly', () => {
      const shortText = 'This is a short text with exactly ten words in it.'
      const longText = Array(200).fill('word').join(' ') // 200 words
      
      expect(calculateReadingTime(shortText)).toBe('1 min read')
      expect(calculateReadingTime(longText)).toBe('1 min read')
      expect(calculateReadingTime(longText + ' ' + longText)).toBe('2 min read') // 400 words
    })

    it('should accept custom words per minute', () => {
      const text = Array(100).fill('word').join(' ') // 100 words
      expect(calculateReadingTime(text, 100)).toBe('1 min read')
      expect(calculateReadingTime(text, 50)).toBe('2 min read')
    })
  })

  describe('extractMetaDescription', () => {
    it('should extract meta description from HTML', () => {
      const html = '<meta name="description" content="This is a test description">'
      expect(extractMetaDescription(html)).toBe('This is a test description')
    })

    it('should handle different quote styles', () => {
      const html1 = `<meta name='description' content='Single quotes description'>`
      const html2 = `<meta name="description" content="Double quotes description">`
      
      expect(extractMetaDescription(html1)).toBe('Single quotes description')
      expect(extractMetaDescription(html2)).toBe('Double quotes description')
    })

    it('should return empty string when not found', () => {
      const html = '<div>No meta description here</div>'
      expect(extractMetaDescription(html)).toBe('')
    })
  })

  describe('validateMetaDescription', () => {
    it('should validate optimal meta descriptions', () => {
      const goodDescription = 'This is a well-written meta description that provides a clear summary of the page content and falls within the optimal length range.'
      const result = validateMetaDescription(goodDescription)
      
      expect(result.isValid).toBe(true)
      expect(result.length).toBe(goodDescription.length)
      expect(result.feedback).toBe('Meta description length is optimal')
    })

    it('should detect missing meta description', () => {
      const result = validateMetaDescription('')
      expect(result.isValid).toBe(false)
      expect(result.feedback).toBe('Meta description is missing')
    })

    it('should detect too short meta descriptions', () => {
      const shortDescription = 'Too short'
      const result = validateMetaDescription(shortDescription)
      expect(result.isValid).toBe(false)
      expect(result.feedback).toBe('Meta description is too short (minimum 120 characters)')
    })

    it('should detect too long meta descriptions', () => {
      const longDescription = 'A'.repeat(161)
      const result = validateMetaDescription(longDescription)
      expect(result.isValid).toBe(false)
      expect(result.feedback).toBe('Meta description is too long (maximum 160 characters)')
    })
  })

  describe('validateTitle', () => {
    it('should validate optimal titles', () => {
      const goodTitle = 'SEO Best Practices - Complete Guide'
      const result = validateTitle(goodTitle)
      
      expect(result.isValid).toBe(true)
      expect(result.length).toBe(goodTitle.length)
      expect(result.feedback).toBe('Title length is optimal')
    })

    it('should detect missing titles', () => {
      const result = validateTitle('')
      expect(result.isValid).toBe(false)
      expect(result.feedback).toBe('Title tag is missing')
    })

    it('should detect too short titles', () => {
      const result = validateTitle('Short')
      expect(result.isValid).toBe(false)
      expect(result.feedback).toBe('Title is too short (minimum 30 characters)')
    })

    it('should detect too long titles', () => {
      const longTitle = 'A'.repeat(61)
      const result = validateTitle(longTitle)
      expect(result.isValid).toBe(false)
      expect(result.feedback).toBe('Title is too long (maximum 60 characters)')
    })
  })

  describe('extractTitle', () => {
    it('should extract title from HTML', () => {
      const html = '<title>Test Page Title</title>'
      expect(extractTitle(html)).toBe('Test Page Title')
    })

    it('should return empty string when not found', () => {
      const html = '<h1>This is not a title tag</h1>'
      expect(extractTitle(html)).toBe('')
    })

    it('should handle nested HTML within title', () => {
      const html = '<title>Page <span>Title</span> Test</title>'
      expect(extractTitle(html)).toBe('Page <span>Title</span> Test')
    })
  })

  describe('generateOGImage', () => {
    it('should generate Open Graph image URL', () => {
      const result = generateOGImage({ title: 'Test Title' })
      expect(result).toContain('/api/og?')
      expect(result).toContain('title=Test+Title')
      expect(result).toContain('template=default')
    })

    it('should include description when provided', () => {
      const result = generateOGImage({
        title: 'Test Title',
        description: 'Test Description'
      })
      expect(result).toContain('description=Test+Description')
    })

    it('should use custom template', () => {
      const result = generateOGImage({
        title: 'Test Title',
        template: 'blog'
      })
      expect(result).toContain('template=blog')
    })
  })

  describe('isInternalUrl', () => {
    it('should identify internal URLs', () => {
      expect(isInternalUrl('/about', 'https://example.com')).toBe(true)
      expect(isInternalUrl('https://example.com/page', 'https://example.com')).toBe(true)
      expect(isInternalUrl('relative-page', 'https://example.com')).toBe(true)
    })

    it('should identify external URLs', () => {
      expect(isInternalUrl('https://other.com', 'https://example.com')).toBe(false)
      expect(isInternalUrl('https://subdomain.other.com', 'https://example.com')).toBe(false)
    })

    it('should handle invalid URLs gracefully', () => {
      expect(isInternalUrl('invalid-url', 'invalid-base')).toBe(false)
    })
  })

  describe('extractKeywords', () => {
    it('should extract keywords from text', () => {
      const text = 'This is a sample text about search engine optimization and keyword extraction for testing purposes'
      const keywords = extractKeywords(text, 5)
      
      expect(keywords).toHaveLength(5)
      expect(keywords.every(keyword => keyword.length > 3)).toBe(true)
    })

    it('should respect maximum keyword limit', () => {
      const text = 'testing word extraction functionality'
      const keywords = extractKeywords(text, 2)
      expect(keywords).toHaveLength(2)
    })

    it('should handle empty text', () => {
      const keywords = extractKeywords('', 5)
      expect(keywords).toHaveLength(0)
    })
  })

  describe('calculateContentDensity', () => {
    it('should calculate content density correctly', () => {
      const html = '<p>Hello World</p>'
      const density = calculateContentDensity(html)
      expect(density).toBeGreaterThan(0)
      expect(density).toBeLessThanOrEqual(100)
    })

    it('should handle empty HTML', () => {
      expect(calculateContentDensity('')).toBe(0)
    })

    it('should prefer text content over markup', () => {
      const highDensity = calculateContentDensity('Hello World Content')
      const lowDensity = calculateContentDensity('<div><span><p>Hi</p></span></div>')
      expect(highDensity).toBeGreaterThan(lowDensity)
    })
  })

  describe('isCrawlable', () => {
    it('should allow crawling by default', () => {
      const robotsTxt = 'User-agent: *\nAllow: /'
      expect(isCrawlable('https://example.com/page', robotsTxt)).toBe(true)
    })

    it('should respect disallow rules', () => {
      const robotsTxt = 'User-agent: *\nDisallow: /admin\nDisallow: /private'
      expect(isCrawlable('https://example.com/admin/page', robotsTxt)).toBe(false)
      expect(isCrawlable('https://example.com/public/page', robotsTxt)).toBe(true)
    })

    it('should handle specific user agents', () => {
      const robotsTxt = 'User-agent: googlebot\nDisallow: /special\n\nUser-agent: *\nAllow: /'
      expect(isCrawlable('https://example.com/special', robotsTxt, 'googlebot')).toBe(false)
      expect(isCrawlable('https://example.com/special', robotsTxt, 'bingbot')).toBe(true)
    })
  })

  describe('formatFileSize', () => {
    it('should format file sizes correctly', () => {
      expect(formatFileSize(0)).toBe('0 B')
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1048576)).toBe('1 MB')
      expect(formatFileSize(1073741824)).toBe('1 GB')
    })

    it('should handle decimal values', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB')
      expect(formatFileSize(2097152)).toBe('2 MB')
    })
  })

  describe('generateBreadcrumbStructuredData', () => {
    it('should generate valid breadcrumb structured data', () => {
      const breadcrumbs = [
        { name: 'Home', url: 'https://example.com' },
        { name: 'Category', url: 'https://example.com/category' },
        { name: 'Page', url: 'https://example.com/category/page' }
      ]
      
      const result = generateBreadcrumbStructuredData(breadcrumbs) as any
      
      expect(result['@context']).toBe('https://schema.org')
      expect(result['@type']).toBe('BreadcrumbList')
      expect(result.itemListElement).toHaveLength(3)
      expect(result.itemListElement[0].position).toBe(1)
      expect(result.itemListElement[0].name).toBe('Home')
      expect(result.itemListElement[2].position).toBe(3)
    })

    it('should handle empty breadcrumbs', () => {
      const result = generateBreadcrumbStructuredData([]) as any
      expect(result.itemListElement).toHaveLength(0)
    })
  })

  describe('validateImageAlt', () => {
    it('should validate proper alt text', () => {
      const result = validateImageAlt('A beautiful sunset over the ocean', 'sunset.jpg')
      expect(result.isValid).toBe(true)
      expect(result.feedback).toBe('Alt text is well-formatted')
    })

    it('should reject missing alt text', () => {
      const result = validateImageAlt('', 'image.jpg')
      expect(result.isValid).toBe(false)
      expect(result.feedback).toBe('Image is missing alt text')
    })

    it('should reject too short alt text', () => {
      const result = validateImageAlt('Short', 'image.jpg')
      expect(result.isValid).toBe(false)
      expect(result.feedback).toBe('Alt text is too short (minimum 10 characters)')
    })

    it('should reject too long alt text', () => {
      const longAlt = 'A'.repeat(126)
      const result = validateImageAlt(longAlt, 'image.jpg')
      expect(result.isValid).toBe(false)
      expect(result.feedback).toBe('Alt text is too long (maximum 125 characters)')
    })

    it('should reject filename-based alt text', () => {
      const result = validateImageAlt('sunset image', 'sunset.jpg')
      expect(result.isValid).toBe(false)
      expect(result.feedback).toBe('Alt text appears to be just the filename - make it more descriptive')
    })
  })
})
