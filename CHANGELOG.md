# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- User authentication and cloud sync
- Real-time leaderboard with live competition
- Additional AI tools (GitHub Copilot, Tabnine)
- Code review challenges
- Team/collaborative features
- Progress analytics dashboard
- Custom challenge creator
- Mobile app (React Native)

## [0.1.0] - 2026-03-12

### Added

#### Core Features
- **Learning System**
  - 33 interactive lessons across 3 AI tools (Claude, Cursor, Codex)
  - 10 structured modules with prerequisites
  - 4 exercise types: multiple choice, prompt writing, code completion, ordering
  - Content rendering with markdown, code blocks, and callouts
  - Progress tracking and completion states

- **Gamification**
  - XP and leveling system (25 levels with titles)
  - Daily streak tracking with multipliers (1.0x-1.5x)
  - 28 badges across 5 categories and 4 rarity tiers
  - Daily XP goals with progress rings
  - Perfect score bonuses (1.5x XP)
  - Celebration animations (confetti, modals)

- **Challenges**
  - 6 timed challenges (easy, medium, hard)
  - Countdown timer with auto-submit
  - Score calculation with time bonuses
  - Challenge unlock system (requires 3 completed lessons)

- **Playground**
  - Free-form prompt experimentation
  - Tool selector (Claude, Cursor, Codex)
  - Simulated AI responses (keyword-based)
  - Optional live AI integration via CLI tools
  - Prompt history with replay
  - Connection status indicators

- **UI/UX**
  - Modern dark theme with custom color palette
  - Responsive design (mobile, tablet, desktop)
  - Smooth animations with Framer Motion
  - Desktop sidebar navigation
  - Mobile bottom tab navigation
  - Sticky top bar with XP and streak display
  - Toast notifications for XP gains

- **Pages**
  - Landing page with feature showcase
  - 3-step onboarding flow
  - Dashboard with stats and quick actions
  - Learning paths with tool/module/lesson hierarchy
  - Interactive playground
  - Challenge list and execution
  - Badge gallery with filters
  - Leaderboard (simulated)
  - Settings with preferences and data management

#### Technical
- Next.js 16 with App Router
- React 19 with hooks and Suspense
- TypeScript 5 in strict mode
- Tailwind CSS v4 with CSS-native configuration
- Zustand v5 for state management
- localStorage persistence (no backend)
- API routes for AI CLI integration
- Playwright for automated screenshots
- ESLint for code quality

#### AI Integration
- Claude CLI tool support
- Cursor agent support
- Codex CLI support
- Health check system
- Configurable commands and arguments
- Stdin/argument input modes
- Streaming responses
- Fallback to simulated mode

#### Documentation
- Comprehensive README with screenshots
- Contributing guide
- Deployment guide (Vercel, Netlify, AWS, Docker, custom)
- Security policy
- License (MIT)
- Environment variable templates
- API documentation in code comments

#### Data
- 3 AI tools with metadata
- 10 modules across tools
- 33 lessons with exercises
- 28 badges with unlock conditions
- 6 timed challenges
- Simulated responses for offline learning
- Skill tree coordinates (visual representation)

### Security
- No hardcoded API keys
- Environment variable configuration
- Command injection prevention (spawn with args array)
- Process timeouts (2 minutes)
- Input validation on API routes
- XSS prevention (React escaping, safe markdown)
- localStorage-only data storage
- No server-side sensitive data

### Developer Experience
- Hot reload in development
- TypeScript type safety throughout
- Modular component architecture
- Custom hooks for reusable logic
- Centralized data management
- Clear project structure
- Inline code documentation
- Easy content addition workflow

## [0.0.1] - 2026-02-16

### Added
- Initial Next.js project setup
- Basic project structure
- Development dependencies

---

## Release Notes

### Version 0.1.0 - "Foundation Release"

This is the initial public release of AI Tutorial, a complete gamified learning platform for AI tools. The app is fully functional with:

✅ **33 lessons** ready to learn
✅ **28 badges** to unlock
✅ **6 challenges** to complete
✅ **Full gamification** system
✅ **Optional AI integration**
✅ **Production-ready** documentation

**What Works**:
- All core features functional
- Responsive on all devices
- Works offline (simulated mode)
- Can connect real AI tools
- Full data persistence in localStorage
- Export/import functionality
- Zero backend required

**Known Limitations**:
- Leaderboard uses simulated data (no real-time competition)
- No user accounts or cloud sync
- No mobile app (web-only)
- Limited AI tools (Claude, Cursor, Codex)

**Next Steps**:
- Add more lessons and challenges
- Implement real leaderboard with backend
- Add user authentication
- Create mobile app
- Support additional AI tools

---

## Migration Guide

### From 0.0.x to 0.1.0

No migration needed - this is the first release with features.

**For developers**:
1. Pull latest changes
2. Run `npm install`
3. Copy `.env.example` to `.env.local` (optional)
4. Run `npm run dev`

**For users**:
- No action needed
- localStorage data will be automatically initialized

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to add features, report bugs, or suggest enhancements.

---

## Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/ai-tutorial/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/ai-tutorial/discussions)
- **Security**: See [SECURITY.md](SECURITY.md)
