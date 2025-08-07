# Overview

Soma Dashboard is a comprehensive full-stack web application designed for sustainable agriculture management. The platform provides farmers with AI-powered insights and tools to optimize their farming operations while focusing on sustainability, soil health, water management, and carbon footprint tracking. The application features a modern React.js frontend with a robust Java Spring Boot backend, offering production-ready APIs and enterprise-grade security.

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
The backend follows a Spring Boot microservice architecture with the following patterns:
- **API Layer**: Spring Boot REST controllers with JWT authentication and role-based authorization
- **Service Layer**: Business logic separation with transactional support and dependency injection
- **Repository Layer**: Spring Data JPA with PostgreSQL/H2 database support
- **Security**: Spring Security with JWT tokens, BCrypt password encoding, and CORS configuration
- **Database**: Hibernate ORM with automatic schema generation and optimized queries
- **Documentation**: Swagger/OpenAPI 3 integration for comprehensive API documentation
- **Testing**: JUnit unit tests for service layer components with Mockito mocking

## Data Management
- **Database Schema**: Complete JPA entity models for Users, SustainabilityMetrics, and Tips with proper relationships
- **Data Transfer Objects**: Comprehensive DTOs for API requests/responses with validation annotations
- **Repository Pattern**: Spring Data JPA repositories with custom queries and aggregation functions
- **Type Safety**: Java generic types and validation with Bean Validation API
- **Fallback System**: React frontend gracefully falls back to mock data when backend is unavailable

## UI/UX Design Patterns
- **Responsive Design**: Mobile-first approach with breakpoint-specific layouts
- **Component Structure**: Atomic design principles with reusable UI components
- **Navigation**: Fixed top navigation with mobile hamburger menu
- **Data Visualization**: Recharts integration for interactive charts and graphs
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

# External Dependencies

## Core Frameworks
- **React 18**: Primary frontend framework with concurrent features
- **Spring Boot 3.2**: Backend framework with embedded Tomcat server
- **Java 17**: Backend programming language with modern features
- **TypeScript**: Frontend type safety with API integration layer

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
- **Spring Data JPA**: Enterprise-grade ORM with Hibernate implementation
- **PostgreSQL**: Production database with H2 for development/testing
- **Maven**: Dependency management and build automation
- **JWT Authentication**: Secure token-based authentication with role management

## Development Tools
- **Vite**: Build tool and development server
- **ESBuild**: JavaScript bundler for production builds
- **PostCSS**: CSS processing with Autoprefixer

## Data Visualization
- **Recharts**: React charting library for interactive data visualization

## Additional Backend Dependencies
- **Lombok**: Reduces boilerplate code with annotations
- **ModelMapper**: Object mapping between DTOs and entities
- **Swagger/OpenAPI**: API documentation and testing interface
- **JJWT**: JWT token creation and validation library

## API Endpoints Implementation
The Spring Boot backend provides comprehensive REST APIs including:
- **Authentication**: `/api/auth/register`, `/api/auth/login`, `/api/auth/profile`
- **Weather Service**: `/api/weather/current` with location-based data
- **AI Assistant**: `/api/ai/chat` for farming recommendations and insights
- **NASA EarthData**: `/api/nasa/earthdata?lat={lat}&lon={lon}` for satellite agricultural data (NDVI, LST, ET)
- **Sustainability Metrics**: `/api/metrics/*` for carbon and water usage tracking
- **Regenerative Tips**: `/api/tips/*` with admin-only CRUD operations
- **Admin Panel**: `/api/admin/*` for user and metrics management

The architecture supports both live Spring Boot backend connection and graceful fallback to mock data for development/demo purposes, ensuring the application remains functional regardless of backend availability.

## NASA EarthData Integration (Latest Addition)
- **Purpose**: Real-time agricultural environmental monitoring using NASA satellite data
- **Frontend Component**: `/earth-data` route with location input and preset farm locations
- **Backend Service**: EarthDataService with realistic agricultural data generation
- **Data Types**: Vegetation Index (NDVI), Land Surface Temperature, Evapotranspiration rates
- **Agricultural Insights**: Automated status calculations for vegetation health, temperature stress, and drought risk
- **Geographic Coverage**: Global coordinates with climate-zone appropriate realistic data modeling