# Neon SEO Beacon - Backend API Specification

**Version**: 1.0.0  
**Last Updated**: November 21, 2025  
**Base URL**: `https://audit.mardenseo.com/api` (Production) | `http://localhost:3000/api` (Development)  
**Authentication**: JWT Bearer Token  
**API Format**: RESTful JSON  
**Rate Limit**: 100 requests/minute per API key

---

## Quick Links

- **[Full API Specification](./docs/API_SPECIFICATION.md)** - Detailed endpoint documentation
- **[OpenAPI/Swagger Spec](./docs/openapi.yaml)** - Machine-readable API definition
- **[API Client Guide](./docs/API_CLIENT_GUIDE.md)** - Implementation examples
- **[TypeScript Types](./types/api.types.ts)** - Type definitions for all endpoints

## Table of Contents

1. [Authentication](#authentication)
2. [Core Endpoints](#core-endpoints)
3. [Error Handling](#error-handling)
4. [Data Models](#data-models)

---

## Authentication

All API endpoints (except `/health` and `/auth/*`) require authentication using JWT Bearer tokens.

### JWT Bearer Token
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Get a Token

**POST** `/auth/login`
```bash
curl -X POST https://audit.mardenseo.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123"
  }'
```

**Response**:
```json
{
  "success": true,
  "user": {
    "id": "usr_123abc",
    "email": "user@example.com",
    "name": "John Doe",
    "plan": "pro"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

---

## Core Endpoints

### Health Check (No Auth Required)

**GET** `/health`

Check API health status.

```bash
curl https://audit.mardenseo.com/api/health
```

### Audits

#### Create Audit
**POST** `/audits`

```bash
curl -X POST https://audit.mardenseo.com/api/audits \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "auditType": "full"
  }'
```

#### List Audits
**GET** `/audits?status=completed&limit=10&offset=0`

#### Get Audit
**GET** `/audits/{auditId}`

#### Get Audit Progress (Server-Sent Events)
**GET** `/audits/{auditId}/progress`

Returns real-time progress updates as a stream.

#### Download Report
**GET** `/audits/{auditId}/report?format=pdf`

Supported formats: `pdf`, `json`, `csv`, `html`

### Quick Analysis (No Auth Required)

**POST** `/seo/analyze`

```bash
curl -X POST https://audit.mardenseo.com/api/seo/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com"
  }'
```

---

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human-readable error message",
  "statusCode": 400,
  "timestamp": "2025-06-20T14:30:00Z",
  "requestId": "req_123abc"
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `INVALID_REQUEST` | 400 | Malformed request |
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | User doesn't have permission |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 422 | Invalid input data |
| `RATE_LIMITED` | 429 | Too many requests |
| `INVALID_URL` | 400 | URL validation failed |
| `PLAN_LIMIT_EXCEEDED` | 402 | User exceeded plan limits |

---

## Data Models

### Audit Object

```json
{
  "id": "aud_123abc",
  "url": "https://example.com",
  "auditType": "full",
  "status": "completed",
  "score": 78,
  "progress": 100,
  "createdAt": "2025-06-20T14:30:00Z",
  "completedAt": "2025-06-20T14:35:00Z",
  "findings": {
    "technical": {
      "score": 85,
      "issues": []
    }
  }
}
```

### Finding Object

```json
{
  "id": "iss_001",
  "type": "missing_meta_description",
  "severity": "high",
  "title": "Missing Meta Description",
  "description": "Found 15 pages without meta descriptions",
  "recommendation": "Add unique meta descriptions to all pages",
  "affectedPages": [
    {
      "url": "https://example.com",
      "details": "Meta description is missing"
    }
  ]
}
```

---

## Getting Started

### 1. Register an Account

```bash
curl -X POST https://audit.mardenseo.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "securepassword123",
    "name": "Jane Doe",
    "acceptTerms": true
  }'
```

### 2. Login and Get Token

```bash
curl -X POST https://audit.mardenseo.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "securepassword123"
  }'
```

### 3. Create an Audit

```bash
TOKEN="your_token_here"

curl -X POST https://audit.mardenseo.com/api/audits \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "auditType": "full"
  }'
```

### 4. Monitor Progress

```bash
AUDIT_ID="aud_123abc"

curl "https://audit.mardenseo.com/api/audits/$AUDIT_ID/progress" \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Download Results

```bash
curl "https://audit.mardenseo.com/api/audits/$AUDIT_ID/report?format=pdf" \
  -H "Authorization: Bearer $TOKEN" \
  -o audit-report.pdf
```

---

## Client Libraries

### JavaScript/TypeScript

```javascript
import { NeonSEOClient } from 'neon-seo-beacon';

const client = new NeonSEOClient({
  apiKey: 'sk_live_your_key'
});

const audit = await client.audits.create({
  url: 'https://example.com',
  auditType: 'full'
});
```

### Python

```python
from neon_seo_beacon import NeonSEOClient

client = NeonSEOClient(api_key='sk_live_your_key')

audit = client.create_audit(
    url='https://example.com',
    audit_type='full'
)

audit = client.wait_for_completion(audit['id'])
print(f"Final score: {audit['score']}")
```

---

## Rate Limiting

API requests are rate-limited based on your plan:

- **Free Plan**: 10 requests/minute
- **Pro Plan**: 100 requests/minute  
- **Team Plan**: 500 requests/minute

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1645305600
```

---

## Support

- **Interactive API Explorer**: https://audit.mardenseo.com/api/explorer
- **Status Page**: https://status.audit.mardenseo.com
- **Email Support**: support@mardenseo.com
- **GitHub Issues**: https://github.com/Kr8thor/neon-seo-beacon/issues

---

## Documentation

For complete documentation, see:
- [Full API Specification](./docs/API_SPECIFICATION.md)
- [API Client Implementation Guide](./docs/API_CLIENT_GUIDE.md)
- [OpenAPI/Swagger Specification](./docs/openapi.yaml)
- [TypeScript Type Definitions](./types/api.types.ts)

---

**Last Updated**: November 21, 2025  
**API Status**: ✅ Production Ready
