# Environment Setup Guide

## Overview
This document provides detailed instructions for setting up both development and production environments for the Multi-Service Application Framework.

## Development Environment

### Prerequisites Installation

#### 1. Node.js (v20.x)
```bash
# Using nvm (recommended)
nvm install 20
nvm use 20

# Or download directly from nodejs.org
```

#### 2. Python (3.11)
```bash
# Linux/macOS
sudo apt-get update  # Ubuntu/Debian
sudo apt-get install python3.11 python3.11-venv python3-pip

# Windows
# Download Python 3.11 installer from python.org
```

#### 3. .NET Core (7.0)
```bash
# Linux/macOS
wget https://dot.net/v1/dotnet-install.sh
chmod +x dotnet-install.sh
./dotnet-install.sh --channel 7.0

# Windows
# Download .NET 7.0 SDK from microsoft.com/net/download
```

#### 4. SQLite3
```bash
# Linux/macOS
sudo apt-get install sqlite3  # Ubuntu/Debian
brew install sqlite  # macOS

# Windows
# Download SQLite tools from sqlite.org
```

### Environment Variables
Create a `.env` file in the project root:

```env
# Development Environment
NODE_ENV=development
PORT=5000

# Service URLs
SERVICE_A_URL=http://localhost:5001
SERVICE_B_URL=http://localhost:5002
SERVICE_C_URL=http://localhost:5003

# Security
SESSION_SECRET=your_strong_session_secret
INTERNAL_API_KEY=your_internal_api_key

# Database
DATABASE_URL=sqlite:///dev.db

# Frontend
VITE_API_URL=http://localhost:5000
```

### Database Setup
```bash
# Initialize databases
npm run db:setup

# Run migrations
npm run db:migrate
```

## Production Environment

### System Requirements
- 4+ CPU cores
- 8GB+ RAM
- 20GB+ storage
- Ubuntu 20.04 LTS or newer

### Prerequisites

#### 1. Nginx Installation
```bash
sudo apt-get update
sudo apt-get install nginx
```

#### 2. Redis Setup
```bash
sudo apt-get install redis-server
sudo systemctl enable redis-server
```

#### 3. PostgreSQL (Recommended for Production)
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl enable postgresql
```

### Production Environment Variables
Create a `.env.production` file:

```env
# Production Environment
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Redis
REDIS_URL=redis://localhost:6379

# Security
SESSION_SECRET=your_very_strong_production_secret
INTERNAL_API_KEY=your_production_internal_api_key
COOKIE_DOMAIN=yourdomain.com

# Service URLs
SERVICE_A_URL=http://localhost:5001
SERVICE_B_URL=http://localhost:5002
SERVICE_C_URL=http://localhost:5003

# Frontend
VITE_API_URL=https://api.yourdomain.com
```

### SSL/TLS Setup
1. Install Certbot:
```bash
sudo apt-get install certbot python3-certbot-nginx
```

2. Obtain SSL certificate:
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Nginx Configuration
Create `/etc/nginx/sites-available/multiservice-app`:

```nginx
upstream frontend {
    server localhost:5000;
}

upstream service_a {
    server localhost:5001;
}

upstream service_b {
    server localhost:5002;
}

upstream service_c {
    server localhost:5003;
}

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API endpoints
    location /api/ {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Process Management
Install PM2:
```bash
npm install -g pm2
```

Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [
    {
      name: 'frontend',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'service-a',
      script: 'python',
      args: 'services/service_a/src/main.py',
      interpreter: 'python3'
    },
    {
      name: 'service-b',
      script: 'npm',
      args: 'run start:service-b',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'service-c',
      script: 'dotnet',
      args: 'run --project services/service-c/ServiceC.Api'
    }
  ]
};
```

### Monitoring Setup
1. Install Node exporter for Prometheus
2. Configure Prometheus
3. Set up Grafana dashboards

## Maintenance

### Backup Strategy
1. Database backups:
```bash
# PostgreSQL
pg_dump dbname > backup.sql

# SQLite
sqlite3 database.sqlite ".backup 'backup.sqlite'"
```

2. Environment variables backup:
```bash
cp .env.production .env.production.backup
```

### Log Management
Configure log rotation in `/etc/logrotate.d/multiservice-app`:
```
/var/log/multiservice-app/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        systemctl reload nginx
    endscript
}
```

## Troubleshooting

### Common Issues

1. **Service Dependencies**
   - Check services are running in correct order
   - Verify all environment variables are set
   - Check database connections

2. **Database Connectivity**
   - Verify PostgreSQL is running: `sudo systemctl status postgresql`
   - Check connection strings
   - Verify database permissions

3. **Redis Connection**
   - Check Redis status: `sudo systemctl status redis-server`
   - Verify Redis connection string
   - Monitor Redis memory usage

4. **Nginx Issues**
   - Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
   - Verify SSL certificates
   - Test Nginx configuration: `sudo nginx -t`

For more detailed troubleshooting guides, refer to service-specific documentation in the `docs` directory.
