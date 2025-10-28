# Playwright Testing Setup

## Quick Setup

### 1. Run the Setup Script

```bash
./setup-playwright.sh
```

This script will:
- ✅ Check if Playwright is installed
- ✅ Install browser binaries if needed
- ✅ Verify the setup is complete

### 2. Start Your Development Server

Before running tests, make sure your local server is running:

```bash
# Your server should be accessible at http://localhost:3000
```

### 3. Run Tests

```bash
npm test
```

## Alternative Manual Setup

If you prefer to set up manually:

```bash
# Install browser binaries
npm run setup:browsers

# Or use the Playwright CLI directly
npx playwright install
```

## Available Commands

```bash
npm test                  # Run all tests
npm run test:headed       # Run with visible browser
npm run test:debug        # Run in debug mode
npm run test:report       # Show HTML report
npm run setup:browsers    # Install browser binaries
```

## What's Installed?

The setup installs three browser engines used for testing:

- **Chromium** - Chrome/Edge compatible browser
- **Firefox** - Firefox browser
- **WebKit** - Safari compatible browser

## Troubleshooting

### Browsers Not Found Error

If you see "Executable doesn't exist" errors:

```bash
npm run setup:browsers
```

### First Time Setup Checklist

- [ ] Run `npm install` to install dependencies
- [ ] Run `./setup-playwright.sh` or `npm run setup:browsers`
- [ ] Start your development server on port 3000
- [ ] Run `npm test` to verify everything works

## More Information

See [tests/README.md](tests/README.md) for detailed testing documentation.


