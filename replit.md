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
The backend provides comprehensive REST APIs including:
- **Weather Forecast**: `/api/weather?lat={lat}&lon={lon}` using National Weather Service API with location-based forecasts
- **NASA EarthData**: `/api/nasa/earthdata?lat={lat}&lon={lon}` for satellite agricultural data (NDVI, LST, ET)
- **Air Quality**: `/api/air-quality?lat={lat}&lon={lon}` using AQICN World Air Quality Index API for pollution monitoring
- **AI Assistant**: `POST /api/ai/chat` with intelligent agricultural knowledge base for farming recommendations and insights
- **Sustainability Metrics**: `/api/metrics/*` for carbon and water usage tracking
- **Authentication**: `/api/auth/register`, `/api/auth/login`, `/api/auth/profile`
- **Admin Panel**: `/api/admin/*` for user and metrics management

The architecture supports both live Spring Boot backend connection and graceful fallback to mock data for development/demo purposes, ensuring the application remains functional regardless of backend availability.

## Sustainability Dashboard (Latest Update)
- **Purpose**: Unified environmental monitoring dashboard replacing separate Earth Data, Weather, and Air Quality pages
- **Frontend Component**: Root `/` route with comprehensive environmental data visualization
- **Location Input**: Multiple methods - GPS detection, place name search, manual coordinates, and preset farm locations
- **Data Integration**: Combines NASA EarthData, Weather Forecast, and Air Quality data in real-time
- **Layout**: 2-column responsive grid with environmental summary, weather forecast, air quality index, and AI suggestions
- **AI Insights**: Smart recommendations based on current environmental conditions and agricultural best practices
- **Mobile Friendly**: Single-column layout on mobile devices with collapsible sections
- **Navigation**: Removed separate environmental monitoring pages in favor of unified dashboard experience

## Enhanced Dashboard Features (Latest Update - January 15, 2025)
- **Environmental Analytics Component**: Advanced data visualization with interactive charts showing NDVI trends, temperature patterns, AQI tracking, and soil moisture analytics
- **Environmental Alerts System**: Real-time alert generation based on live environmental conditions with priority levels, actionable recommendations, and dismissible notifications
- **Farm Profile Manager**: Comprehensive farm information management including crop types, equipment inventory, certifications, sustainability goals, and location coordinates
- **Enhanced AI Assistant**: Improved context awareness with farm profile integration, seasonal considerations, urgency detection, and environmental alerts incorporation
- **Dashboard Controls**: Added Farm Profile and Analytics toggle buttons in dashboard header for easy access to enhanced features
- **Visual Analytics**: 30-day environmental summary charts, health scoring system, and trend analysis with confidence indicators

## Enhanced Sustainability Reports (Latest Update - January 15, 2025)  
- **Interactive Charts**: Line charts for NDVI trends, bar charts for water usage, carbon sequestration tracking, and soil pH stability monitoring
- **Historical Data Visualization**: 12-month trend analysis with responsive charts using Recharts library
- **Real-time Metrics Integration**: Live environmental data from NASA, NWS, and AQICN APIs integrated into comprehensive reporting
- **Enhanced Export Functionality**: Downloadable JSON reports with complete environmental analysis and AI-powered recommendations

## Floating AI Assistant Integration (Enhanced - GLM 4.5)
- **Purpose**: Website-wide floating AI assistant powered by GLM 4.5 language model accessible from all pages
- **AI Model**: GLM 4.5 (glm-4-plus) integrated via ZhipuAI API with fallback to local knowledge base
- **Frontend Component**: Floating chat box accessible globally across all pages with minimizable interface
- **Backend Service**: Express API endpoint with GLM 4.5 integration, comprehensive context awareness, and agricultural knowledge fallback
- **Knowledge Areas**: Soil health, water/irrigation, crop selection, pest management, fertilizer management, climate adaptation, carbon sequestration, equipment/technology, financial planning, harvest/storage
- **Enhanced Context Integration**: AI now has access to farm profile data, environmental alerts, seasonal considerations, and urgency levels for more targeted recommendations
- **Response System**: Context-aware AI responses with confidence scoring, source attribution, and actionable recommendations
- **Data Quality**: API response normalization layer with intelligent caching, validation, and cross-source correlation
- **UI Features**: Professional floating interface with quick suggestions, conversation history, typing indicators, and confidence scoring
- **Navigation Update**: Removed dedicated AI Assistant page in favor of global floating chat accessibility