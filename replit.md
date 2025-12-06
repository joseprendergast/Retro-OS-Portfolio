# RetroOSPortfolio - Windows 95 Themed Personal Website

## Overview

RetroOSPortfolio is a nostalgic Windows 95-themed personal portfolio website that recreates the authentic Windows 95 desktop experience. The project serves as both a functional portfolio and an interactive retro computing experience, featuring a fully functional desktop environment with draggable windows, icons, games (Minesweeper, Solitaire), file explorers, and social media integrations styled as desktop shortcuts.

The application aims for pixel-perfect accuracy to the original Windows 95 aesthetic, including authentic color palettes, typography (MS Sans Serif), and the signature 3D border system that defined the era.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18+ with TypeScript, built using Vite for fast development and optimized production builds.

**UI Component System**: The project uses a dual-layer component architecture:
- **shadcn/ui components**: Modern, accessible React components built on Radix UI primitives, providing the foundation for complex interactions
- **Win95 components**: Custom-built retro-styled components that wrap or replace shadcn components to achieve authentic Windows 95 aesthetics

**State Management**: 
- **Zustand** is used for global state management with two primary stores:
  - `desktopStore`: Manages desktop-level state (wallpaper, selected icons, Start menu, context menus)
  - `windowManager`: Handles window lifecycle (open, close, minimize, maximize, focus, positioning, z-index management)
- Both stores use Zustand's persist middleware for selective state persistence across sessions

**Styling Approach**:
- **Tailwind CSS** as the primary styling framework with extensive customization for Windows 95 aesthetics
- Custom CSS variables define the Windows 95 color palette (#c0c0c0 gray, #008080 teal, #000080 navy)
- The 3D border system is implemented through custom Tailwind utilities (win95-raised, win95-sunken)
- Anti-aliasing is disabled for authentic pixel-perfect text rendering

**Routing**: Client-side routing managed through the application component structure, with the Desktop component serving as the main application entry point.

**Design System**: Comprehensive design guidelines documented in `design_guidelines.md` specify exact colors, typography (MS Sans Serif with pixel-perfect rendering), border styles, and layout grids that match Windows 95's visual language.

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript.

**Architecture Pattern**: The backend follows a minimal API-first approach:
- Routes are registered in `server/routes.ts` with `/api` prefix convention
- Static file serving handled by `server/static.ts` for production builds
- Development mode uses Vite middleware for hot module replacement

**Storage Interface**: The application defines an `IStorage` interface for data persistence operations with a default in-memory implementation (`MemStorage`). This abstraction allows swapping storage backends without changing application logic.

**Session Management**: The project includes session handling dependencies (express-session, connect-pg-simple) suggesting session-based authentication is planned or implemented.

**Development vs Production**: 
- Development mode runs Vite dev server integrated with Express
- Production serves pre-built static assets from the `dist/public` directory
- Build process uses esbuild for server-side code bundling with selective dependency bundling to optimize cold start times

### Data Storage Solutions

**ORM**: Drizzle ORM configured for PostgreSQL database interactions.

**Schema Definition**: Database schemas are defined in `shared/schema.ts` using Drizzle's type-safe schema builder. Currently includes a `users` table with username/password authentication fields.

**Migration Strategy**: Database migrations stored in `/migrations` directory, managed through Drizzle Kit.

**Validation**: Drizzle-Zod integration provides automatic validation schema generation from database schemas, ensuring type safety between database, API, and frontend.

### Authentication and Authorization

**Strategy**: The dependency list includes Passport.js with passport-local strategy, indicating local username/password authentication.

**Session Storage**: Sessions can be stored either in-memory (memorystore) or in PostgreSQL (connect-pg-simple) depending on environment configuration.

The authentication system is defined at the interface level but implementation details suggest it's not fully built out yet, given the minimal route definitions.

### Component Architecture Patterns

**Window Management System**: 
- Windows are managed through a centralized `windowManager` store
- Each window has unique ID, position (x, y), size (width, height), z-index, and state flags (minimized, maximized)
- The `Win95Window` component handles dragging, resizing, and window chrome rendering
- Window content is dynamically loaded based on the `component` field

**Desktop Icon System**:
- Icons use a grid-based layout with snap-to-grid positioning
- Single-click selects, double-click opens
- Context menus are managed through the desktop store
- Icons can be folders, applications, or shortcuts (indicated by shortcut arrow)

**Retro UI Components**:
- `Win95Button`: Implements authentic raised/pressed 3D border effects
- `Win95Dialog`: Modal dialogs with Windows 95 styling
- Custom window chrome with title bars, menu bars, and status bars
- Context menus with separator support and disabled states

## External Dependencies

### Third-Party UI Libraries

**Radix UI**: Comprehensive set of accessible, unstyled React components including dialogs, dropdowns, tooltips, menus, and form controls. Used as the foundation for the shadcn/ui component system.

**shadcn/ui**: Pre-built component library that wraps Radix UI with Tailwind styling. The project uses the "new-york" style variant with custom Windows 95 theming applied on top.

**Embla Carousel**: Carousel/slider functionality for image galleries or content rotation.

**cmdk**: Command palette component library (command+k style interfaces).

### State Management & Data Fetching

**Zustand**: Lightweight state management with middleware support for persistence.

**TanStack Query (React Query)**: Async state management for server data fetching, caching, and synchronization.

### Form Handling

**React Hook Form**: Performant form state management with validation support.

**@hookform/resolvers**: Integration layer for validation libraries.

**Zod**: TypeScript-first schema validation used for both form validation and database schema validation.

### Database & ORM

**Drizzle ORM**: TypeScript ORM for type-safe database queries and schema management.

**pg (node-postgres)**: PostgreSQL client for Node.js.

**Drizzle Kit**: CLI tools for database migrations and schema management.

### Utility Libraries

**date-fns**: Modern JavaScript date utility library.

**class-variance-authority (CVA)**: Utility for building type-safe variant-based component APIs.

**clsx & tailwind-merge**: Conditional class name utilities for Tailwind CSS.

**nanoid**: Compact, URL-safe unique ID generator.

**uuid**: Standard UUID generation.

### Development Tools

**Vite**: Fast build tool and dev server with HMR support.

**TypeScript**: Type-safe JavaScript development.

**PostCSS & Autoprefixer**: CSS processing and vendor prefixing.

**Tailwind CSS**: Utility-first CSS framework with extensive customization.

**tsx**: TypeScript execution engine for Node.js.

**Replit Plugins**: Custom Vite plugins for Replit integration (runtime error overlay, cartographer for code mapping, dev banner).

### Potential Integrations (Based on Dependencies)

**Stripe**: Payment processing integration (dependency present but not actively used in visible code).

**OpenAI**: AI/LLM integration capabilities (dependency present).

**Google Generative AI**: Alternative AI integration option.

**Nodemailer**: Email sending functionality for notifications or newsletters.

**Multer**: File upload handling middleware.

**WebSocket (ws)**: Real-time bidirectional communication support.

**XLSX**: Excel file reading/writing capabilities.

### API & Security

**CORS**: Cross-origin resource sharing middleware for API access control.

**express-rate-limit**: Rate limiting middleware for API protection.

**jsonwebtoken**: JWT token generation and validation (though Passport local strategy suggests session-based auth is primary).

**axios**: Promise-based HTTP client for external API calls.