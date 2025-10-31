# Contributing to SideKick

Thank you for your interest in contributing to SideKick! This document provides guidelines and instructions for contributing.

## Development Setup

See [docs/SETUP.md](./docs/SETUP.md) for detailed setup instructions.

## Project Structure

```
SideKick/
├── frontend/           # React + Zoom Apps SDK
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── store/      # Zustand stores
│   │   └── ...
├── backend/            # Node.js + Express API
│   ├── src/
│   │   ├── routes/     # API routes
│   │   ├── services/   # Business logic
│   │   ├── db/         # Database schema
│   │   └── ...
├── shared/             # Shared types
└── docs/               # Documentation
```

## Development Workflow

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic

3. **Test your changes**
   ```bash
   # Frontend
   cd frontend && npm run build

   # Backend
   cd backend && npm run build
   ```

4. **Commit with clear messages**
   ```bash
   git commit -m "Add: feature description"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` types
- Use meaningful variable names

### React

- Use functional components with hooks
- Keep components small and focused
- Use proper prop types
- Implement error boundaries

### Backend

- Use async/await (not callbacks)
- Proper error handling
- Validate input data
- Log important operations

## Git Commit Messages

Format: `<type>: <description>`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Maintenance

Examples:
```
feat: add custom checklist creation
fix: resolve WebSocket connection issue
docs: update setup instructions
```

## Testing

### Frontend Testing

```bash
cd frontend
npm run test
```

### Backend Testing

```bash
cd backend
npm run test
```

## Pull Request Process

1. Update documentation if needed
2. Ensure all tests pass
3. Update README if adding features
4. Request review from maintainers
5. Address review comments
6. Squash commits if requested

## Code Review

We review PRs for:
- Code quality and style
- Test coverage
- Documentation
- Performance implications
- Security considerations

## Feature Requests

Open an issue with:
- Clear description
- Use case
- Proposed solution
- Alternative approaches

## Bug Reports

Include:
- Description of issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Environment details

## Questions?

- Check documentation first
- Search existing issues
- Open a discussion issue
- Join our community chat (if available)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
