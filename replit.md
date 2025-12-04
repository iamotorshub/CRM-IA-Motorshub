# Overview

This is **Aura CRM / Luxe CRM**, an ultra-premium, AI-native CRM platform designed specifically for real estate agencies. The platform focuses on lead management, outbound campaign automation, and AI-powered workflows.

**Core Value Proposition:**
- Real estate-focused CRM with properties, contacts, deals, and pipeline management
- AI-powered campaign engine for email and WhatsApp outreach
- Multi-provider AI integration (OpenAI, Anthropic, Gemini)
- Automation capabilities via n8n and Make integrations
- Buyer intent detection and lead scoring
- Premium UI/UX inspired by Follow Up Boss, Notion, and modern SaaS

**Target Market:** Real estate agencies in Barcelona and Bahía Blanca, with plans to expand globally.

---

# User Preferences

Preferred communication style: Simple, everyday language.

---

# System Architecture

## Frontend Architecture

**Framework:** React with TypeScript, Vite build system

**UI Component System:**
- **shadcn/ui** components built on Radix UI primitives
- **Tailwind CSS** for styling with custom design system
- **Framer Motion** for smooth animations and transitions
- Design follows "New York" style from shadcn (clean, minimal, sophisticated)

**State Management:**
- **TanStack Query (React Query)** for server state
- Local React state for UI-specific concerns
- No global state management library (intentional simplicity)

**Routing:** Wouter (lightweight client-side routing)

**Key Design Decisions:**
- Premium minimalism with intentional whitespace
- Glassmorphism effects and soft shadows for depth
- Typography: Inter (body) + Outfit (headings)
- Responsive grid layouts with mobile-first approach
- Dark/light theme support via context provider

## Backend Architecture

**Runtime:** Node.js with Express.js

**API Design:** RESTful JSON API with standard HTTP methods

**Database Layer:**
- **Drizzle ORM** for type-safe database queries
- PostgreSQL database (configured for Neon serverless)
- Schema-first approach with migrations via drizzle-kit

**Module Organization:**
```
server/
├── ai/              # AI provider integrations
│   ├── llmRouter.ts # Multi-provider LLM routing
│   └── agents/      # Specialized AI agent prompts
├── automation/      # n8n and Make integrations
├── buyerIntent/     # Lead scoring and analysis
└── whatsapp/        # UltraMsg WhatsApp integration
```

**Key Architectural Patterns:**
- Thin route handlers that delegate to storage layer
- Abstraction layer for AI providers (pluggable architecture)
- Service modules for complex business logic (buyer intent, automation)
- Configuration via environment variables

## Database Schema

**Core Tables:**
- `contacts` - Lead and customer information with scoring
- `campaigns` - Outbound campaign definitions
- `campaign_steps` - Multi-channel campaign sequences (email, WhatsApp)
- `whatsapp_logs` - Message tracking and delivery status
- `buyer_intent_scans` - Domain analysis results
- `buyer_intent_signals` - Digital presence indicators
- `automations` - Workflow definitions
- `automation_actions` - Step-by-step automation logic
- `automation_logs` - Execution history

**Design Philosophy:**
- Relational structure with foreign key constraints
- JSON columns for flexible configuration storage
- Timestamp tracking on all entities
- Soft deletes via cascade rules

## AI Integration Strategy

**Multi-Provider Support:**
- OpenAI (GPT-4)
- Anthropic (Claude)
- Google (Gemini)

**Integration Approach:**
- Centralized LLM router (`server/ai/llmRouter.ts`)
- Provider selection via API parameter
- Environment-based API key configuration
- Specialized agent prompts (Hormozi style, real estate expert, closer)

**Use Cases:**
- Campaign copy generation
- Property description writing
- Lead analysis and scoring
- WhatsApp message composition
- Automation blueprint creation

**Design Decision Rationale:**
- Avoid vendor lock-in by supporting multiple providers
- Enable cost optimization through provider switching
- Allow specialized agents for different contexts
- Keep core business logic provider-agnostic

---

# External Dependencies

## Third-Party Services

**WhatsApp Integration:**
- **UltraMsg API** for message sending
- Credentials: Instance-based authentication
- Used for: Outbound campaign messages, contact communication

**AI Providers:**
- **OpenAI API** - GPT models for general content generation
- **Anthropic API** - Claude models for analysis and reasoning
- **Google Gemini API** - Alternative LLM provider

**Automation Platforms:**
- **n8n** - Self-hosted workflow automation (optional)
- **Make** (formerly Integromat) - Cloud automation platform (optional)

**Database:**
- **Neon Serverless PostgreSQL** - Primary data store
- Connection via `postgres` driver with `drizzle-orm/postgres-js`
- Note: Migrated from `@neondatabase/serverless` (neon-http) to resolve null handling issues

## Development & Infrastructure

**Build Tools:**
- Vite (frontend bundler)
- esbuild (server bundler for production)
- tsx (TypeScript execution for development)

**Development Environment:**
- Replit-specific plugins for error overlay and banner
- Cartographer for code navigation
- Hot module replacement for rapid iteration

**UI Component Libraries:**
- @radix-ui/* - 20+ accessible component primitives
- cmdk - Command palette component
- framer-motion - Animation library
- react-icons - Icon library including SiN8N, SiFacebook

**Session Management:**
- connect-pg-simple - PostgreSQL session store
- express-session - Server-side sessions

## API Configuration Requirements

**Required Environment Variables:**
```
DATABASE_URL                 # Neon PostgreSQL connection
OPENAI_API_KEY              # Optional AI provider
ANTHROPIC_API_KEY           # Optional AI provider
GEMINI_API_KEY              # Optional AI provider
ULTRAMSG_API_URL            # WhatsApp service endpoint
ULTRAMSG_INSTANCE_ID        # WhatsApp instance ID
ULTRAMSG_TOKEN              # WhatsApp authentication
N8N_BASE_URL                # Optional automation platform
N8N_API_KEY                 # Optional automation auth
MAKE_BASE_URL               # Optional automation platform
MAKE_API_KEY                # Optional automation auth
MAKE_TEAM_ID                # Optional Make team identifier
```

**Integration Philosophy:**
- AI providers are optional (graceful degradation)
- Automation platforms are optional (core CRM works standalone)
- WhatsApp is configured with specific credentials (replace for production)
- All external services configurable via environment