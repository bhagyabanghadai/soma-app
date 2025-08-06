# Overview

Soma Dashboard is a comprehensive React-based web application designed for sustainable agriculture management. The platform provides farmers with AI-powered insights and tools to optimize their farming operations while focusing on sustainability, soil health, water management, and carbon footprint tracking. The application features a modern, professional UI built with React.js, Tailwind CSS, and shadcn/ui components, themed around green technology and environmental consciousness.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The application uses a React single-page application (SPA) architecture with the following key decisions:
- **React Router**: Implemented with Wouter for lightweight client-side routing, chosen for its minimal bundle size and simple API
- **Component Library**: Built on shadcn/ui and Radix UI primitives, providing accessible, customizable components with consistent design system
- **Styling**: Tailwind CSS for utility-first styling with custom CSS variables for brand colors (soma-green, soma-yellow, soma-grey)
- **State Management**: React Query (TanStack Query) for server state management and local React state for UI interactions
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
The backend follows an Express.js server architecture with the following patterns:
- **API Layer**: Express.js with middleware for request logging and error handling
- **Storage Interface**: Abstracted storage layer with IStorage interface, currently implemented as in-memory storage but designed for easy database integration
- **Development Setup**: Vite middleware integration for development server with hot module replacement
- **Build Process**: ESBuild for server-side bundling with platform-specific optimizations

## Data Management
- **Mock Data**: Currently uses static mock data for demonstration purposes, structured to simulate real farm metrics
- **Database Schema**: Prepared with Drizzle ORM schema for PostgreSQL integration, including user management tables
- **Type Safety**: TypeScript throughout with shared type definitions between client and server

## UI/UX Design Patterns
- **Responsive Design**: Mobile-first approach with breakpoint-specific layouts
- **Component Structure**: Atomic design principles with reusable UI components
- **Navigation**: Fixed top navigation with mobile hamburger menu
- **Data Visualization**: Recharts integration for interactive charts and graphs
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

# External Dependencies

## Core Frameworks
- **React 18**: Primary frontend framework with concurrent features
- **Express.js**: Backend server framework
- **TypeScript**: Type safety across the entire stack

## UI Components & Styling
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Radix UI**: Headless UI components for accessibility and customization
- **shadcn/ui**: Component library built on top of Radix UI
- **Lucide React**: Icon library for consistent iconography

## Data & State Management
- **TanStack React Query**: Server state management and caching
- **React Hook Form**: Form state management and validation
- **Zod**: Schema validation library
- **date-fns**: Date manipulation utilities

## Database & ORM
- **Drizzle ORM**: Type-safe database ORM with PostgreSQL support
- **Neon Database**: Serverless PostgreSQL database (configured for production)

## Development Tools
- **Vite**: Build tool and development server
- **ESBuild**: JavaScript bundler for production builds
- **PostCSS**: CSS processing with Autoprefixer

## Data Visualization
- **Recharts**: React charting library for interactive data visualization

## Session Management
- **connect-pg-simple**: PostgreSQL session store for Express sessions

The architecture is designed for scalability and maintainability, with clear separation of concerns between frontend and backend, and preparation for real database integration while currently operating with mock data for demonstration purposes.