# Contributing to BoldVision

Thank you for your interest in contributing to BoldVision! We welcome contributions from the community.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, Node version)

### Suggesting Features

1. Check if the feature has already been suggested
2. Create a new issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Potential implementation approach

### Pull Requests

1. Fork the repository
2. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make your changes:
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. Test your changes:
   - Ensure all existing tests pass
   - Add new tests if applicable
   - Test in multiple browsers

5. Commit your changes:
   ```bash
   git commit -m "feat: add new feature description"
   ```

   Use conventional commit messages:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `style:` for formatting
   - `refactor:` for code restructuring
   - `test:` for tests
   - `chore:` for maintenance

6. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

7. Open a Pull Request:
   - Provide clear description
   - Reference related issues
   - Wait for review

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   cd client && npm install
   ```

2. Set up environment variables (see README.md)

3. Run in development mode:
   ```bash
   npm run dev
   ```

## Code Style

- Use ES6+ features
- Use meaningful variable names
- Keep functions small and focused
- Add JSDoc comments for functions
- Use Prettier for formatting
- Follow React best practices

## Testing

- Test all user interactions
- Verify API endpoints
- Check database operations
- Test across browsers
- Verify responsive design

## Questions?

Feel free to open an issue for any questions or reach out to the maintainers.

Thank you for contributing to BoldVision!
