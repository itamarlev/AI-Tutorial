# Getting Started with AI Tutorial

Welcome! This guide will help you get AI Tutorial running locally in under 5 minutes.

## Quick Start (TL;DR)

```bash
git clone https://github.com/yourusername/ai-tutorial.git
cd ai-tutorial
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - that's it! The app works immediately with simulated AI responses.

---

## Detailed Setup

### Prerequisites

Before you begin, ensure you have:
- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

Verify your installation:
```bash
node --version  # Should show v18.x or higher
npm --version   # Should show 9.x or higher
git --version   # Should show 2.x or higher
```

### Step 1: Clone the Repository

```bash
# HTTPS
git clone https://github.com/yourusername/ai-tutorial.git

# Or SSH
git clone git@github.com:yourusername/ai-tutorial.git

# Or GitHub CLI
gh repo clone yourusername/ai-tutorial

# Navigate to the project
cd ai-tutorial
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages. It takes 1-2 minutes on first run.

### Step 3: Start Development Server

```bash
npm run dev
```

You should see:
```
  ▲ Next.js 16.1.6
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

✓ Ready in 2.3s
```

### Step 4: Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000)

You'll see the landing page. Click "Get Started" to begin!

---

## First Time Experience

### Onboarding

On your first visit, you'll go through a 3-step onboarding:

1. **Welcome** - Introduction to the platform
2. **Profile** - Choose your name and avatar
3. **Daily Goal** - Set your daily XP target (default: 200 XP)

### Your First Lesson

After onboarding, you'll land on the dashboard. Try this:

1. Click "Start Learning" or navigate to **Learn**
2. Choose a tool (Claude, Cursor, or Codex)
3. Start with the first module (usually "Basics")
4. Complete your first lesson
5. Earn your first XP and badges!

### Exploring Features

- **Dashboard** - View your stats, level, and recent achievements
- **Learn** - Browse and complete structured lessons
- **Playground** - Experiment with AI prompts freely
- **Challenges** - Test your skills with timed challenges (unlocks after 3 lessons)
- **Achievements** - Browse and track all 28 badges
- **Leaderboard** - See how you rank (currently simulated)
- **Settings** - Customize your experience, export data, or reset progress

---

## Optional: Enable Real AI Tools

By default, AI Tutorial uses **simulated responses** (keyword-based). This works perfectly for learning without any API keys!

To connect real AI tools:

### Step 1: Get API Keys

**Claude** (optional):
- Visit [https://console.anthropic.com/](https://console.anthropic.com/)
- Sign up or log in
- Navigate to API Keys
- Create a new key
- Copy the key (starts with `sk-ant-`)

**OpenAI** (optional):
- Visit [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- Sign up or log in
- Create a new key
- Copy the key (starts with `sk-`)

### Step 2: Create Environment File

```bash
# Copy the example file
cp .env.example .env.local

# Edit with your favorite editor
nano .env.local
# or
code .env.local
```

Add your keys:
```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
OPENAI_API_KEY=sk-your-key-here
```

**Important**: Never commit `.env.local` to Git! It's already in `.gitignore`.

### Step 3: Install CLI Tools

**Claude CLI**:
```bash
npm install -g @anthropic-ai/claude-code
```

**Cursor** (requires Cursor IDE):
- Download from [https://cursor.sh](https://cursor.sh)
- Install the application
- The CLI is included

**Codex CLI**:
```bash
# Follow OpenAI's installation instructions
# https://platform.openai.com/docs/guides/code
```

### Step 4: Configure in App

1. Restart your dev server (Ctrl+C, then `npm run dev`)
2. Navigate to **Settings** in the app
3. Enable the tools you installed
4. Click "Test Connection" to verify
5. If green checkmark appears, you're connected!

Now the Playground will use real AI responses instead of simulated ones.

---

## Project Structure Overview

```
ai-tutorial/
├── src/
│   ├── app/              # Next.js pages and routes
│   ├── components/       # React components
│   ├── data/            # Lesson content and configuration
│   ├── stores/          # State management (Zustand)
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   └── types/           # TypeScript type definitions
├── public/              # Static assets (images, screenshots)
├── scripts/             # Utility scripts (screenshots)
├── .env.example         # Environment variable template
└── package.json         # Dependencies and scripts
```

### Key Files

- `src/app/page.tsx` - Landing page
- `src/app/dashboard/page.tsx` - Main dashboard
- `src/app/learn/` - Learning path pages
- `src/data/modules/` - Lesson content
- `src/stores/` - All state management
- `README.md` - Full documentation

---

## Available Scripts

Run these from the project root:

```bash
# Development
npm run dev              # Start dev server (port 3000)

# Building
npm run build            # Build for production
npm run start            # Serve production build

# Quality
npm run lint             # Run ESLint
npm run screenshot       # Generate screenshots (Playwright)
npm run screenshot:install  # Install Playwright browsers
```

---

## Common Issues & Solutions

### Port 3000 Already in Use

```bash
# Option 1: Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Option 2: Use a different port
npm run dev -- -p 3001
```

### Dependencies Won't Install

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Build Fails

```bash
# Clean Next.js cache
rm -rf .next

# Rebuild
npm run build
```

### localStorage Issues

Open DevTools > Application > Local Storage > Clear `ai-tutorial-*` keys

Or use the in-app reset: Settings > Reset All Data

### Screenshots Don't Generate

```bash
# Install browsers
npm run screenshot:install

# Try again
npm run screenshot
```

---

## Next Steps

### Learning Path

1. **Complete the Basics** - Start with Claude CLI Basics module
2. **Try the Playground** - Experiment with prompts
3. **Take a Challenge** - After 3 lessons, challenges unlock
4. **Unlock Badges** - Earn all 28 achievements
5. **Master All Tools** - Complete all 33 lessons

### Customization

Want to customize the app? Check out:
- [CONTRIBUTING.md](CONTRIBUTING.md) - How to add content
- [README.md](README.md) - Full documentation
- Source code in `src/` - Well-commented TypeScript

### Deployment

Ready to deploy? See:
- [DEPLOYMENT.md](DEPLOYMENT.md) - Complete deployment guide
- Quick deploy buttons in README
- Platform-specific instructions

---

## Getting Help

### Documentation
- [README.md](README.md) - Complete documentation
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guide
- [SECURITY.md](SECURITY.md) - Security policy
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide

### Support
- **Issues** - Report bugs on GitHub Issues
- **Discussions** - Ask questions on GitHub Discussions
- **Email** - security@yourproject.com (security only)

### Resources
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Anthropic Docs](https://docs.anthropic.com)

---

## Tips for Success

1. **Start Simple** - Complete lessons in order
2. **Practice in Playground** - Try prompts before challenges
3. **Read Carefully** - Lesson content explains concepts
4. **Experiment** - There's no wrong way to learn
5. **Track Progress** - Dashboard shows your journey
6. **Have Fun** - Enjoy the gamification!

---

Happy Learning! 🚀

If you find this project helpful, please:
- ⭐ Star the repository
- 🐛 Report bugs you find
- 💡 Suggest new features
- 🤝 Contribute lessons or improvements

Thank you for using AI Tutorial!
