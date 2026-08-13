# SkillSyncWeb - Frontend

SkillSyncWeb is the modern, responsive, and highly interactive frontend client for the SkillSync AI platform. It is built to seamlessly orchestrate team building and talent connection using a premium, animated interface.

## Tech Stack

This project is built using the following modern web technologies:

- **Framework**: [React 19](https://react.dev/) and [Vite](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/) (and TanStack Router integrations)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Primitives**: [Radix UI](https://www.radix-ui.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) and [tw-animate-css](https://github.com/tw-animate-css/tw-animate-css)
- **Data Fetching & State**: [TanStack Query](https://tanstack.com/query/latest) (React Query) and [Axios](https://axios-http.com/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) and [Zod](https://zod.dev/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Real-Time Communication**: [@stomp/stompjs](https://stomp-js.github.io/) (WebSockets)
- **3D / Visuals**: [Three.js](https://threejs.org/) and Ogl
- **Utilities**: `date-fns`, `clsx`, `tailwind-merge`, `lucide-react`

## Important Concepts Used

- **Modular Architecture**: The codebase is organized into modular feature slices (e.g., `src/features/auth`, `src/features/projects`) to maintain scalability and separation of concerns.
- **Premium Design System**: Utilizes a highly customized Tailwind CSS v4 `@theme` configuration with semantic CSS variables (e.g., `--primary`, `--background`) to support dynamic, high-contrast light and dark themes.
- **OAuth2 & JWT Authentication**: Context-driven authentication (`AuthContext`) handling secure token storage, OAuth2 callback exchange, and automatic token hydration.
- **Micro-Animations & Smooth Scrolling**: Leverages Framer Motion for scroll-reveals (`Reveal`, `FadeIn`) and Lenis for smooth scrolling, enhancing user engagement without sacrificing performance.
- **Form Validation**: Strict schema-based validation using Zod integrated with React Hook Form to ensure data integrity before dispatching API requests.
- **Real-time Event Streaming**: STOMP over WebSockets for live updates and notifications directly from the backend Kafka streams.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```
