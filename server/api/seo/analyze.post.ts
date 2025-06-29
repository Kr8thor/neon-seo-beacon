import { z } from 'zod'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { UAParser } from 'ua-parser-js'
import { withCircuitBreaker } from '~/server/utils/circuitBreaker'
import { logger } from '~/server/utils/logger'

// Request validation schema
const analyzeSchema = z.object({
  url: z.string().url('Invalid URL format'),
  options: z.object({
    includeImages: z.boolean().default(true),
    checkMobile: z.boolean().default(true),
    includePerformance: z.boolean().default(true)
  }).default({})
})

export default defineEventHandler(async (event: any) => {
  const config = useRuntimeConfig()
  
  try {
    // Validate request body
    const body = await readBody(event)
    const { url, options } = analyzeSchema.parse(body)
    
    // Basic SEO analysis with circuit breaker
    const analysis = await withCircuitBreaker(
      'seo-analysis',
      () => performSEOAnalysis(url, options),
      {
        failureThreshold: 3,
        timeout: 30000,
        fallbackFunction: async () => ({
          url,
          title: 'Analysis Unavailable',
          metaDescription: '',
          h1Tags: [],
          h2Tags: [],
          metaTags: {},
          images: null,
          links: { internal: 0, external: 0, nofollow: 0, total: 0 },
          performance: null,
          technical: {
            hasRobotsMeta: false,
            hasCanonical: false,
            hasViewport: false,
            hasCharset: false,
            hasLangAttribute: false,
            structuredData: { count: 0, types: [] },
            openGraph: {},
            twitterCard: {}
          },
          score: 0,
          processingTime: 0,
          error: 'SEO analysis service temporarily unavailable'
        })
      }
    )
    
    // Return results
    return {
      success: true,
      data: analysis,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    logger.error('SEO analysis error', error)
    
    if (error instanceof z.ZodError) {
      setResponseStatus(event, 400)
      return {
        success: false,
        error: 'Invalid request data',
        details: error.errors
      }
    }
    
    setResponseStatus(event, 500)
    return {
      success: false,
      error: 'Analysis failed',
      message: (error as Error).message
    }
  }
})

async function performSEOAnalysis(url: string, options: any) {
  const startTime = Date.now()
  
  try {
    // Fetch the webpage
    const response = await axios.get(url, {
      timeout: 30000,
      headers: {
        'User-Agent': 'Marden SEO Audit Bot/2.0 (+https://audit.mardenseo.com/bot)'
      }
    })
    
    const html = response.data
    const $ = cheerio.load(html)
    
    // Basic page analysis
    const analysis = {
      url,
      title: $('title').text() || '',
      metaDescription: $('meta[name="description"]').attr('content') || '',
      h1Tags: $('h1').map((i, el) => $(el).text()).get(),
      h2Tags: $('h2').map((i, el) => $(el).text()).get(),
      metaTags: extractMetaTags($),
      images: options.includeImages ? analyzeImages($) : null,
      links: analyzeLinks($, url),
      performance: options.includePerformance ? await analyzePerformance(url) : null,
      technical: analyzeTechnicalSEO($, html),
      score: 0, // Will be calculated
      processingTime: Date.now() - startTime
    }
    
    // Calculate SEO score
    analysis.score = calculateSEOScore(analysis)
    
    return analysis
  } catch (error) {
    throw new Error(`Failed to analyze ${url}: ${(error as Error).message}`)
  }
}

function extractMetaTags($: any): Record<string, string> {
  const metaTags: Record<string, string> = {}
  
  $('meta').each((i: number, element: any) => {
    const name = $(element).attr('name') || $(element).attr('property')
    const content = $(element).attr('content')
    
    if (name && content) {
      metaTags[name] = content
    }
  })
  
  return metaTags
}

function analyzeImages($: any) {
  const images: any[] = []
  
  $('img').each((i: number, element: any) => {
    const src = $(element).attr('src')
    const alt = $(element).attr('alt')
    const title = $(element).attr('title')
    
    images.push({
      src,
      alt: alt || '',
      title: title || '',
      hasAlt: !!alt,
      hasTitle: !!title
    })
  })
  
  return {
    total: images.length,
    withAlt: images.filter(img => img.hasAlt).length,
    withoutAlt: images.filter(img => !img.hasAlt).length,
    images: images.slice(0, 50) // Limit to first 50 images
  }
}

function analyzeLinks($: any, baseUrl: string) {
  const links = {
    internal: 0,
    external: 0,
    nofollow: 0,
    total: 0
  }
  
  $('a[href]').each((i: number, element: any) => {
    const href = $(element).attr('href')
    const rel = $(element).attr('rel')
    
    if (href) {
      links.total++
      
      if (rel && rel.includes('nofollow')) {
        links.nofollow++
      }
      
      if (href.startsWith('http') && !href.includes(new URL(baseUrl).hostname)) {
        links.external++
      } else if (!href.startsWith('http') || href.includes(new URL(baseUrl).hostname)) {
        links.internal++
      }
    }
  })
  
  return links
}

async function analyzePerformance(url: string) {
  return withCircuitBreaker(
    'performance-analysis',
    async () => {
      const startTime = Date.now()
      
      try {
        const response = await axios.get(url, { 
          timeout: 10000,
          maxRedirects: 5,
          headers: {
            'User-Agent': 'Marden SEO Audit Performance Bot/2.0'
          }
        })
        const loadTime = Date.now() - startTime
        
        return {
          loadTime,
          status: response.status,
          size: response.headers['content-length'] || 0,
          compression: response.headers['content-encoding'] || 'none'
        }
      } catch (error) {
        return {
          loadTime: Date.now() - startTime,
          status: 'error',
          error: (error as Error).message
        }
      }
    },
    {
      failureThreshold: 5,
      timeout: 15000,
      fallbackFunction: async () => ({
        loadTime: null,
        status: 'unavailable',
        error: 'Performance analysis temporarily unavailable'
      })
    }
  )
}

function analyzeTechnicalSEO($: any, html: string) {
  return {
    hasRobotsMeta: !!$('meta[name="robots"]').length,
    hasCanonical: !!$('link[rel="canonical"]').length,
    hasViewport: !!$('meta[name="viewport"]').length,
    hasCharset: /charset=/i.test(html),
    hasLangAttribute: !!$('html[lang]').length,
    structuredData: analyzeStructuredData($),
    openGraph: analyzeOpenGraph($),
    twitterCard: analyzeTwitterCard($)
  }
}

function analyzeStructuredData($: any) {
  const structuredData: any[] = []
  
  $('script[type="application/ld+json"]').each((i: number, element: any) => {
    try {
      const data = JSON.parse($(element).html() || '{}')
      structuredData.push(data)
    } catch (error) {
      // Invalid JSON
    }
  })
  
  return {
    count: structuredData.length,
    types: structuredData.map(data => data['@type']).filter(Boolean)
  }
}

function analyzeOpenGraph($: any): Record<string, string> {
  const ogTags: Record<string, string> = {}
  
  $('meta[property^="og:"]').each((i: number, element: any) => {
    const property = $(element).attr('property')
    const content = $(element).attr('content')
    
    if (property && content) {
      ogTags[property] = content
    }
  })
  
  return ogTags
}

function analyzeTwitterCard($: any): Record<string, string> {
  const twitterTags: Record<string, string> = {}
  
  $('meta[name^="twitter:"]').each((i: number, element: any) => {
    const name = $(element).attr('name')
    const content = $(element).attr('content')
    
    if (name && content) {
      twitterTags[name] = content
    }
  })
  
  return twitterTags
}

function calculateSEOScore(analysis: any) {
  let score = 0
  const maxScore = 100
  
  // Title tag (15 points)
  if (analysis.title) {
    if (analysis.title.length >= 30 && analysis.title.length <= 60) {
      score += 15
    } else if (analysis.title.length > 0) {
      score += 8
    }
  }
  
  // Meta description (15 points)
  if (analysis.metaDescription) {
    if (analysis.metaDescription.length >= 120 && analysis.metaDescription.length <= 160) {
      score += 15
    } else if (analysis.metaDescription.length > 0) {
      score += 8
    }
  }
  
  // H1 tags (10 points)
  if (analysis.h1Tags.length === 1) {
    score += 10
  } else if (analysis.h1Tags.length > 1) {
    score += 5
  }
  
  // Images with alt text (10 points)
  if (analysis.images) {
    const altPercentage = analysis.images.total > 0 ? 
      (analysis.images.withAlt / analysis.images.total) * 100 : 100
    score += Math.round((altPercentage / 100) * 10)
  }
  
  // Technical SEO (25 points)
  const technical = analysis.technical
  if (technical.hasViewport) score += 5
  if (technical.hasCanonical) score += 5
  if (technical.hasCharset) score += 3
  if (technical.hasLangAttribute) score += 3
  if (technical.structuredData.count > 0) score += 5
  if (Object.keys(technical.openGraph).length > 3) score += 4
  
  // Performance (15 points)
  if (analysis.performance && analysis.performance.loadTime) {
    if (analysis.performance.loadTime < 2000) {
      score += 15
    } else if (analysis.performance.loadTime < 4000) {
      score += 10
    } else if (analysis.performance.loadTime < 6000) {
      score += 5
    }
  }
  
  // Content structure (10 points)
  if (analysis.h2Tags.length > 0) score += 5
  if (analysis.links.internal > 0) score += 5
  
  return Math.min(score, maxScore)
}