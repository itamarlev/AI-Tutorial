# Deployment Guide

This guide covers deploying AI Tutorial to various hosting platforms.

## Table of Contents

- [Vercel (Recommended)](#vercel-recommended)
- [Netlify](#netlify)
- [AWS Amplify](#aws-amplify)
- [GitHub Pages](#github-pages)
- [Docker](#docker)
- [Custom Server](#custom-server)

---

## Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications and is the recommended platform for AI Tutorial.

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ai-tutorial)

### Manual Deployment

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Configure Environment Variables** (optional, for AI features):
   - Go to your project settings on Vercel
   - Add environment variables:
     - `ANTHROPIC_API_KEY`
     - `OPENAI_API_KEY`

5. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

### GitHub Integration

1. Connect your GitHub repository to Vercel
2. Every push to `main` triggers automatic deployment
3. Preview deployments for pull requests

---

## Netlify

### Quick Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/ai-tutorial)

### Manual Deployment

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

3. **Login**:
   ```bash
   netlify login
   ```

4. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

### Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## AWS Amplify

### Deployment Steps

1. **Login to AWS Console**
2. **Navigate to AWS Amplify**
3. **Connect Repository**:
   - Choose GitHub/GitLab/Bitbucket
   - Authorize and select repository
   - Select branch (main)

4. **Build Settings**:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

5. **Environment Variables** (optional):
   - Add in Amplify Console
   - `ANTHROPIC_API_KEY`
   - `OPENAI_API_KEY`

6. **Deploy**

---

## GitHub Pages

**Note**: GitHub Pages doesn't support Next.js server-side features. Use static export.

### Configuration

1. **Update `next.config.ts`**:
   ```typescript
   const nextConfig = {
     output: 'export',
     images: {
       unoptimized: true,
     },
     basePath: '/ai-tutorial', // Replace with your repo name
     assetPrefix: '/ai-tutorial/',
   };
   ```

2. **Add `.nojekyll` file**:
   ```bash
   touch public/.nojekyll
   ```

3. **Build**:
   ```bash
   npm run build
   ```

4. **Deploy**:
   ```bash
   # Install gh-pages
   npm install -g gh-pages

   # Deploy
   gh-pages -d out
   ```

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Export
        run: npx next export

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

---

## Docker

### Dockerfile

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    restart: unless-stopped
```

### Build and Run

```bash
# Build image
docker build -t ai-tutorial .

# Run container
docker run -p 3000:3000 ai-tutorial

# Or with docker-compose
docker-compose up -d
```

---

## Custom Server

### Prerequisites

- Node.js 18+
- PM2 or similar process manager
- Nginx or Apache (optional, for reverse proxy)

### Deployment Steps

1. **Clone repository on server**:
   ```bash
   git clone https://github.com/yourusername/ai-tutorial.git
   cd ai-tutorial
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build**:
   ```bash
   npm run build
   ```

4. **Start with PM2**:
   ```bash
   npm install -g pm2
   pm2 start npm --name "ai-tutorial" -- start
   pm2 save
   pm2 startup
   ```

### Nginx Configuration

Create `/etc/nginx/sites-available/ai-tutorial`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and restart:

```bash
sudo ln -s /etc/nginx/sites-available/ai-tutorial /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## Environment Variables

For production deployments with AI features, set these environment variables:

```bash
# Required for AI features
ANTHROPIC_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here

# Optional
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### Platform-Specific Setup

**Vercel/Netlify/Amplify**:
- Add in project settings dashboard
- Don't commit to `.env.local`

**Docker**:
- Use `.env` file with docker-compose
- Or pass via `-e` flag: `docker run -e ANTHROPIC_API_KEY=...`

**Custom Server**:
- Create `.env.local` on server
- Or export in shell profile

---

## Post-Deployment

### Verification Checklist

- [ ] App loads without errors
- [ ] All pages are accessible
- [ ] Responsive design works on mobile
- [ ] localStorage persists data
- [ ] Animations and transitions work
- [ ] Screenshots display correctly
- [ ] API routes respond (if AI enabled)
- [ ] Performance is acceptable (Lighthouse score)

### Monitoring

Set up monitoring for:
- **Uptime** - UptimeRobot, Pingdom
- **Performance** - Vercel Analytics, Google Analytics
- **Errors** - Sentry, LogRocket
- **API Usage** - Anthropic/OpenAI dashboards

### Updates

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Rebuild
npm run build

# Restart (PM2 example)
pm2 restart ai-tutorial

# Or redeploy
vercel --prod
```

---

## Troubleshooting

### Build Failures

**Issue**: `npm run build` fails

**Solution**:
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variables Not Working

**Issue**: API keys not recognized

**Solution**:
- Verify variable names (exact match)
- Restart server/redeploy after adding
- Check platform-specific docs

### 404 Errors on Routes

**Issue**: Direct URLs return 404

**Solution**:
- Configure redirects (see platform sections)
- Ensure `output: 'standalone'` not `'export'` for dynamic routes

### Performance Issues

**Issue**: Slow load times

**Solution**:
- Enable CDN (automatic on Vercel/Netlify)
- Optimize images (Next.js Image component)
- Enable caching headers
- Use production build (`NODE_ENV=production`)

---

## Support

For deployment issues:
- Check [Next.js deployment docs](https://nextjs.org/docs/deployment)
- Review platform-specific documentation
- Open an issue on GitHub

Happy deploying! 🚀
