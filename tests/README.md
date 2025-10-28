# Playwright Testing Setup

## Initial Setup

### 1. Install Browser Binaries

**IMPORTANT:** Before running tests for the first time, you must install the required browser binaries:

```bash
npx playwright install
```

This will download Chromium, Firefox, and WebKit browsers used for testing.

### 2. Verify Installation

Check that browsers are installed:

```bash
npx playwright install --help
```

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests with visible browser
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Show test report (after running tests)
npm run test:report

# Run tests with UI mode
npm run test:ui
```

### Browser-Specific Testing

```bash
# Test on Chromium only
npm run test:chromium

# Test on Firefox only
npm run test:firefox

# Test on WebKit (Safari) only
npm run test:webkit
```

## Configuration

The test configuration is in `playwright.config.js` at the project root:

- **Base URL:** `http://localhost:3000`
- **Test timeout:** 30 seconds
- **Expect timeout:** 5 seconds
- **Trace:** Enabled on first retry
- **Screenshots:** Only on failure

## Test Structure

Tests are located in the `./tests/` directory:

- `robux-calculator.spec.js` - Comprehensive tests for the Robux calculator

## Prerequisites

Before running tests, ensure:

1. Your local development server is running on `http://localhost:3000`
2. Browser binaries are installed (run `npx playwright install`)
3. Node.js and npm are installed

## Troubleshooting

### Browsers Not Found

If you see errors about missing browsers:

```bash
npx playwright install
```

### Port Already in Use

If `localhost:3000` is already in use, either:
- Stop the conflicting service
- Update `baseURL` in `playwright.config.js`

### Tests Timing Out

- Check that your server is running and accessible
- Verify the `baseURL` in `playwright.config.js` matches your server
- Increase timeout values in `playwright.config.js` if needed

## Writing New Tests

Example test structure:

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calculator-path/');
  });

  test('should perform action', async ({ page }) => {
    await page.fill('#input-id', 'value');
    await expect(page.locator('#output-id')).toHaveText('expected');
  });
});
```

## More Information

See [Playwright Documentation](https://playwright.dev) for detailed API reference and best practices.
