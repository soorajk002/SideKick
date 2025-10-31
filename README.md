# SideKick - AI-Powered Sales Checklist for Zoom

> Your AI co-pilot for perfect sales calls

SideKick is a Zoom app that helps sales teams execute flawlessly by tracking sales playbooks in real-time. It listens to your conversations and automatically checks off completed items, ensuring you never miss a critical step.

## ✨ Features

- 📋 **Smart Checklists** - Pre-built templates for discovery, demo, and closing calls
- 🎤 **Live Listening** - Real-time conversation transcription and analysis
- 🤖 **AI Auto-Checking** - GPT-4 powered semantic matching to automatically check items
- ⚡ **Real-Time Updates** - See progress live during calls with WebSocket updates
- 🎯 **Custom Playbooks** - Create your own sales playbooks and templates
- 📊 **Progress Tracking** - Visual progress bars and completion analytics
- 👥 **Team Sync** - All participants see the same checklist in real-time

## Architecture

```
SideKick/
├── frontend/          # React + TypeScript Zoom App
├── backend/           # Node.js + Express API
├── shared/            # Shared types and utilities
└── docs/              # Documentation
```

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Zoom Apps SDK
- Tailwind CSS
- Zustand (state management)

**Backend:**
- Node.js + Express + TypeScript
- PostgreSQL
- OpenAI API
- Socket.io (real-time updates)

## 🚀 Quick Start

**Want to get started in 5 minutes?** See [QUICKSTART.md](./QUICKSTART.md)

### Prerequisites

- Node.js 18+ - [Download](https://nodejs.org/)
- PostgreSQL 14+ - [Download](https://postgresql.org/)
- Zoom Developer Account - [Sign up](https://marketplace.zoom.us/)
- OpenAI API Key - [Get key](https://platform.openai.com/)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd SideKick

# Install dependencies
npm install

# Set up database
createdb sidekick
cd backend
npm run db:push
npm run db:seed

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Start development servers
npm run dev
```

### Detailed Setup

For complete setup instructions, see [docs/SETUP.md](./docs/SETUP.md)

## Development

```bash
# Start frontend only
npm run dev:frontend

# Start backend only
npm run dev:backend

# Run tests
npm test

# Build for production
npm run build
```

## 🚀 Deploy to Production

### Quick Deploy to Vercel + Railway

```bash
# 1. Get your API keys ready
# - Zoom: marketplace.zoom.us
# - OpenAI: platform.openai.com

# 2. Deploy frontend to Vercel
cd frontend
vercel --prod

# 3. Deploy backend to Railway
# Visit railway.app and connect your GitHub repo

# 4. Set environment variables
# See docs/ENV_SETUP.md for complete list
```

**Detailed guides:**
- [Environment Setup](./docs/ENV_SETUP.md) - Get all your API keys
- [Vercel Deployment](./docs/VERCEL_DEPLOYMENT.md) - Step-by-step deployment
- [General Deployment](./docs/DEPLOYMENT.md) - Other hosting options

## 📖 Documentation

- [Quick Start Guide](./QUICKSTART.md) - Get running in 5 minutes
- [Setup Guide](./docs/SETUP.md) - Detailed installation instructions
- [Architecture](./docs/ARCHITECTURE.md) - System design and data flow
- [Environment Setup](./docs/ENV_SETUP.md) - API keys and configuration
- [Vercel Deployment](./docs/VERCEL_DEPLOYMENT.md) - Deploy to production
- [Contributing](./CONTRIBUTING.md) - How to contribute

## 🏗️ How It Works

1. **Start a Zoom meeting** and open SideKick from the Apps menu
2. **Select a template** or create a custom checklist for your call
3. **Conduct your call** - SideKick listens via Zoom transcription
4. **AI analyzes** the conversation and auto-checks completed items
5. **Track progress** in real-time with visual indicators
6. **Review results** after the call for coaching and improvement

## 🛠️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Zoom Apps SDK
- Tailwind CSS
- Zustand (state management)
- Socket.io client

**Backend:**
- Node.js + Express + TypeScript
- PostgreSQL + Drizzle ORM
- OpenAI GPT-4 API
- Socket.io (WebSocket)
- Winston (logging)

## 🚀 Deployment

**Recommended:**
- Frontend: Vercel (automatic deployment)
- Backend: Railway or Render
- Database: Railway PostgreSQL or Supabase

See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed deployment instructions.

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📝 License

MIT License - see [LICENSE](./LICENSE) for details

## 🙏 Acknowledgments

- Built with [Zoom Apps SDK](https://developers.zoom.us/docs/zoom-apps/)
- Powered by [OpenAI GPT-4](https://openai.com/)
- UI components inspired by modern design systems

## 📧 Support

- 📚 [Documentation](./docs/)
- 🐛 [Report Issues](../../issues)
- 💬 [Discussions](../../discussions)

---

Made with ❤️ for sales teams who want to execute perfectly, every time.
