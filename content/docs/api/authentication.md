---
title: "API Authentication"
description: "Learn how to authenticate with the Neon SEO Beacon API"
category: "API"
---

# API Authentication

The Neon SEO Beacon API uses JWT (JSON Web Tokens) for authentication. This guide covers how to obtain and use authentication tokens.

## Getting Started

### 1. Obtain API Credentials

1. Log in to your Neon SEO Beacon dashboard
2. Navigate to Settings > API Keys
3. Click "Generate New API Key"
4. Copy your API key and secret

### 2. Generate Access Token

Use your API credentials to obtain a JWT token:

```http
POST /api/auth/token
Content-Type: application/json

{
  "api_key": "your_api_key",
  "api_secret": "your_api_secret"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

### 3. Use the Token

Include the token in all API requests:

```http
GET /api/audits
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Authentication Methods

### JWT Tokens (Recommended)

**Advantages:**

- Secure and stateless
- Contains user information
- Automatic expiration
- No server-side session storage needed

**Usage:**

```javascript
const token = "your_jwt_token";

fetch("/api/audits", {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
```

### API Key (Simple)

For server-to-server communication:

```http
GET /api/audits
X-API-Key: your_api_key
```

## Token Management

### Token Expiration

- Access tokens expire after 1 hour
- Refresh tokens are valid for 30 days
- Check the `expires_in` field in the response

### Refreshing Tokens

When your access token expires, use the refresh token:

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refresh_token": "your_refresh_token"
}
```

**Response:**

```json
{
  "access_token": "new_access_token",
  "expires_in": 3600
}
```

### Revoking Tokens

Revoke a token when no longer needed:

```http
POST /api/auth/revoke
Authorization: Bearer your_token
```

## Rate Limiting

API requests are rate limited based on your plan:

- **Free Plan**: 100 requests/hour
- **Pro Plan**: 1,000 requests/hour
- **Agency Plan**: 10,000 requests/hour

### Rate Limit Headers

Each response includes rate limiting information:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

### Handling Rate Limits

When you exceed the rate limit:

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 3600

{
  "error": "rate_limit_exceeded",
  "message": "Rate limit exceeded. Try again in 1 hour."
}
```

## Security Best Practices

### Token Storage

- Store tokens securely (environment variables, secure storage)
- Never expose tokens in client-side code
- Use HTTPS for all API requests
- Rotate API keys regularly

### Error Handling

```javascript
async function makeAuthenticatedRequest(url, token) {
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      // Token expired or invalid
      throw new Error("Authentication failed");
    }

    if (response.status === 429) {
      // Rate limit exceeded
      const retryAfter = response.headers.get("Retry-After");
      throw new Error(`Rate limit exceeded. Retry after ${retryAfter} seconds`);
    }

    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}
```

## Code Examples

### JavaScript/Node.js

```javascript
class NeonSEOAPI {
  constructor(apiKey, apiSecret) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.baseURL = "https://api.neonseobeacon.com";
    this.token = null;
  }

  async authenticate() {
    const response = await fetch(`${this.baseURL}/api/auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: this.apiKey,
        api_secret: this.apiSecret,
      }),
    });

    const data = await response.json();
    this.token = data.access_token;
    return this.token;
  }

  async makeRequest(endpoint, options = {}) {
    if (!this.token) {
      await this.authenticate();
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (response.status === 401) {
      // Token expired, re-authenticate
      await this.authenticate();
      return this.makeRequest(endpoint, options);
    }

    return response.json();
  }
}

// Usage
const api = new NeonSEOAPI("your_api_key", "your_api_secret");
const audits = await api.makeRequest("/api/audits");
```

### Python

```python
import requests
import time
from datetime import datetime, timedelta

class NeonSEOAPI:
    def __init__(self, api_key, api_secret):
        self.api_key = api_key
        self.api_secret = api_secret
        self.base_url = 'https://api.neonseobeacon.com'
        self.token = None
        self.token_expires = None

    def authenticate(self):
        response = requests.post(f'{self.base_url}/api/auth/token', json={
            'api_key': self.api_key,
            'api_secret': self.api_secret
        })

        data = response.json()
        self.token = data['access_token']
        self.token_expires = datetime.now() + timedelta(seconds=data['expires_in'])

        return self.token

    def make_request(self, endpoint, method='GET', **kwargs):
        if not self.token or datetime.now() >= self.token_expires:
            self.authenticate()

        headers = kwargs.get('headers', {})
        headers['Authorization'] = f'Bearer {self.token}'
        kwargs['headers'] = headers

        response = requests.request(method, f'{self.base_url}{endpoint}', **kwargs)

        if response.status_code == 401:
            # Token expired, re-authenticate
            self.authenticate()
            headers['Authorization'] = f'Bearer {self.token}'
            response = requests.request(method, f'{self.base_url}{endpoint}', **kwargs)

        return response.json()

# Usage
api = NeonSEOAPI('your_api_key', 'your_api_secret')
audits = api.make_request('/api/audits')
```

## Testing Authentication

Use this endpoint to test your authentication:

```http
GET /api/auth/me
Authorization: Bearer your_token
```

**Response:**

```json
{
  "user_id": "12345",
  "email": "user@example.com",
  "plan": "pro",
  "api_key_id": "api_key_123"
}
```

## Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Check if token is valid and not expired
   - Verify API key and secret are correct
   - Ensure token is included in Authorization header

2. **403 Forbidden**
   - Check if your plan allows the requested operation
   - Verify API key has necessary permissions

3. **429 Rate Limited**
   - Wait for the time specified in Retry-After header
   - Consider upgrading your plan for higher limits

### Debug Mode

Enable debug mode to see detailed authentication logs:

```http
GET /api/audits
Authorization: Bearer your_token
X-Debug: true
```

---

_Need help with authentication? Contact our support team at api-support@neonseobeacon.com_
