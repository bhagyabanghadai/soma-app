# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of SOMA seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### How to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: **security@soma-app.com** (or create a private security advisory on GitHub)

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

### What to Include

Please include the requested information listed below (as much as you can provide) to help us better understand the nature and scope of the possible issue:

- Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue

### Preferred Languages

We prefer all communications to be in English.

## Security Best Practices

### For Users

1. **Keep your installation up to date**: Always use the latest version of SOMA
2. **Use strong passwords**: Ensure your account uses a strong, unique password
3. **Enable two-factor authentication**: When available, enable 2FA for your account
4. **Secure your environment variables**: Never commit `.env` files or expose API keys
5. **Use HTTPS**: Always access SOMA over HTTPS in production
6. **Regular backups**: Maintain regular backups of your data

### For Developers

1. **Input validation**: Always validate and sanitize user inputs
2. **SQL injection prevention**: Use parameterized queries and ORM best practices
3. **XSS prevention**: Properly escape output and use Content Security Policy
4. **Authentication**: Implement proper session management and JWT handling
5. **Authorization**: Follow principle of least privilege
6. **Dependency management**: Keep dependencies updated and scan for vulnerabilities
7. **Secrets management**: Never hardcode secrets or API keys
8. **Error handling**: Don't expose sensitive information in error messages

## Security Features

### Authentication & Authorization

- JWT-based authentication with secure token handling
- Role-based access control (RBAC)
- Password hashing using BCrypt
- Session management with secure cookies
- Rate limiting to prevent brute force attacks

### Data Protection

- Input validation and sanitization
- SQL injection prevention through JPA/Hibernate
- XSS protection with proper output encoding
- CSRF protection for state-changing operations
- Secure headers (HSTS, CSP, etc.)

### Infrastructure Security

- HTTPS enforcement in production
- Environment variable management
- Database connection security
- API rate limiting
- Logging and monitoring

## Security Updates

Security updates will be released as soon as possible after a vulnerability is confirmed. Users will be notified through:

- GitHub Security Advisories
- Release notes
- Email notifications (if subscribed)

## Vulnerability Disclosure Timeline

1. **Day 0**: Vulnerability reported
2. **Day 1-2**: Initial response and acknowledgment
3. **Day 3-7**: Vulnerability assessment and validation
4. **Day 8-30**: Development of fix and testing
5. **Day 31-45**: Release of security patch
6. **Day 46+**: Public disclosure (if appropriate)

## Security Hall of Fame

We appreciate security researchers who responsibly disclose vulnerabilities. Contributors will be acknowledged here (with their permission):

<!-- Security researchers who have helped improve SOMA's security will be listed here -->

## Contact

For any security-related questions or concerns, please contact:

- **Email**: security@soma-app.com
- **GitHub**: Create a private security advisory
- **Response Time**: Within 48 hours

## Legal

We will not pursue legal action against researchers who:

- Make a good faith effort to avoid privacy violations, destruction of data, and interruption or degradation of our service
- Only interact with accounts you own or with explicit permission of the account holder
- Do not access, modify, or delete data belonging to others
- Contact us immediately if you inadvertently encounter user data
- Do not perform actions that could harm the reliability/integrity of our services

Thank you for helping keep SOMA and our users safe!