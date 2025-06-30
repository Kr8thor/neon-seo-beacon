# API Reference

*Integrate Neon SEO Beacon into your applications*

## 🔐 Authentication

All API requests require authentication using your API key:

```bash
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

Get your API key from the dashboard: **Settings > API Keys**

## 🔍 SEO Analysis API

### Analyze Website
Perform a comprehensive SEO audit of any website.

**Endpoint:** `POST /api/seo/analyze`

**Request Body:**
```json
{
  "url": "https://example.com",
  "options": {
    "includeImages": true,
    "checkMobile": true,
    "includePerformance": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://example.com",
    "title": "Page Title",
    "score": 85,
    "performance": {
      "loadTime": 1200,
      "coreWebVitals": {...}
    },
    "technical": {...},
    "content": {...},
    "recommendations": [...]
  }
}
```

## 📊 Audit Management

### Create Audit
Start a new SEO audit with real-time progress tracking.

**Endpoint:** `POST /api/audits`

**Request:**
```json
{
  "url": "https://example.com",
  "type": "comprehensive"
}
```

### Get Audit Results
Retrieve completed audit results.

**Endpoint:** `GET /api/audits/{id}`

**Response:**
```json
{
  "id": "uuid",
  "url": "https://example.com",
  "status": "completed",
  "score": 85,
  "results": {...}
}
```

## ⚡ Rate Limits

- **Free Plan**: 100 requests/hour
- **Pro Plan**: 1,000 requests/hour  
- **Enterprise**: Custom limits

## 🔧 Error Handling

```json
{
  "error": {
    "code": "INVALID_URL",
    "message": "The provided URL is not valid",
    "details": {}
  }
}
```

---

*Need help? Contact support for integration assistance.*