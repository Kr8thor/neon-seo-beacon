---
title: "API Documentation - Neon SEO Beacon"
description: "Complete API reference for integrating Neon SEO Beacon's SEO analysis capabilities into your applications and workflows."
category: "API Documentation"
difficulty: "Advanced"
readingTime: "15 min read"
tags: ["api", "integration", "developers", "automation", "webhooks"]
date: "2024-12-29"
author: "Neon SEO Beacon"
featured: true
---

# Neon SEO Beacon API Documentation

The Neon SEO Beacon API allows you to programmatically access our comprehensive SEO analysis capabilities. Integrate powerful SEO auditing directly into your applications, workflows, and client dashboards.

## Getting Started

### Authentication

All API requests require authentication using API keys. Include your API key in the request headers:

```bash
Authorization: Bearer YOUR_API_KEY
```

### Base URL

```
https://api.neon-seo-beacon.com/v1
```

### Rate Limits

- **Free Plan**: 100 requests per hour
- **Pro Plan**: 1,000 requests per hour  
- **Enterprise Plan**: 10,000 requests per hour

Rate limit headers are included in all responses:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Endpoints

### Health Check

Check API availability and your authentication status.

**GET** `/health`

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.neon-seo-beacon.com/v1/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-12-29T10:30:00Z",
  "version": "1.0.0",
  "authenticated": true,
  "user": {
    "id": "user_123",
    "plan": "pro",
    "requests_remaining": 985
  }
}
```

### SEO Analysis

Perform comprehensive SEO analysis on any publicly accessible URL.

**POST** `/seo/analyze`

**Request Body:**
```json
{
  "url": "https://example.com",
  "options": {
    "includeImages": true,
    "checkMobile": true,
    "includePerformance": true,
    "includeContent": true,
    "includeLinks": true
  }
}
```

**Parameters:**
- `url` (required): The URL to analyze
- `options` (optional): Analysis configuration object
  - `includeImages`: Analyze image optimization (default: true)
  - `checkMobile`: Include mobile-specific analysis (default: true)
  - `includePerformance`: Include performance metrics (default: true)
  - `includeContent`: Analyze content structure (default: true)
  - `includeLinks`: Analyze link structure (default: true)

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://example.com",
    "title": "Example Domain",
    "score": 85,
    "analysis": {
      "meta": {
        "title": {
          "content": "Example Domain",
          "length": 14,
          "score": 75,
          "issues": ["too_short"],
          "recommendations": ["Expand title to include primary keywords"]
        },
        "description": {
          "content": "This domain is for use in illustrative examples",
          "length": 48,
          "score": 90,
          "issues": [],
          "recommendations": []
        }
      },
      "headers": {
        "h1Count": 1,
        "h2Count": 0,
        "h3Count": 0,
        "score": 60,
        "issues": ["missing_h2"],
        "recommendations": ["Add H2 subheadings to structure content"]
      },
      "images": {
        "total": 0,
        "withAlt": 0,
        "withoutAlt": 0,
        "score": 100,
        "issues": [],
        "recommendations": []
      },
      "performance": {
        "loadTime": 1250,
        "firstContentfulPaint": 800,
        "largestContentfulPaint": 1200,
        "cumulativeLayoutShift": 0.05,
        "score": 88,
        "issues": [],
        "recommendations": ["Consider optimizing images for faster loading"]
      },
      "technical": {
        "hasRobots": true,
        "hasCanonical": false,
        "hasViewport": true,
        "hasCharset": true,
        "score": 75,
        "issues": ["missing_canonical"],
        "recommendations": ["Add canonical tag to prevent duplicate content"]
      }
    },
    "processingTime": 2450,
    "timestamp": "2024-12-29T10:30:00Z"
  }
}
```

### Audit Management

Create, retrieve, and manage SEO audits with progress tracking.

#### Create Audit

**POST** `/audits`

```json
{
  "url": "https://example.com",
  "options": {
    "includeImages": true,
    "checkMobile": true,
    "includePerformance": true
  },
  "webhook_url": "https://yourapp.com/webhooks/audit-complete" // optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "audit_abc123",
    "url": "https://example.com",
    "status": "processing",
    "created_at": "2024-12-29T10:30:00Z",
    "estimated_completion": "2024-12-29T10:32:00Z"
  }
}
```

#### Get Audit Status

**GET** `/audits/{audit_id}`

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.neon-seo-beacon.com/v1/audits/audit_abc123
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "audit_abc123",
    "url": "https://example.com",
    "status": "completed",
    "score": 85,
    "created_at": "2024-12-29T10:30:00Z",
    "completed_at": "2024-12-29T10:31:45Z",
    "results": {
      // Full analysis results here
    }
  }
}
```

#### List Audits

**GET** `/audits`

**Query Parameters:**
- `limit`: Number of results (default: 20, max: 100)
- `offset`: Pagination offset (default: 0)
- `status`: Filter by status (processing, completed, failed)
- `url`: Filter by URL

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "https://api.neon-seo-beacon.com/v1/audits?limit=10&status=completed"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "audits": [
      {
        "id": "audit_abc123",
        "url": "https://example.com",
        "status": "completed",
        "score": 85,
        "created_at": "2024-12-29T10:30:00Z",
        "completed_at": "2024-12-29T10:31:45Z"
      }
    ],
    "pagination": {
      "total": 45,
      "limit": 10,
      "offset": 0,
      "has_more": true
    }
  }
}
```

### Real-Time Progress Tracking

Monitor audit progress in real-time using Server-Sent Events (SSE).

**GET** `/audits/{audit_id}/progress`

```javascript
const eventSource = new EventSource(
  'https://api.neon-seo-beacon.com/v1/audits/audit_abc123/progress',
  {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY'
    }
  }
);

eventSource.onmessage = function(event) {
  const progress = JSON.parse(event.data);
  console.log('Progress:', progress);
};

eventSource.onerror = function(event) {
  console.error('SSE Error:', event);
};
```

**Progress Event Data:**
```json
{
  "audit_id": "audit_abc123",
  "step": 3,
  "total_steps": 5,
  "message": "Analyzing technical SEO",
  "percentage": 60,
  "timestamp": "2024-12-29T10:31:00Z"
}
```

### Bulk Operations

Process multiple URLs efficiently with bulk operations.

#### Bulk Analysis

**POST** `/seo/analyze/bulk`

```json
{
  "urls": [
    "https://example.com",
    "https://example.com/about",
    "https://example.com/contact"
  ],
  "options": {
    "includeImages": true,
    "checkMobile": true
  },
  "webhook_url": "https://yourapp.com/webhooks/bulk-complete"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "batch_id": "batch_xyz789",
    "status": "processing",
    "total_urls": 3,
    "estimated_completion": "2024-12-29T10:35:00Z"
  }
}
```

#### Get Bulk Results

**GET** `/seo/analyze/bulk/{batch_id}`

```json
{
  "success": true,
  "data": {
    "batch_id": "batch_xyz789",
    "status": "completed",
    "total_urls": 3,
    "completed_urls": 3,
    "failed_urls": 0,
    "results": [
      {
        "url": "https://example.com",
        "score": 85,
        "analysis": { /* full analysis */ }
      },
      {
        "url": "https://example.com/about",
        "score": 78,
        "analysis": { /* full analysis */ }
      }
    ]
  }
}
```

## Webhooks

Configure webhooks to receive real-time notifications when audits complete.

### Webhook Configuration

Set webhook URLs when creating audits or configure default webhooks in your account settings.

### Webhook Payload

**Audit Complete Event:**
```json
{
  "event": "audit.completed",
  "timestamp": "2024-12-29T10:32:00Z",
  "data": {
    "audit_id": "audit_abc123",
    "url": "https://example.com",
    "status": "completed",
    "score": 85,
    "processing_time": 120000,
    "results_url": "https://api.neon-seo-beacon.com/v1/audits/audit_abc123"
  }
}
```

**Audit Failed Event:**
```json
{
  "event": "audit.failed",
  "timestamp": "2024-12-29T10:32:00Z",
  "data": {
    "audit_id": "audit_abc123",
    "url": "https://example.com",
    "status": "failed",
    "error": "URL not accessible",
    "error_code": "URL_NOT_ACCESSIBLE"
  }
}
```

### Webhook Security

Verify webhook authenticity using the signature header:

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

## Error Handling

### HTTP Status Codes

- `200`: Success
- `400`: Bad Request (invalid parameters)
- `401`: Unauthorized (invalid API key)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `429`: Rate Limit Exceeded
- `500`: Internal Server Error

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "INVALID_URL",
    "message": "The provided URL is not valid or accessible",
    "details": {
      "url": "invalid-url",
      "reason": "Invalid URL format"
    }
  }
}
```

### Common Error Codes

- `INVALID_API_KEY`: API key is missing or invalid
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INVALID_URL`: URL format is incorrect
- `URL_NOT_ACCESSIBLE`: URL cannot be reached
- `PROCESSING_FAILED`: Analysis could not be completed
- `INSUFFICIENT_CREDITS`: Account has no remaining credits

## SDK and Libraries

### Official SDKs

**Node.js SDK:**
```bash
npm install @neon-seo-beacon/node-sdk
```

```javascript
const NeonSEO = require('@neon-seo-beacon/node-sdk');

const client = new NeonSEO({
  apiKey: 'YOUR_API_KEY'
});

// Analyze URL
const analysis = await client.analyze('https://example.com');
console.log('SEO Score:', analysis.score);

// Create audit with progress tracking
const audit = await client.createAudit('https://example.com');
audit.onProgress((progress) => {
  console.log(`Progress: ${progress.percentage}%`);
});
```

**Python SDK:**
```bash
pip install neon-seo-beacon
```

```python
from neon_seo_beacon import NeonSEO

client = NeonSEO(api_key='YOUR_API_KEY')

# Analyze URL
analysis = client.analyze('https://example.com')
print(f"SEO Score: {analysis.score}")

# Bulk analysis
results = client.bulk_analyze([
    'https://example.com',
    'https://example.com/about'
])
```

### Community Libraries

- **PHP**: `neon-seo/php-sdk`
- **Ruby**: `neon-seo-beacon-ruby`
- **Go**: `neon-seo-beacon/go-client`
- **Java**: `com.neonseo.beacon-client`

## Integration Examples

### WordPress Plugin Integration

```php
<?php
function neon_seo_analyze_post($post_id) {
    $url = get_permalink($post_id);
    $api_key = get_option('neon_seo_api_key');
    
    $response = wp_remote_post('https://api.neon-seo-beacon.com/v1/seo/analyze', [
        'headers' => [
            'Authorization' => 'Bearer ' . $api_key,
            'Content-Type' => 'application/json'
        ],
        'body' => json_encode([
            'url' => $url,
            'options' => [
                'includeImages' => true,
                'checkMobile' => true
            ]
        ])
    ]);
    
    if (is_wp_error($response)) {
        return false;
    }
    
    $data = json_decode(wp_remote_retrieve_body($response), true);
    update_post_meta($post_id, 'seo_score', $data['data']['score']);
    
    return $data['data'];
}
?>
```

### Continuous Integration

```yaml
# GitHub Actions workflow
name: SEO Audit
on:
  pull_request:
    paths: ['src/**', 'content/**']

jobs:
  seo-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to staging
        run: ./deploy-staging.sh
        
      - name: Run SEO Audit
        run: |
          curl -X POST \
            -H "Authorization: Bearer ${{ secrets.NEON_SEO_API_KEY }}" \
            -H "Content-Type: application/json" \
            -d '{"url": "https://staging.example.com"}' \
            https://api.neon-seo-beacon.com/v1/seo/analyze \
            | jq '.data.score'
```

### Custom Dashboard Integration

```javascript
// React component for SEO dashboard
import React, { useState, useEffect } from 'react';

function SEODashboard() {
  const [audits, setAudits] = useState([]);
  
  useEffect(() => {
    fetchAudits();
  }, []);
  
  const fetchAudits = async () => {
    const response = await fetch('/api/neon-seo/audits', {
      headers: {
        'Authorization': `Bearer ${process.env.NEON_SEO_API_KEY}`
      }
    });
    const data = await response.json();
    setAudits(data.data.audits);
  };
  
  const createAudit = async (url) => {
    const response = await fetch('/api/neon-seo/audits', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEON_SEO_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    });
    
    if (response.ok) {
      fetchAudits();
    }
  };
  
  return (
    <div>
      <h2>SEO Dashboard</h2>
      {audits.map(audit => (
        <div key={audit.id}>
          <h3>{audit.url}</h3>
          <p>Score: {audit.score}</p>
          <p>Status: {audit.status}</p>
        </div>
      ))}
    </div>
  );
}
```

## Best Practices

### API Usage Guidelines

1. **Cache Results**: Store analysis results to avoid redundant API calls
2. **Handle Rate Limits**: Implement exponential backoff for rate limit errors
3. **Use Webhooks**: Prefer webhooks over polling for long-running operations
4. **Validate URLs**: Check URL format before sending API requests
5. **Monitor Usage**: Track API usage to stay within plan limits

### Performance Optimization

```javascript
// Batch multiple URLs for efficiency
const batchAnalysis = async (urls) => {
  const batches = [];
  const batchSize = 10;
  
  for (let i = 0; i < urls.length; i += batchSize) {
    batches.push(urls.slice(i, i + batchSize));
  }
  
  const results = await Promise.all(
    batches.map(batch => 
      client.bulkAnalyze(batch)
    )
  );
  
  return results.flat();
};
```

### Error Recovery

```javascript
const analyzeWithRetry = async (url, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await client.analyze(url);
    } catch (error) {
      if (error.code === 'RATE_LIMIT_EXCEEDED') {
        await new Promise(resolve => 
          setTimeout(resolve, Math.pow(2, i) * 1000)
        );
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
};
```

## Support and Resources

### Documentation
- **API Reference**: Complete endpoint documentation
- **SDK Documentation**: Language-specific implementation guides
- **Integration Examples**: Real-world usage patterns
- **Best Practices**: Optimization and security guidelines

### Support Channels
- **Email**: api-support@neon-seo-beacon.com
- **Developer Forum**: https://community.neon-seo-beacon.com
- **GitHub Issues**: https://github.com/neon-seo-beacon/api-issues
- **Live Chat**: Available in dashboard for technical questions

### Rate Limit Information
- Monitor usage in your dashboard
- Upgrade plans for higher limits
- Contact sales for enterprise solutions
- Use webhooks to reduce polling

Start building powerful SEO integrations with the Neon SEO Beacon API today!

---

*Need help getting started? Contact our developer support team or check out our comprehensive SDK documentation and examples.*