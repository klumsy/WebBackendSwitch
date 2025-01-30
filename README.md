# Multi-Service Microservices Application Framework

A production-ready, security-focused microservices framework demonstrating modern architectural patterns and best practices in distributed systems design.

## 🔬 Research Project Overview

This project was created as a comprehensive research initiative to explore and demonstrate:
1. Using AI agents (specifically Replit) to architect and build complex, multi-layer applications
2. Implementing proper separation of concerns across different technology stacks
3. Integrating comprehensive testing strategies across all layers
4. Analyzing security implications and best practices in microservices
5. Documenting the development process and architectural decisions

The goal was to create a real-world example of how AI-assisted development can handle complex architectural decisions, security considerations, and testing requirements while maintaining code quality and proper separation of concerns.

## Why This Project?

This framework was created to demonstrate how to:
1. Build scalable microservices with proper separation of concerns
2. Implement secure service-to-service communication
3. Handle cross-cutting concerns like authentication and logging
4. Maintain data consistency across distributed services

## 🏗 Architecture

### Service Stack
- **Frontend**: React with TypeScript
  - State Management: React Query
  - Routing: wouter
  - UI Components: shadcn/ui
- **Backend Services**:
  - Service A (User Management): Python Flask
  - Service B (Post Management): TypeScript/Node.js
  - Service C (Calculator): .NET Core
- **Database**: SQLite with:
  - Flask-SQLAlchemy (Service A)
  - Drizzle ORM (Service B)
- **API Layer**:
  - REST endpoints
  - GraphQL gateway (planned)

For detailed architecture information, see [Technical Architecture](./README2.MD).

## 🚀 Getting Started

### Prerequisites
- Node.js 20.x
- Python 3.11
- .NET Core 7.0
- SQLite 3

### Development Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/multi-service-app.git
   cd multi-service-app
   ```

2. **Install dependencies**
   ```bash
   npm install              # Frontend and Service B dependencies
   pip install -r requirements.txt  # Service A dependencies
   dotnet restore          # Service C dependencies
   ```

3. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Configure required environment variables (see [Environment Setup](./ENVIRONMENT_SETUP.md))

4. **Start Development Server**
   ```bash
   npm run dev
   ```

For detailed setup instructions, see [Environment Setup](./ENVIRONMENT_SETUP.md).

## 🧪 Testing

### Test Coverage
- Service A: pytest (90%+ coverage)
- Service B: Jest (85%+ coverage)
- Service C: xUnit (85%+ coverage)
- Frontend: React Testing Library

### Running Tests
```bash
# Service A
cd services/service_a
pytest

# Service B
cd services/service-b
npm test

# Service C
cd services/service_c
dotnet test

# Frontend
npm run test
```

For comprehensive test documentation, see the testing sections in our [Product Requirements Document](./PRD3.MD).

## 🛡 Security

This project implements comprehensive security measures across all services. Key features:
- Secure session management
- Service-to-service authentication
- Rate limiting
- CSRF protection
- XSS prevention

### Security Documentation
- [Security Report](./SECURITYREPORT.MD)
- [Security Recommendations](./SECURITYRECOMMENDATIONS.MD)

## 📚 Documentation

- [Original Technical Overview](./ORIGINALREADME.md)
- [Latest Technical Overview](./README2.MD)
- [Initial Product Requirements](./PRD2.MD)
- [Detailed Product Requirements](./PRD3.MD)
- [Security Analysis](./SECURITYREPORT.MD)
- [Security Recommendations](./SECURITYRECOMMENDATIONS.MD)
- [Environment Setup Guide](./ENVIRONMENT_SETUP.md)

## 💻 Development Costs

### Implementation Estimation
- Frontend Development: ~4 weeks
- Backend Services: ~6 weeks
- Testing & Security Implementation: ~3 weeks
- Total: ~13 weeks for a team of 2-3 developers

For detailed estimates, see [ESTIMATES.MD](./ESTIMATES.MD).

## 🌟 Production Deployment

### Requirements
- Node.js production environment
- Python production environment
- .NET Core runtime
- PostgreSQL database (recommended for production)
- Redis for session management
- Reverse proxy (nginx recommended)

### Deployment Steps
1. Configure production environment variables
2. Set up databases and migrations
3. Configure reverse proxy
4. Set up monitoring and logging
5. Deploy services
6. Configure SSL/TLS

For detailed deployment instructions, see [Environment Setup Guide](./ENVIRONMENT_SETUP.md#production-environment).

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

Please ensure you:
- Follow the existing code style
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the UI component system
- [Drizzle ORM](https://orm.drizzle.team/) for the TypeScript ORM
- [Flask-SQLAlchemy](https://flask-sqlalchemy.palletsprojects.com/) for the Python ORM

## ⚡️ Performance

The application is designed to handle:
- 1000+ concurrent users
- 100+ requests/second per service
- Sub-200ms API response times
- Efficient cross-service communication

For detailed performance metrics and monitoring implementation, see [Environment Setup Guide](./ENVIRONMENT_SETUP.md#monitoring-setup).

---

Built with ❤️ by Karl Prosser