# Multi-Service Application with Microservices Architecture

## Project Overview
This project demonstrates a scalable multi-service application utilizing microservices architecture with robust data persistence and modular design. It focuses on inter-service communication patterns and flexible system architecture.

### Development Constraints & Choices
- **Frontend**: While originally planned to use Svelte, the development environment constraints required React. This adaptation maintains the core functionality while leveraging React's robust ecosystem.
- **Backend Services**: 
  - Service A: Python Flask for user management (as planned)
  - Service B: TypeScript/Node.js for post management (adapted from original Deno plan)
  - Service C: .NET Core for calculator functionality (additional service)
- **Frontend**: React with modern tooling
- **Database**: SQLite with Flask-SQLAlchemy and Drizzle ORM
- **State Management**: React Query
- **UI Components**: shadcn/ui
- **Routing**: wouter for client-side routing

### Core Technologies
- **Backend Services**:
  - Service A: Python Flask for user management
  - Service B: TypeScript/Node.js for post management
  - Service C: .NET Core for calculator functionality
- **Frontend**: React with modern tooling
- **Database**: SQLite with Flask-SQLAlchemy and Drizzle ORM
- **State Management**: React Query
- **UI Components**: shadcn/ui
- **Routing**: wouter for client-side routing

## Architecture Overview

### Service Communication Pattern
The application uses a hybrid approach for service communication:
1. **Public APIs**: Each service exposes public endpoints for frontend consumption
2. **Internal APIs**: Services communicate through protected internal endpoints using API keys
3. **Gateway Layer**: Express server acts as an API gateway, routing requests to appropriate services

### Service Breakdown

#### Service A (User Management)
- **Technology**: Python Flask
- **Responsibility**: User CRUD operations
- **Database**: SQLite with Flask-SQLAlchemy
- **Key Features**:
  - User creation and management
  - Internal user verification endpoints
  - Protected routes for service-to-service communication

#### Service B (Post Management)
- **Technology**: TypeScript/Node.js
- **Responsibility**: Post CRUD operations
- **Database**: SQLite with Drizzle ORM
- **Key Features**:
  - Post creation and listing
  - User-post relationship management
  - Internal API for post verification

#### Service C (Calculator)
- **Technology**: .NET Core
- **Responsibility**: Mathematical operations
- **Key Features**:
  - Addition operations
  - Random number generation
  - Timestamp tracking

### Frontend Architecture
- **Component Structure**: Modular design using shadcn/ui
- **State Management**: React Query for server state
- **Routing**: wouter for lightweight client-side routing
- **API Integration**: Currently using REST APIs directly (GraphQL planned but not implemented)

## Development Guide

### Getting Started
1. The application runs in Replit environment
2. All services start automatically via the main Express server
3. Frontend development server runs concurrently

### Key Implementation Details

#### Service Communication
- Services communicate through internal APIs protected by `INTERNAL_API_KEY`
- API gateway in Express handles routing and service discovery
- Cross-Origin Resource Sharing (CORS) configured for development

#### Database Management
- Each service maintains its own SQLite database
- Flask-SQLAlchemy for Service A
- Drizzle ORM for Service B
- No direct database access between services
- Migrations handled through Flask-Migrate and Drizzle

#### Testing Infrastructure
- Service A (Python):
  - pytest with Flask test client
  - SQLite in-memory database for tests
  - Comprehensive test coverage for models and routes
- Service B (TypeScript):
  - Jest with TypeScript support
  - In-memory database testing
  - API integration tests
- Frontend:
  - React Testing Library
  - Component unit tests
  - Integration tests for key features

#### Error Handling
- Comprehensive error handling at service level
- Frontend error boundaries and toast notifications
- Detailed logging in each service

#### Authentication System
- Internal API authentication using `INTERNAL_API_KEY`
- Service-to-service verification before data access
- Token validation middleware

### Development Workflow
1. Services auto-start through Express server
2. Changes to any service trigger automatic restart
3. Frontend hot reloading enabled
4. Database changes require migration scripts

### Maintenance Guidelines

### Adding New Features
1. Identify the appropriate service for new functionality
2. Implement the feature in isolation
3. Add necessary internal APIs if cross-service communication is required
4. Update the frontend accordingly

### Testing Strategy
1. Run unit tests for individual services
2. Verify cross-service communication
3. Test frontend components and integration
4. Ensure proper error handling

### Common Issues
1. Service startup order dependencies
2. Database connection issues
3. CORS configuration in development
4. TypeScript type mismatches

## Security Considerations
1. Internal API authentication
2. CORS configuration
3. Input validation at service level
4. Proper error handling to prevent information leakage

## Planned Improvements
1. Complete GraphQL Integration:
   - Connect GraphQL server to Express gateway
   - Implement service clients for resolvers
   - Migrate frontend to use GraphQL queries
2. Enhanced Authentication:
   - Add user session management
   - Implement proper login/signup flows
3. Testing Coverage:
   - Add end-to-end testing
   - Implement performance testing