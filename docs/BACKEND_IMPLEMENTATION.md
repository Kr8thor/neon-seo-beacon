# 🔧 Backend API Implementation Guide

**Version**: 1.0.0  
**Target Framework**: Nuxt 3 Server Routes  
**Database**: Supabase (PostgreSQL)

## Quick Start

1. **Environment Setup**
   - Copy `.env.example` to `.env.local`
   - Add Supabase credentials
   - Add JWT_SECRET (min 32 chars)

2. **Database Setup**
   ```bash
   npx supabase link --project-ref your-project-id
   npx supabase db push
   ```

3. **Run Dev Server**
   ```bash
   npm run dev
   # API available at http://localhost:3000/api
   ```

## Project Structure

```
server/
├── api/                  # Route handlers
│   ├── auth/            # Authentication endpoints
│   ├── organizations/   # Organization management
│   ├── audits/         # Audit endpoints
│   └── ...
├── middleware/          # Auth, rate limiting, error handling
├── utils/              # Database, auth utilities, services
└── utils.ts            # Nuxt server utilities
```

## Route File Naming

| File | Route | Method |
|------|-------|--------|
| `index.get.ts` | GET /api/... | GET |
| `index.post.ts` | POST /api/... | POST |
| `[id].get.ts` | GET /api/.../123 | GET |
| `[id].patch.ts` | PATCH /api/.../123 | PATCH |
| `[id].delete.ts` | DELETE /api/.../123 | DELETE |

## Authentication Pattern

```typescript
// Get authenticated user
const user = await requireAuth(event);

// Check authorization
if (user.org_id !== resource.org_id) {
  throw new AuthorizationError();
}
```

## Error Handling

```typescript
// Custom errors
throw new ValidationError('Invalid input', details);
throw new AuthorizationError();
throw new NotFoundError('User', userId);
throw new ConflictError('Resource already exists');
```

## Database Models

Key tables:
- `users` - User accounts
- `organizations` - User organizations
- `websites` - Tracked websites
- `audits` - SEO audits
- `findings` - Audit findings
- `pages` - Crawled pages
- `recommendations` - AI suggestions

## Testing

```bash
npm run test:unit              # Unit tests
npm run test:integration       # Integration tests
npm run test:ci                # Full CI pipeline
```

## Deployment

- [ ] Environment variables set
- [ ] Database migrations complete
- [ ] Tests passing
- [ ] Security audit passed
- [ ] Rate limiting configured
- [ ] Monitoring setup

## Documentation

Full details in:
- `docs/API_SPECIFICATION.md` - Complete endpoint reference
- `docs/openapi.yaml` - OpenAPI 3.0 spec
- `docs/BACKEND_IMPLEMENTATION.md` - Detailed implementation guide

## Next Steps

1. Implement auth endpoints (signup, login, logout)
2. Set up organization CRUD
3. Create website management
4. Build audit endpoints
5. Add finding/recommendation endpoints