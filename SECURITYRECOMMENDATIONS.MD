# Security Recommendations Implementation Guide

## Critical Security Issues

### 1. Session Management (SEVERE)
**Location**: Express Gateway
**File**: `server/routes.ts`
**Current Implementation**:
```typescript
app.use(
  session({
    store: new MemoryStore({ 
      checkPeriod: 86400000
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);
```

**Recommendation**:
```typescript
import RedisStore from "connect-redis"
import { createClient } from "redis"

const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: process.env.NODE_ENV === 'production'
  }
});

app.use(
  session({
    store: new RedisStore({ 
      client: redisClient,
      prefix: "sess:",
      ttl: 86400 // 24 hours
    }),
    secret: process.env.SESSION_SECRET,
    name: '__Host-sid', // Cookies with __Host- prefix must be secure
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
      domain: process.env.COOKIE_DOMAIN
    }
  })
);
```

### 2. Internal API Security (SEVERE)
**Location**: Service B
**File**: `services/service-b/src/utils/service-client.ts`
**Current Implementation**:
```typescript
const verifyUser = async (userId: number) => {
  const response = await fetch(
    `${SERVICE_A_URL}/internal/verify/${userId}`,
    {
      headers: {
        'X-Internal-API-Key': INTERNAL_API_KEY
      }
    }
  );
  return response.ok;
};
```

**Recommendation**:
```typescript
import { sign } from 'jsonwebtoken';

interface ServiceToken {
  service: string;
  timestamp: number;
  nonce: string;
}

const generateServiceToken = () => {
  const payload: ServiceToken = {
    service: 'service-b',
    timestamp: Date.now(),
    nonce: crypto.randomBytes(16).toString('hex')
  };
  return sign(payload, process.env.SERVICE_JWT_SECRET, { expiresIn: '5m' });
};

const verifyUser = async (userId: number) => {
  const token = generateServiceToken();
  const response = await fetch(
    `${SERVICE_A_URL}/internal/verify/${userId}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Service-Name': 'service-b',
        'X-Request-ID': crypto.randomUUID()
      }
    }
  );
  
  if (!response.ok) {
    logger.error({
      event: 'service_auth_failed',
      service: 'service-a',
      status: response.status,
      userId
    });
    throw new Error('Service authentication failed');
  }
  
  return response.json();
};
```

### 3. Rate Limiting (HIGH)
**Location**: Service A
**File**: `services/service_a/src/routes.py`
**Current Implementation**:
```python
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    # No rate limiting on login attempts
    user = User.query.filter_by(username=data['username']).first()
    if user and user.verify_password(data['password']):
        return jsonify({"token": generate_token(user)})
    return jsonify({"error": "Invalid credentials"}), 401
```

**Recommendation**:
```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    storage_uri="redis://localhost:6379",
    strategy="fixed-window-elastic-expiry"
)

@app.route('/api/login', methods=['POST'])
@limiter.limit("5 per minute")
@limiter.limit("20 per hour")
def login():
    data = request.get_json()
    try:
        username = data['username']
        password = data['password']
    except KeyError:
        return jsonify({"error": "Invalid request"}), 400
        
    user = User.query.filter_by(username=username).first()
    if not user:
        # Use constant time comparison to prevent timing attacks
        dummy_hash = 'dummy_hash'
        werkzeug.security.check_password_hash(dummy_hash, password)
        return jsonify({"error": "Invalid credentials"}), 401
        
    if user.verify_password(password):
        logger.info(f"Successful login for user: {username}")
        return jsonify({"token": generate_token(user)})
    
    logger.warning(f"Failed login attempt for user: {username}")
    return jsonify({"error": "Invalid credentials"}), 401
```

## High Priority Issues

### 1. Database Security
**Location**: Service A
**File**: `services/service_a/src/models.py`
**Current Implementation**:
```python
@staticmethod
def create(username: str, email: str, password: str) -> 'User':
    return User(username=username, email=email, password=password)
```

**Recommendation**:
```python
from email_validator import validate_email, EmailNotValidError
import re
from typing import Optional, Tuple

class UserValidationError(Exception):
    pass

class User(db.Model):
    @staticmethod
    def validate_password(password: str) -> Tuple[bool, Optional[str]]:
        if len(password) < 12:
            return False, "Password must be at least 12 characters long"
        if not re.search(r'[A-Z]', password):
            return False, "Password must contain at least one uppercase letter"
        if not re.search(r'[a-z]', password):
            return False, "Password must contain at least one lowercase letter"
        if not re.search(r'\d', password):
            return False, "Password must contain at least one number"
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            return False, "Password must contain at least one special character"
        return True, None

    @staticmethod
    def create(username: str, email: str, password: str) -> 'User':
        # Validate username
        if not re.match(r'^[a-zA-Z0-9_]{3,30}$', username):
            raise UserValidationError("Username must be 3-30 characters and contain only letters, numbers, and underscores")
            
        # Validate email
        try:
            validated_email = validate_email(email).email
        except EmailNotValidError as e:
            raise UserValidationError(f"Invalid email address: {str(e)}")
            
        # Validate password
        is_valid, error = User.validate_password(password)
        if not is_valid:
            raise UserValidationError(error)
            
        # Check for existing users
        if User.query.filter_by(username=username).first():
            raise UserValidationError("Username already exists")
        if User.query.filter_by(email=email).first():
            raise UserValidationError("Email already registered")
            
        return User(
            username=username,
            email=validated_email,
            password_hash=generate_password_hash(
                password,
                method='pbkdf2:sha256:600000',
                salt_length=16
            )
        )
```

### 2. CSRF Protection
**Location**: Express Gateway
**File**: `server/routes.ts`
**Current Implementation**:
Missing CSRF protection

**Recommendation**:
```typescript
import csrf from 'csurf';

// CSRF protection middleware
const csrfProtection = csrf({
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: true,
    httpOnly: true
  }
});

// Apply to all routes that modify state
app.post('/api/*', csrfProtection, (req, res, next) => {
  next();
});
app.put('/api/*', csrfProtection, (req, res, next) => {
  next();
});
app.delete('/api/*', csrfProtection, (req, res, next) => {
  next();
});

// Provide CSRF token to frontend
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});
```

### 3. XSS Protection
**Location**: Frontend
**File**: `client/src/components/PostViewer.tsx`
**Current Implementation**:
```typescript
const PostContent = ({ content }: { content: string }) => {
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
};
```

**Recommendation**:
```typescript
import DOMPurify from 'dompurify';
import { marked } from 'marked';

const PostContent = ({ content }: { content: string }) => {
  // Configure marked for safe markdown rendering
  marked.setOptions({
    sanitize: true,
    sanitizer: DOMPurify.sanitize,
    headerIds: false,
    gfm: true
  });

  // Sanitize and convert markdown to HTML
  const sanitizedHtml = marked(DOMPurify.sanitize(content));

  return (
    <div 
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }} 
    />
  );
};

// Usage in components
const PostViewer = ({ post }: { post: Post }) => {
  return (
    <article className="rounded-lg border p-4">
      <h2 className="text-xl font-bold">{post.title}</h2>
      <PostContent content={post.content} />
    </article>
  );
};
```

## Implementation Timeline

### Phase 1 (Immediate - Week 1)
1. Replace MemoryStore with Redis session store
2. Implement rate limiting on authentication endpoints
3. Add CSRF protection to all state-changing endpoints
4. Update password hashing configuration
5. Add input validation to user creation

### Phase 2 (Week 2)
1. Implement service-to-service JWT authentication
2. Add comprehensive XSS protection
3. Configure security headers
4. Implement audit logging

### Phase 3 (Week 3-4)
1. Set up monitoring and alerting
2. Implement automated security scanning
3. Add dependency audit to CI/CD
4. Create security incident response procedures

## Required Dependencies
```json
{
  "dependencies": {
    "connect-redis": "^7.0.0",
    "redis": "^4.0.0",
    "csurf": "^1.11.0",
    "helmet": "^5.0.0",
    "dompurify": "^3.0.0",
    "marked": "^5.0.0",
    "express-rate-limit": "^6.0.0",
    "jsonwebtoken": "^9.0.0"
  },
  "devDependencies": {
    "@types/csurf": "^1.11.0",
    "@types/dompurify": "^3.0.0",
    "@types/marked": "^5.0.0"
  }
}
```

## Environment Variables Required
```bash
# Session Management
REDIS_URL=redis://localhost:6379
SESSION_SECRET=<strong-random-secret>
COOKIE_DOMAIN=example.com

# Service Authentication
SERVICE_JWT_SECRET=<strong-random-secret>
INTERNAL_API_KEY=<to-be-deprecated>

# Security Headers
CORS_ORIGIN=https://example.com
CSP_DIRECTIVES=default-src 'self';

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Monitoring and Alerts Setup
1. Configure error monitoring with Sentry
2. Set up security-focused logging
3. Create alerts for:
   - Failed authentication attempts
   - Rate limit breaches
   - Invalid service-to-service calls
   - Database connection issues

## Security Headers Configuration
```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.example.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'none'"],
      frameSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginResourcePolicy: { policy: "same-site" },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: "deny" },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  xssFilter: true,
  noSniff: true
}));
```

## Regular Security Maintenance
1. Weekly dependency updates
2. Monthly security scanning
3. Quarterly penetration testing
4. Bi-annual security training
5. Annual security audit

Remember to implement these changes incrementally and test thoroughly in a staging environment before deploying to production.
