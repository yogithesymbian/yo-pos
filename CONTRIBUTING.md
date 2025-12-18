# Contributing to YO-POS

Thank you for your interest in contributing to YO-POS! This document provides guidelines and information for contributors.

## 🎯 Project Vision

YO-POS aims to provide a modern, offline-first point-of-sale and inventory management system for retail stores. Our focus is on:

- **Reliability**: Offline-first architecture for uninterrupted operations
- **Usability**: Intuitive interface for fast, efficient workflows
- **Flexibility**: Extensible architecture for future enhancements
- **Intelligence**: Agentic AI integration for automation and insights

## 🚀 Getting Started

### Development Environment Setup

> **Note**: Full setup instructions will be added once the starter code is implemented.

1. Fork and clone the repository
2. Install dependencies
3. Set up local database
4. Configure environment variables
5. Run development servers

## 📋 How to Contribute

### Reporting Bugs

Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md) to report bugs. Please include:

- Clear description of the issue
- Steps to reproduce
- Expected vs. actual behavior
- Environment details
- Screenshots or logs if applicable

### Suggesting Features

Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md) for new ideas. Include:

- Clear description of the feature
- Problem it solves
- Proposed solution
- Technical considerations
- Acceptance criteria

### Agentic AI Tasks

For AI-related enhancements, use the [Agentic AI Task template](.github/ISSUE_TEMPLATE/agentic_ai_task.md). This helps structure:

- AI task objectives
- Input/output specifications
- Integration requirements
- Success metrics
- Testing strategy

## 🔄 Development Workflow

### Branching Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Critical production fixes
- `ai/*` - Agentic AI implementations

### Commit Message Convention

Follow conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Test additions or modifications
- `chore`: Build process or auxiliary tool changes
- `ai`: Agentic AI related changes

**Examples:**
```
feat(scanner): add bulk scanning with keypress workflow
fix(transaction): correct stock reduction calculation
docs(readme): update installation instructions
ai(inventory): implement restocking prediction model
```

## 🏗️ Code Standards

### Frontend (Vue 3)
- Use Composition API
- Follow Vue style guide
- Use Element UI components consistently
- Implement proper error handling
- Write meaningful component documentation

### Backend (Node.js)
- Use async/await for asynchronous operations
- Follow RESTful API conventions
- Implement proper error handling middleware
- Use Sequelize models and migrations
- Write comprehensive JSDoc comments

### Database
- Use Sequelize migrations for schema changes
- Include proper indexes for performance
- Document complex queries
- Follow naming conventions (snake_case for tables/columns)

## 🧪 Testing

### Test Requirements
- Unit tests for business logic
- Integration tests for API endpoints
- E2E tests for critical user flows
- Test coverage minimum: 80%

### Running Tests
```bash
# Run all tests
npm test

# Run specific test suite
npm test -- frontend
npm test -- backend
npm test -- print-service

# Run with coverage
npm run test:coverage
```

## 📝 Documentation

- Update README.md for user-facing changes
- Update API documentation for endpoint changes
- Add inline comments for complex logic
- Create/update diagrams for architectural changes
- Document new environment variables

## 🔍 Code Review Process

1. Create a pull request with clear description
2. Link related issues
3. Ensure CI checks pass
4. Request review from maintainers
5. Address review comments
6. Obtain approval before merging

### Pull Request Guidelines

**Title Format:** `[Type] Brief description`

**Description Should Include:**
- What changed and why
- Related issues
- Testing performed
- Screenshots (for UI changes)
- Breaking changes (if any)
- Migration steps (if needed)

## 🤝 Community Guidelines

### Code of Conduct
- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Assume good intentions
- Report inappropriate behavior

### Communication Channels
- GitHub Issues: Bug reports and feature requests
- GitHub Discussions: Questions and ideas
- Pull Requests: Code contributions and reviews

## 🎓 Resources

### Learning Materials
- [Vue 3 Documentation](https://vuejs.org/)
- [Element UI Documentation](https://element-plus.org/)
- [Sequelize Documentation](https://sequelize.org/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

### Project Structure
```
yo-pos/
├── packages/
│   ├── frontend/       # Vue 3 application
│   ├── backend/        # Node.js API server
│   └── print-service/  # Printer integration
├── docs/              # Detailed documentation
├── scripts/           # Build and utility scripts
└── tests/             # Integration and E2E tests
```

## 📜 License

By contributing to YO-POS, you agree that your contributions will be licensed under the same license as the project.

## ❓ Questions?

If you have questions about contributing, feel free to:
- Open a discussion on GitHub
- Review existing issues and pull requests
- Reach out to the maintainers

---

Thank you for contributing to YO-POS! Every contribution helps make this project better.
