# SkillSyncWeb — Frontend

The immersive frontend for SkillSync AI — discover talent, build teams, and turn ideas into real projects.

SkillSyncWeb is the modern, responsive, and highly interactive frontend client for SkillSync AI.

The application provides the user-facing experience for the SkillSync ecosystem, bringing together authentication, profiles, project discovery, team building, AI-powered workflows, real-time communication, and an interaction-focused design system.

Rather than behaving like a conventional job board or social networking interface, SkillSyncWeb is designed around the idea of intelligent collaboration — helping students discover the right people, understand their skills, form teams, and collaborate on meaningful projects.

## Table of Contents

- [What is SkillSyncWeb?](#what-is-skillsyncweb)
- [Core User Experience](#core-user-experience)
- [Key Frontend Capabilities](#key-frontend-capabilities)
- [Architecture](#architecture)
  - [Feature-Based Organization](#feature-based-organization)
  - [Authentication](#authentication)
  - [API & Server State](#api--server-state)
  - [Real-Time Communication](#real-time-communication)
- [Design System](#design-system)
  - [Animations & Interaction](#animations--interaction)
  - [Forms & Validation](#forms--validation)
  - [Responsive Design](#responsive-design)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Backend Integration](#backend-integration)
- [Environment Configuration](#environment-configuration)
- [Local Development](#local-development)
- [Production Build](#production-build)
- [Deployment](#deployment)
- [Engineering Principles](#engineering-principles)
- [Future Improvements](#future-improvements)
- [Project Status](#project-status)
- [Author](#author)
- [License](#license)

## What is SkillSyncWeb?

SkillSyncWeb is the frontend client of the SkillSync AI platform.

SkillSync is designed to solve a common problem faced by students:
**How do you find the right people to build something with?**

The frontend provides the interface through which users can:
- Create and manage their accounts
- Build professional profiles
- Add and manage skills
- Upload resumes
- Create projects
- Define project requirements
- Discover potential collaborators
- Search for users
- Inspect profiles and previous projects
- Join teams
- Send collaboration requests
- Communicate with other users
- Receive real-time updates
- Interact with AI-powered features

The frontend communicates with the Spring Boot backend through REST APIs and WebSockets.

## Core User Experience

A typical user journey looks like:

1. Landing Page
2. Authentication
3. Profile Setup
4. Skills / Resume / Projects
5. Explore Projects & People
6. Create or Join a Project
7. Discover Suitable Teammates
8. View Profiles & Experience
9. Message / Collaborate
10. Build the Team
11. Work Together

The UI is designed to make this journey feel continuous rather than like a collection of disconnected CRUD screens.

## Key Frontend Capabilities

### 1. Authentication Experience
The authentication interface supports the backend authentication system through:
- Registration
- Login
- OTP verification
- Password recovery
- Password reset
- Google OAuth2
- JWT-based authenticated sessions

Authentication state is managed centrally through the application's authentication context.

### 2. Professional User Profiles
The profile experience is designed around a student's professional identity.
Users can manage information such as:
- Name
- Bio
- University
- Major
- Graduation year
- Skills
- Skill levels
- Resume
- GitHub
- LinkedIn
- Portfolio
- Previous projects
- Profile image

Profiles are designed to make it easier for other users to understand a candidate before initiating collaboration.

### 3. Project Discovery & Team Building
The frontend provides interfaces for discovering and interacting with projects.
Users can:
- Explore projects
- Search for relevant users
- Inspect project requirements
- View project owners
- View team members
- View candidate profiles
- Send collaboration requests
- Join teams

The interface is designed to support the complete journey from discovering a project to becoming part of its team.

### 4. User Search
Users can discover other students using keyword-based search.
The search experience can be used to find people based on information such as:
- Names
- Skills
- Universities
- Projects
- Other searchable profile information

This complements the platform's intelligent recommendation system by allowing users to actively explore the network themselves.

### 5. Real-Time Messaging
SkillSyncWeb integrates with the backend's WebSocket infrastructure using STOMP.
This allows the frontend to receive live updates such as:
- Messages
- Notifications
- Team invitations
- Collaboration updates
- Background processing results

Instead of repeatedly requesting the server for updates, the frontend can react to events pushed by the backend.

### 6. AI-Powered Experiences
The frontend is designed to expose AI-powered functionality provided by the backend.
Potential experiences include:
- Resume analysis
- Skill extraction
- Skill-gap analysis
- Candidate compatibility
- Career roadmaps
- Personalized guidance
- Project recommendations
- Team recommendations

The frontend focuses on presenting these insights clearly while the backend handles AI orchestration and processing.

## Architecture

SkillSyncWeb follows a **feature-oriented frontend architecture**.

Instead of organizing the entire application only around technical categories such as `components/`, `services/`, `controllers/`, `models/`, features can own the UI and logic associated with a particular business domain.

For example:
```
src/
├── features/
│   ├── auth/
│   ├── profile/
│   ├── projects/
│   ├── matching/
│   ├── messaging/
│   └── ...
│
├── components/
├── hooks/
├── lib/
├── routes/
└── assets/
```
This makes it easier to add functionality without allowing unrelated parts of the application to become tightly coupled.

### Feature-Based Organization
Each feature can contain the pieces it needs to operate:
```
feature/
├── components/
├── api.ts
├── hooks.ts
├── schemas.ts
├── types.ts
└── ...
```
For example, the authentication feature can contain:
- Login UI
- Registration UI
- OTP UI
- OAuth handling
- Authentication API calls
- Validation schemas
- Authentication state

This keeps domain-specific frontend logic close to the feature that owns it.

### Authentication
Authentication is implemented using a combination of:
- React context
- JWT
- OAuth2
- Secure API communication
- Token storage
- Route protection

The frontend manages the authenticated user's state and hydrates authentication information when the application starts.
OAuth2 callback handling is separated from the normal login experience so that the authentication flow remains predictable.

### API & Server State
The frontend uses:
- **Axios** for HTTP communication
- **TanStack Query** for server-state management

TanStack Query is used to handle concerns such as:
- API data fetching
- Caching
- Loading states
- Error states
- Mutations
- Query invalidation
- Synchronizing server state with the UI

This keeps server data separate from purely local UI state.

### Real-Time Communication
SkillSyncWeb uses:
- **STOMP over WebSockets**
for real-time communication with the backend.

A typical real-time flow is:
Spring Boot Backend → WebSocket / STOMP → SkillSyncWeb → React State / Query Cache → Updated UI

This architecture is useful for messaging, notifications, team events, and asynchronous backend workflows.

## Design System

SkillSyncWeb uses a highly customized **Tailwind CSS design system**.
The UI is built around semantic design variables such as:
`--primary`
`--background`
`--foreground`
`--muted`
`--border`

This allows components to use semantic styling rather than hard-coding every visual value. The design system supports high-contrast interfaces and dynamic light/dark themes.

### UI Primitives
Reusable UI primitives are built using Radix UI and styled through Tailwind CSS. This provides accessible building blocks for interfaces such as:
- Dialogs
- Dropdowns
- Forms
- Inputs
- Selects
- Tabs
- Tooltips
- Cards
- Navigation
- Menus
- Toast notifications

The goal is to maintain visual consistency across the application while keeping individual feature screens composable.

### Animations & Interaction
Animation is a major part of the SkillSyncWeb experience. The frontend uses technologies such as:
- Framer Motion
- tw-animate-css
- Custom scroll animations
- Reveal effects
- Fade-in transitions
- Smooth scrolling
- Interactive UI components
- React Bits / custom visual components where applicable

Animations are used to provide visual feedback and guide attention rather than simply decorating the interface.

Examples include:
- Section reveal animations
- Scroll-based transitions
- Card interactions
- Hover effects
- Page transitions
- Smooth scrolling
- Progressive content appearance

**Smooth Scrolling**
The frontend can use Lenis-style smooth scrolling patterns to provide a more controlled scrolling experience. This is particularly useful for the highly visual landing page and showcase sections. The goal is to make interactions feel fluid while avoiding unnecessary animation overhead on functional screens.

### Forms & Validation
Forms are built using:
- **React Hook Form**
- **Zod**

The combination provides:
- Structured form state
- Schema-based validation
- Type-safe validation rules
- Consistent error handling
- Reduced unnecessary re-renders

Example flow:
User Input → React Hook Form → Zod Validation → Validated Request → Axios → Spring Boot API

Invalid data is rejected on the client before unnecessary API requests are made. Server-side validation remains the final authority.

### Responsive Design
SkillSyncWeb is designed to work across:
- Desktop
- Laptop
- Tablet
- Mobile

Tailwind's responsive utilities are used to adapt:
- Layouts
- Typography
- Navigation
- Cards
- Forms
- Dashboards
- Project views
- Profile pages

The design prioritizes usability rather than simply shrinking desktop layouts for smaller screens.

## Technology Stack

| Area | Technology |
|---|---|
| Framework | React 19 |
| Build Tool | Vite |
| Routing | TanStack Router |
| Server State | TanStack Query |
| HTTP Client | Axios |
| Styling | Tailwind CSS v4 |
| UI Primitives | Radix UI |
| Animation | Framer Motion |
| Animation Utilities | tw-animate-css |
| Forms | React Hook Form |
| Validation | Zod |
| Charts | Recharts |
| Real-Time | STOMP / WebSockets |
| Icons | Lucide React |
| 3D / Visuals | Three.js / OGL |
| Utilities | date-fns, clsx, tailwind-merge |
| Language | TypeScript |

*Note: The current frontend uses TanStack Router as the primary routing system. Earlier iterations may contain React Router references from the project's migration history.*

## Project Structure

A typical structure is:
```
src/
│
├── assets/
│
├── components/
│   └── ui/
│
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── api.ts
│   │   ├── context.tsx
│   │   ├── redirect.tsx
│   │   └── schemas.tsx
│   │
│   ├── profile/
│   ├── projects/
│   ├── matching/
│   ├── messaging/
│   └── ...
│
├── hooks/
│
├── lib/
│   ├── api/
│   ├── websocket/
│   └── ...
│
├── routes/
│
├── App.tsx
├── main.tsx
├── router.tsx
└── index.css
```
The exact feature set may evolve as additional modules are introduced.

## Backend Integration

SkillSyncWeb acts as the client layer for the SkillSync AI backend.

The general architecture is:
```
SkillSyncWeb
     │
     ├── REST API
     │
     └── WebSocket / STOMP
              │
              ▼
       Spring Boot Backend
              │
       ┌──────┼────────┐
       │      │        │
   PostgreSQL Redis   Kafka
              │
              ▼
          AI Services
```

The frontend does not directly communicate with PostgreSQL, Redis, Kafka, or the AI provider. Those concerns remain behind the backend API boundary.

### API Layer
Axios is used as the primary HTTP client. The API layer is separated from presentation components so UI components do not need to know the implementation details of HTTP requests.

A typical feature can expose:
```
feature/
├── api.ts
├── hooks.ts
├── components/
└── schemas.ts
```
This makes API changes easier to manage as the application grows.

## Environment Configuration

Frontend-specific configuration should be supplied through Vite environment variables.

For example:
`VITE_API_BASE_URL`

**Development:**
`VITE_API_BASE_URL=http://localhost:8080`

**Production:**
`VITE_API_BASE_URL=https://your-production-api.example.com`

**Never place private secrets such as:**
- JWT signing secrets
- Database credentials
- Kafka credentials
- Redis passwords
- Gemini API keys
- OAuth client secrets intended for the backend
- SMTP credentials
inside frontend environment variables.

Anything prefixed with `VITE_` should be treated as potentially visible to the browser.

## Local Development

**Prerequisites**
Install:
- Node.js 18+
- npm or pnpm
- Git

Clone the repository:
```bash
git clone <repository-url>
cd SkillSyncWeb
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

The Vite development server will display the local URL in the terminal, typically:
`http://localhost:5173`

## Production Build

Create a production build:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

Before deployment, verify that:
- API URLs point to production
- OAuth redirect URLs are configured correctly
- CORS is configured on the backend
- WebSocket URLs point to the production backend
- Required frontend environment variables are configured
- No development credentials are included

## Deployment

SkillSyncWeb is designed to be deployed independently from the Spring Boot backend.

A typical deployment architecture is:
```
                     SkillSync AI
                          │
            ┌─────────────┴─────────────┐
            │                           │
        SkillSyncWeb                Backend
          Vercel                  Spring Boot
            │                           │
            │ REST / WebSocket          │
            └───────────────────────────┘
```

Vercel is suitable for hosting the React/Vite frontend because it provides:
- Global CDN delivery
- Automatic deployments
- Environment variables
- HTTPS
- Preview deployments
- Git integration

**Production Routing**
If the backend is hosted separately, the frontend can communicate with it using a production API URL.

For example:
Frontend: `https://skillsync.example.com`
Backend: `https://api.skillsync.example.com`

A Vercel rewrite/reverse-proxy can also be used when appropriate so the frontend can make requests through paths such as:
`/api/auth/login`
`/api/projects`
`/api/users`
while the hosting platform forwards those requests to the Spring Boot backend.

## Performance Considerations

The frontend is designed with performance in mind despite its highly visual interface.
Important considerations include:
- Server-state caching through TanStack Query
- Avoiding unnecessary API requests
- Lazy loading where appropriate
- Responsive layouts
- Controlled animation usage
- Optimized media
- Component reuse
- Separation of server and UI state

Visual effects should enhance the experience without blocking core functionality.

## Engineering Principles

- **Feature-Oriented Architecture**: Business features own their UI, API logic, validation, and supporting hooks where practical.
- **Reusable Components**: Common UI behavior is extracted into reusable components instead of being duplicated across pages.
- **Type Safety**: TypeScript is used throughout the frontend to catch invalid data and API usage during development.
- **Server State Separation**: TanStack Query manages server state while local React state handles transient UI state.
- **Validation Before Requests**: Zod validation helps prevent malformed client requests before they reach the backend.
- **Accessible UI**: Radix UI provides accessible primitives for complex interactions such as dialogs, menus, popovers, and form controls.
- **Responsive by Default**: Layouts are designed for multiple viewport sizes rather than treating mobile as an afterthought.
- **Purposeful Animation**: Animations are used to communicate hierarchy, state changes, and interaction feedback rather than adding motion everywhere.

## Future Improvements

Potential frontend improvements include:
- Advanced AI recommendation dashboards
- Interactive skill-gap visualizations
- Team compatibility dashboards
- More advanced project discovery
- Rich messaging features
- Presence indicators
- Typing indicators
- Real-time notifications
- Profile analytics
- Resume analysis visualizations
- Progressive Web App capabilities
- Advanced accessibility improvements
- Further performance optimization

## Project Status

SkillSyncWeb is the frontend client of the SkillSync AI ecosystem and is being developed as a full-stack portfolio project.

The frontend focuses on combining:
**Modern React Architecture + Strong UX + Real-Time Communication + AI-Powered Workflows + Responsive Design**
into a single cohesive collaboration experience.

The objective is not only to create visually attractive pages, but to build a frontend architecture capable of supporting a growing, feature-rich collaboration platform.

## Author

**Rahul Gheek**
Computer Science Engineering Student Java Developer

**Focus Areas**
- Java
- Spring Boot
- System Design
- React
- TypeScript
- PostgreSQL
- Kafka
- Redis
- AI Integration

## License

This project is developed for educational, portfolio, and demonstration purposes.
