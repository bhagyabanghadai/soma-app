# Contributing to SOMA

We love your input! We want to make contributing to SOMA as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

## Pull Requests

Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Development Setup

### Prerequisites
- Node.js 20+
- Java 17+
- Maven 3.6+
- Git

### Local Development

1. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/soma-app.git
   cd soma-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Start backend (optional)**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

### Code Style

#### Frontend (TypeScript/React)
- Use TypeScript for all new code
- Follow React best practices and hooks patterns
- Use Tailwind CSS for styling
- Prefer functional components over class components
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

#### Backend (Java/Spring Boot)
- Follow Java naming conventions
- Use Spring Boot best practices
- Add proper error handling
- Write unit tests for service layer
- Use Lombok annotations to reduce boilerplate
- Follow REST API conventions

### Testing

#### Frontend Tests
```bash
npm test
```

#### Backend Tests
```bash
cd backend
mvn test
```

### Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation changes
- `style:` formatting, missing semicolons, etc.
- `refactor:` code change that neither fixes a bug nor adds a feature
- `test:` adding missing tests
- `chore:` maintain

Examples:
```
feat: add weather forecast integration
fix: resolve dashboard loading issue
docs: update API documentation
refactor: optimize database queries
```

## Any Contributions You Make Will Be Under the MIT Software License

In short, when you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report Bugs Using GitHub's [Issue Tracker](https://github.com/bhagyabanghadai/soma-app/issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/bhagyabanghadai/soma-app/issues/new).

### Bug Report Guidelines

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

### Feature Requests

We welcome feature requests! Please provide:

- **Use case**: Describe the problem you're trying to solve
- **Proposed solution**: How you envision the feature working
- **Alternatives considered**: Other approaches you've thought about
- **Additional context**: Screenshots, mockups, or examples

## Project Structure Guidelines

### Frontend (`client/src/`)
```
client/src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (buttons, inputs, etc.)
│   └── features/       # Feature-specific components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── contexts/           # React contexts
└── types/              # TypeScript type definitions
```

### Backend (`backend/src/main/java/com/soma/`)
```
com/soma/
├── controller/         # REST controllers
├── service/           # Business logic
├── repository/        # Data access layer
├── model/             # JPA entities
├── dto/               # Data transfer objects
├── config/            # Configuration classes
├── security/          # Security configuration
└── exception/         # Custom exceptions
```

## API Guidelines

### REST API Conventions
- Use RESTful URLs
- Use HTTP methods appropriately (GET, POST, PUT, DELETE)
- Return appropriate HTTP status codes
- Use consistent error response format
- Include proper API documentation

### Error Handling
- Always return meaningful error messages
- Use appropriate HTTP status codes
- Include error codes for programmatic handling
- Log errors appropriately

## Security Guidelines

- Never commit secrets, API keys, or passwords
- Use environment variables for configuration
- Validate all user inputs
- Use HTTPS in production
- Follow OWASP security guidelines
- Implement proper authentication and authorization

## Performance Guidelines

- Optimize database queries
- Use caching where appropriate
- Minimize bundle size
- Optimize images and assets
- Use lazy loading for components
- Monitor and profile performance

## Documentation

- Update README.md for significant changes
- Add JSDoc/JavaDoc comments for public APIs
- Update API documentation
- Include examples in documentation
- Keep documentation up to date

## Questions?

Feel free to open an issue with the `question` label if you have any questions about contributing!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.