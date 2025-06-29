// tests/fixtures/test-data.ts
export const TEST_USERS = {
  validUser: {
    email: 'testuser@example.com',
    password: 'TestPassword123!',
    name: 'Test User'
  },
  adminUser: {
    email: 'admin@example.com',
    password: 'AdminPass123!',
    name: 'Admin User',
    role: 'admin'
  },
  invalidUser: {
    email: 'invalid-email',
    password: '123',
    name: ''
  }
}

export const TEST_URLS = {
  valid: [
    'https://example.com',
    'https://www.google.com',
    'https://github.com/microsoft/playwright',
    'https://nuxt.com'
  ],
  invalid: [
    'not-a-url',
    'ftp://example.com',
    'javascript:alert("xss")',
    'file:///etc/passwd',
    'http://localhost:3000'
  ],
  problematic: [
    'https://httpstat.us/500', // Returns 500 error
    'https://httpstat.us/timeout', // Times out
    'https://very-slow-website-example.com', // Slow response
    'https://nonexistent-domain-12345.com' // DNS failure
  ]
}

export const MOCK_SEO_ANALYSIS = {
  highScore: {
    url: 'https://example.com',
    title: { content: 'Example Domain - Perfect Title', score: 95, length: 32 },
    description: { content: 'This domain is for use in examples', score: 90, length: 35 },
    headers: { h1Count: 1, h2Count: 3, score: 100 },
    images: { total: 5, withAlt: 5, score: 100 },
    links: { internal: 10, external: 3, score: 85 },
    technical: { hasRobots: true, hasCanonical: true, score: 95 },
    performance: { loadTime: 1200, score: 90 },
    score: 92
  },
  lowScore: {
    url: 'https://badsite.com',
    title: { content: 'Untitled Document', score: 20, length: 17 },
    description: { content: '', score: 0, length: 0 },
    headers: { h1Count: 0, h2Count: 0, score: 10 },
    images: { total: 10, withAlt: 2, score: 25 },
    links: { internal: 2, external: 50, score: 30 },
    technical: { hasRobots: false, hasCanonical: false, score: 15 },
    performance: { loadTime: 8500, score: 20 },
    score: 18
  }
}

export const MOCK_AUDIT_PROGRESS = [
  { step: 1, total_steps: 5, message: 'Fetching page content', percentage: 20 },
  { step: 2, total_steps: 5, message: 'Analyzing meta tags', percentage: 40 },
  { step: 3, total_steps: 5, message: 'Checking technical SEO', percentage: 60 },
  { step: 4, total_steps: 5, message: 'Analyzing performance', percentage: 80 },
  { step: 5, total_steps: 5, message: 'Generating report', percentage: 100 }
]
