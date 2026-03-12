# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please follow these steps:

### 1. Do Not Publicly Disclose

Please **do not** create a public GitHub issue for security vulnerabilities. This could put users at risk.

### 2. Report Privately

Send an email to: **security@yourproject.com** (or create a private security advisory on GitHub)

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if you have one)

### 3. Response Time

- We will acknowledge receipt within 48 hours
- We will provide a detailed response within 7 days
- We will work with you to understand and resolve the issue

### 4. Disclosure

Once the vulnerability is fixed:
- We will credit you in the release notes (unless you prefer to remain anonymous)
- We will publish a security advisory
- We will notify users to update

## Security Best Practices

### For Users

#### API Key Security

**Never commit API keys to version control**:
- Use `.env.local` for local development
- Add `.env.local` to `.gitignore` (already included)
- Use platform environment variables for production

**Protect your API keys**:
```bash
# ✅ Good - in .env.local (not committed)
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx

# ❌ Bad - hardcoded in source
const apiKey = "sk-ant-xxxxxxxxxxxxx";  // NEVER DO THIS!
```

**Rotate compromised keys immediately**:
- If you accidentally commit a key, rotate it immediately
- Check your Git history: `git log -p | grep -i "api_key"`
- Use tools like `git-secrets` to prevent future commits

#### Browser Storage

This app uses localStorage for persistence. Be aware:
- Data is stored in plain text in your browser
- Anyone with access to your computer can read it
- Don't use shared/public computers for sensitive work
- Clear data when done: Settings > Reset All Data

#### AI Tool Integration

When connecting real AI CLIs:
- Only enable AI tools you trust
- Verify CLI tools are from official sources
- Review commands before execution
- Use read-only mode when possible

### For Developers

#### Code Security

**Input Validation**:
```typescript
// ✅ Always validate user input
if (!prompt || typeof prompt !== 'string') {
  return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 });
}
```

**XSS Prevention**:
- React automatically escapes JSX
- Be careful with `dangerouslySetInnerHTML`
- Sanitize markdown output (we use `react-markdown` which is safe)

**Command Injection Prevention**:
```typescript
// ✅ Good - we use spawn with args array
const proc = spawn(command, spawnArgs, { ... });

// ❌ Bad - using shell: true with user input
const proc = spawn(userInput, { shell: true });  // NEVER DO THIS!
```

#### Dependency Security

**Keep dependencies updated**:
```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update
```

**Review dependencies**:
- Only install necessary packages
- Check npm download counts and GitHub stars
- Review package.json for suspicious entries

#### API Route Security

Our API routes are already secured:

**Timeout Protection**:
```typescript
const TIMEOUT_MS = 120_000; // 2 minutes max
```

**Process Isolation**:
```typescript
// Processes run without shell to prevent injection
const proc = spawn(command, spawnArgs, {
  env: { ...process.env },
  stdio: ['pipe', 'pipe', 'pipe'],
});
```

**Error Handling**:
```typescript
// Don't expose internal errors to clients
const message = error.message.includes('ENOENT')
  ? `[Error: Command "${command}" not found]`
  : `[Error: ${error.message}]`;
```

#### localStorage Security

**Data Sanitization**:
```typescript
// Always parse localStorage safely
try {
  const data = JSON.parse(localStorage.getItem(key) ?? 'null');
} catch {
  // Handle corrupt data
  localStorage.removeItem(key);
}
```

**No Sensitive Data**:
- Never store passwords in localStorage
- Never store API keys in localStorage
- Only store user preferences and progress

### For Deployment

#### Environment Variables

**Production checklist**:
- [ ] API keys are in environment variables, not code
- [ ] `.env.local` is not committed
- [ ] Production keys are different from development
- [ ] Only necessary keys are set

**Platform-specific**:
- Vercel: Use Environment Variables in project settings
- Netlify: Use Environment Variables in site settings
- Docker: Use `.env` file or `-e` flags
- Custom: Use `.env.local` with proper file permissions (600)

#### HTTPS

Always use HTTPS in production:
- Vercel/Netlify: Automatic
- Custom server: Use Let's Encrypt or Cloudflare
- Never serve over HTTP in production

#### Headers

Configure security headers (most platforms do this automatically):
```javascript
// next.config.ts
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];
```

## Known Security Considerations

### Client-Side Storage

**Current Implementation**:
- All data stored in localStorage
- No encryption at rest
- Accessible to anyone with browser access

**Recommendations**:
- Don't store sensitive information
- Use on trusted devices only
- Clear data when done on shared computers

### AI Tool Integration

**Current Implementation**:
- Spawns CLI processes with user prompts
- 2-minute timeout per request
- No shell injection (uses spawn args array)

**Recommendations**:
- Only connect trusted AI CLI tools
- Review CLI tool documentation
- Monitor API usage on provider dashboards

### No Authentication

**Current Implementation**:
- No user authentication system
- Anyone can access the app
- localStorage is per-browser

**Future Consideration**:
- Add optional authentication for multi-device sync
- Add user accounts for leaderboard verification
- Add API key encryption

## Security Testing

### Manual Testing

```bash
# Check for secrets in code
git secrets --scan

# Check for vulnerable dependencies
npm audit

# Run linter for security issues
npm run lint
```

### Automated Testing

Set up GitHub Actions for automated security checks:

```yaml
# .github/workflows/security.yml
name: Security Checks

on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm audit
      - run: npm run lint
```

## Compliance

### GDPR

This app:
- ✅ Stores data locally (user's device)
- ✅ Provides data export (Settings > Export Data)
- ✅ Provides data deletion (Settings > Reset All Data)
- ❌ Does not collect analytics by default
- ❌ Does not use cookies (except Next.js session)

### Data Collection

**What we store locally**:
- User profile (name, avatar, preferences)
- Learning progress (lessons completed, XP earned)
- Badge and achievement data
- Challenge attempts and scores
- Daily streak information

**What we don't collect**:
- No personal information sent to servers
- No tracking or analytics (by default)
- No third-party cookies
- No email or contact information

## Updates

This security policy is reviewed and updated:
- With each major release
- When new vulnerabilities are discovered
- When security best practices change

Last updated: 2026-03-12

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [npm Security Best Practices](https://docs.npmjs.com/packages-and-modules/securing-your-code)
- [Anthropic API Security](https://docs.anthropic.com/claude/docs/security)

## Questions?

For security-related questions (non-vulnerabilities), please:
- Open a GitHub Discussion
- Tag with "security" label
- Contact maintainers

Thank you for helping keep this project secure! 🔒
