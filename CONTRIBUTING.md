# Contributing to Teacher Violin

Thank you for your interest in contributing to Teacher Violin! This document provides guidelines for contributing to the project.

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- A clear title and description
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Your environment (OS, React Native version, etc.)

### Suggesting Features

Feature suggestions are welcome! Please:
- Check if the feature has already been requested
- Provide a clear use case
- Explain why this feature would be useful
- Consider if it fits the project's scope

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📋 Development Setup

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Expo CLI
- Git
- Supabase account (for testing)

### Local Setup

```bash
# 1. Fork and clone
git clone https://github.com/YOUR-USERNAME/TeacherVionlin.git
cd TeacherVionlin

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your Supabase credentials

# 4. Run development server
npm start
```

## 🎯 Code Style

### JavaScript/React Native
- Use ES6+ syntax
- Prefer functional components with hooks
- Use async/await for asynchronous operations
- Keep functions small and focused
- Add comments for complex logic

### Example:
```javascript
/**
 * Fetch all students from database
 * @returns {Promise<Object>} Result with success flag and data
 */
export const getStudents = async () => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('epitheto_mathiti', { ascending: true });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Get students error:', error.message);
    return { success: false, error: error.message, data: [] };
  }
};
```

### File Structure
```
TeacherVionlin/
├── App.js                    # Main app component
├── supabaseService.js        # Database service layer
├── screens/                  # All screen components
│   ├── LoginScreen.js
│   ├── HomeScreen.js
│   └── ...
├── components/              # Reusable components (future)
├── utils/                   # Utility functions (future)
├── assets/                  # Images, icons
└── docs/                    # Documentation (future)
```

## 🧪 Testing

### Manual Testing
Before submitting a PR:
1. Test on at least one platform (iOS/Android/Web)
2. Test all affected features
3. Check for console errors
4. Verify error handling
5. Test edge cases

### Future: Automated Testing
We plan to add:
- Unit tests (Jest)
- Integration tests
- E2E tests (Detox)

## 📝 Commit Messages

Use clear, descriptive commit messages:

```bash
# Good
git commit -m "Add student validation to AddEditStudentScreen"
git commit -m "Fix payment status update in lesson form"
git commit -m "Update README with deployment instructions"

# Bad
git commit -m "fix bug"
git commit -m "changes"
git commit -m "update"
```

### Commit Message Format
```
<type>: <subject>

<body (optional)>

<footer (optional)>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Example:**
```
feat: Add export to Excel functionality

- Add export button to PaymentStatsScreen
- Implement Excel generation using xlsx library
- Add date range selection for export

Closes #123
```

## 🔍 Code Review Process

### What We Look For
- Code quality and readability
- Proper error handling
- Security considerations
- Performance implications
- Documentation updates
- Test coverage (when applicable)

### Review Timeline
- Initial feedback: Within 3-7 days
- Follow-up reviews: Within 2-3 days

## 🌐 Internationalization (i18n)

Currently, the app is in Greek. When adding new text:
- Keep it in Greek for consistency
- Use descriptive variable names
- Consider future i18n support

**Future plan:** Add multi-language support using i18n library.

## 🎨 UI/UX Guidelines

### Design Principles
- **Simplicity:** Keep UI clean and uncluttered
- **Consistency:** Use existing patterns and styles
- **Accessibility:** Ensure touch targets are large enough
- **Feedback:** Provide visual feedback for actions

### Colors
Stick to the existing color palette:
- Primary: #5e72e4
- Success: #28a745
- Warning: #ffc107
- Danger: #dc3545

### Components
- Use StyleSheet for styling
- Keep styles in the same file as the component
- Reuse common styles when possible

## 🔐 Security

### Best Practices
- Never commit `.env` files
- Don't expose API keys in code
- Validate user input
- Use prepared statements (Supabase handles this)
- Follow Supabase Row Level Security guidelines

### Reporting Security Issues
For security vulnerabilities, please email directly instead of opening a public issue.

## 📚 Documentation

When adding features:
1. Update README.md if user-facing
2. Update API_DOCUMENTATION.md for new functions
3. Add inline comments for complex logic
4. Update CHANGELOG.md

## 🐛 Debugging Tips

### Common Issues
1. **Module not found:** `rm -rf node_modules && npm install`
2. **Cache issues:** `expo start -c`
3. **Build errors:** Check `package.json` versions
4. **Supabase errors:** Check `.env` and RLS policies

### Debugging Tools
- React Native Debugger
- Chrome DevTools
- Supabase Dashboard logs
- Expo DevTools

## 🚀 Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create release branch
4. Test thoroughly
5. Merge to main
6. Create GitHub release
7. Deploy to production

## 📞 Getting Help

- **Questions:** Open a GitHub Discussion
- **Bugs:** Open an issue
- **Feature requests:** Open an issue with "enhancement" label
- **Security:** Email directly

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🎖️ Contributors

Contributors will be listed in the README.md. Thank you for your contributions!

## 📋 Checklist for Contributors

Before submitting a PR:
- [ ] Code follows the style guidelines
- [ ] Self-review of code completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No console errors
- [ ] Tested on at least one platform
- [ ] Screenshots added for UI changes
- [ ] Commit messages are descriptive

## 🌟 Areas for Contribution

We especially welcome contributions in:

### High Priority
- [ ] Push notifications for lessons
- [ ] Data export (Excel/PDF)
- [ ] Backup/restore functionality
- [ ] Dark mode support
- [ ] Unit tests

### Medium Priority
- [ ] Multi-language support (i18n)
- [ ] Student progress tracking
- [ ] Lesson notes with attachments
- [ ] Payment reminders
- [ ] Custom recurring patterns

### Low Priority
- [ ] Statistics charts/graphs
- [ ] Calendar sync (Google, Apple)
- [ ] SMS notifications
- [ ] Multi-user with separate data
- [ ] Offline mode

## 🤔 Questions?

Don't hesitate to ask! Open an issue or start a discussion. We're here to help.

---

**Thank you for contributing to Teacher Violin! 🎻**
