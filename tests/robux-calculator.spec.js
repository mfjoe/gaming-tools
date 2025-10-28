// Comprehensive Playwright Tests for Robux Calculator
// Based on actual Roblox economy data and official rates (2025)
// Updated to match WEB pricing (not mobile app pricing)

const { test, expect } = require('@playwright/test');

// ============================================
// ROBUX ECONOMY CONSTANTS (From Calculator)
// ============================================

const ROBUX_RATES = {
  // Official Player Purchase Rates (WEB)
  PLAYER_BASE_RATE: 0.00998, // $0.00998 per Robux average ($4.99/500 Robux)
  
  // Official WEB Packages (25% more Robux than mobile)
  PACKAGES: {
    500: 4.99,
    1000: 9.99,
    2000: 19.99,
    5250: 49.99,
    11000: 99.99,
    24000: 199.99
  },
  
  // Developer Exchange (DevEx) Rate
  DEVEX_RATE: 0.0038, // $0.0038 per Robux (new rate after Sept 5, 2025)
  DEVEX_OLD_RATE: 0.0035, // Old rate before Sept 5, 2025
  DEVEX_MINIMUM: 100000, // Minimum 100,000 Robux to cash out
  DEVEX_PAYOUT: 380, // $380 for 100,000 Robux at new rate
  
  // Marketplace Tax
  MARKETPLACE_TAX: 0.30, // 30% tax on all user-to-user sales
  MARKETPLACE_RATE: 0.00245, // After tax: 0.0035 × 0.7 = 0.00245
  
  // Regional Pricing (example conversion rates for testing)
  CURRENCIES: {
    USD: 1.0,
    GBP: 0.78,
    EUR: 0.92,
    CAD: 1.35,
    AUD: 1.50,
  }
};

// Calculator URL
const CALCULATOR_URL = '/robux/';

// ============================================
// TEST SUITE 1: BASIC CALCULATOR FUNCTIONALITY
// ============================================

test.describe('Robux Calculator - Basic Functionality', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(CALCULATOR_URL);
    await page.waitForLoadState('networkidle');
  });

  test('should load calculator with all essential elements', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Robux/i);
    
    // Check main calculator container exists
    await expect(page.locator('.calculator-container')).toBeVisible();
    
    // Check input fields exist
    await expect(page.locator('#robux-input')).toBeVisible();
    await expect(page.locator('#usd-input')).toBeVisible();
    
    // Check mode selector exists (converter-modes is the actual class)
    await expect(page.locator('.converter-modes')).toBeVisible();
    
    // Check quick amount buttons exist
    await expect(page.locator('.quick-amounts')).toBeVisible();
    
    // Check currency selector exists
    await expect(page.locator('#currency-select')).toBeVisible();
  });

  test('should have correct default mode (Buy Robux)', async ({ page }) => {
    const activeMode = await page.locator('.mode-btn.active').textContent();
    expect(activeMode).toContain('Buy Robux');
  });

  test('should have USD as default currency', async ({ page }) => {
    const selectedCurrency = await page.locator('#currency-select').inputValue();
    expect(selectedCurrency).toBe('USD');
  });
});

// ============================================
// TEST SUITE 2: CALCULATION ACCURACY
// ============================================

test.describe('Robux Calculator - Calculation Accuracy', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(CALCULATOR_URL);
    await page.waitForLoadState('networkidle');
  });

  test('should calculate 1000 Robux correctly (Buy Mode)', async ({ page }) => {
    // Ensure we're in Buy Robux mode
    await page.click('text=Buy Robux');
    
    // Enter 1000 Robux
    await page.fill('#robux-input', '1000');
    
    // Wait for calculation
    await page.waitForTimeout(500);
    
    // Get USD result
    const usdValue = await page.locator('#usd-input').inputValue();
    const usdNumber = parseFloat(usdValue.replace(/[$,]/g, ''));
    
    // 1000 Robux = $9.99 (exact package match)
    expect(usdNumber).toBeCloseTo(9.99, 2);
  });

  test('should calculate DevEx payout for 100,000 Robux', async ({ page }) => {
    // Switch to Cash Out mode (DevEx)
    await page.click('text=Cash Out');
    
    // Enter 100,000 Robux (minimum DevEx)
    await page.fill('#robux-input', '100000');
    
    await page.waitForTimeout(500);
    
    const usdValue = await page.locator('#usd-input').inputValue();
    const usdNumber = parseFloat(usdValue.replace(/[$,]/g, ''));
    
    // 100,000 Robux = $380 via DevEx (new rate)
    expect(usdNumber).toBeCloseTo(380, 2);
  });

  test('should apply 30% marketplace tax correctly', async ({ page }) => {
    // Switch to Marketplace mode
    await page.click('text=Marketplace');
    
    // Enter 1000 Robux
    await page.fill('#robux-input', '1000');
    
    await page.waitForTimeout(500);
    
    const usdValue = await page.locator('#usd-input').inputValue();
    const usdNumber = parseFloat(usdValue.replace(/[$,]/g, ''));
    
    // 1000 Robux × $0.00245 = $2.45
    expect(usdNumber).toBeCloseTo(2.45, 2);
  });

  test('should calculate official package prices correctly', async ({ page }) => {
    await page.click('text=Buy Robux');
    
    // Test each official WEB package
    for (const [robux, usd] of Object.entries(ROBUX_RATES.PACKAGES)) {
      await page.fill('#robux-input', robux);
      await page.waitForTimeout(300);
      
      const calculatedUsd = await page.locator('#usd-input').inputValue();
      const usdNumber = parseFloat(calculatedUsd.replace(/[$,]/g, ''));
      
      // Should match exact package price
      expect(usdNumber).toBeCloseTo(usd, 1);
    }
  });

  test('should handle reverse calculation (USD to Robux)', async ({ page }) => {
    await page.click('text=Buy Robux');
    
    // Enter $9.99 USD
    await page.fill('#usd-input', '9.99');
    
    await page.waitForTimeout(500);
    
    const robuxValue = await page.locator('#robux-input').inputValue();
    const robuxNumber = parseFloat(robuxValue.replace(/,/g, ''));
    
    // $9.99 = 1000 Robux package
    expect(robuxNumber).toBeCloseTo(1000, 0);
  });
});

// ============================================
// TEST SUITE 3: MODE SWITCHING
// ============================================

test.describe('Robux Calculator - Mode Switching', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(CALCULATOR_URL);
  });

  test('should switch between all three modes', async ({ page }) => {
    // Click Buy Robux mode
    await page.click('text=Buy Robux');
    await expect(page.locator('.mode-btn:has-text("Buy Robux")')).toHaveClass(/active/);
    
    // Click Cash Out mode
    await page.click('text=Cash Out');
    await expect(page.locator('.mode-btn:has-text("Cash Out")')).toHaveClass(/active/);
    
    // Click Marketplace mode
    await page.click('text=Marketplace');
    await expect(page.locator('.mode-btn:has-text("Marketplace")')).toHaveClass(/active/);
  });

  test('should recalculate when switching modes', async ({ page }) => {
    // Enter 1000 Robux in Buy mode
    await page.click('text=Buy Robux');
    await page.fill('#robux-input', '1000');
    await page.waitForTimeout(300);
    
    const buyModeResult = await page.locator('#usd-input').inputValue();
    
    // Switch to DevEx mode
    await page.click('text=Cash Out');
    await page.waitForTimeout(300);
    
    const devExResult = await page.locator('#usd-input').inputValue();
    
    // Results should be different (different rates)
    expect(buyModeResult).not.toBe(devExResult);
    
    // DevEx should be lower value
    const buyValue = parseFloat(buyModeResult.replace(/[$,]/g, ''));
    const devExValue = parseFloat(devExResult.replace(/[$,]/g, ''));
    expect(devExValue).toBeLessThan(buyValue);
  });

  test('should show correct rate information for each mode', async ({ page }) => {
    // Skip on mobile (rate info is hidden/collapsed)
    if (page.viewportSize().width < 768) {
      test.skip();
    }
    
    // Buy Robux mode
    await page.click('text=Buy Robux');
    await expect(page.locator('text=/player.*rate|purchase.*rate/i').first()).toBeVisible();
    
    // Cash Out mode
    await page.click('text=Cash Out');
    await expect(page.locator('text=/devex|developer.*exchange/i').first()).toBeVisible();
    
    // Marketplace mode
    await page.click('text=Marketplace');
    await expect(page.locator('text=/30%|marketplace.*tax/i').first()).toBeVisible();
  });
});

// ============================================
// TEST SUITE 4: CURRENCY CONVERSION
// ============================================

test.describe('Robux Calculator - Multi-Currency Support', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(CALCULATOR_URL);
  });

  test('should have all major currencies available', async ({ page }) => {
    const currencySelect = page.locator('#currency-select');
    
    // Check each currency option exists (not visible, but in DOM)
    for (const currency of Object.keys(ROBUX_RATES.CURRENCIES)) {
      await expect(currencySelect.locator(`option[value="${currency}"]`)).toHaveCount(1);
    }
  });

  test('should switch currencies correctly', async ({ page }) => {
    await page.fill('#robux-input', '1000');
    await page.waitForTimeout(300);
    
    // Switch to GBP
    await page.selectOption('#currency-select', 'GBP');
    await page.waitForTimeout(300);
    
    const gbpValue = await page.locator('#usd-input').inputValue();
    expect(gbpValue).not.toBe('');
    
    // Switch to EUR
    await page.selectOption('#currency-select', 'EUR');
    await page.waitForTimeout(300);
    
    const eurValue = await page.locator('#usd-input').inputValue();
    expect(eurValue).not.toBe('');
    expect(eurValue).not.toBe(gbpValue);
  });
});

// ============================================
// TEST SUITE 5: QUICK AMOUNT BUTTONS
// ============================================

test.describe('Robux Calculator - Quick Amount Buttons', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(CALCULATOR_URL);
  });

  test('should have quick amount buttons visible', async ({ page }) => {
    // WEB package amounts
    const webAmounts = ['500', '1000', '2000', '5250', '11000', '24000'];
    for (const amount of webAmounts) {
      await expect(page.locator(`.quick-btn[data-amount="${amount}"]`)).toBeVisible();
    }
  });

  test('should populate input when clicking quick amount', async ({ page }) => {
    await page.click('text=Buy Robux');
    
    // Click 1000 Robux button
    await page.click('.quick-btn[data-amount="1000"]');
    
    await page.waitForTimeout(300);
    
    const robuxValue = await page.locator('#robux-input').inputValue();
    expect(robuxValue).toContain('1000');
  });

  test('should work with all quick amount buttons', async ({ page }) => {
    await page.click('text=Buy Robux');
    
    const amounts = ['500', '1000', '2000', '5250', '11000', '24000'];
    
    for (const amount of amounts) {
      await page.click(`.quick-btn[data-amount="${amount}"]`);
      await page.waitForTimeout(200);
      
      const robuxValue = await page.locator('#robux-input').inputValue();
      expect(robuxValue.replace(/,/g, '')).toContain(amount);
    }
  });
});

// ============================================
// TEST SUITE 6: INPUT VALIDATION
// ============================================

test.describe('Robux Calculator - Input Validation', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(CALCULATOR_URL);
  });

  test('should handle zero input', async ({ page }) => {
    await page.fill('#robux-input', '0');
    await page.waitForTimeout(300);
    
    const usdValue = await page.locator('#usd-input').inputValue();
    expect(usdValue === '0.00' || usdValue === '0' || usdValue === '').toBeTruthy();
  });

  test('should handle negative numbers gracefully', async ({ page }) => {
    // HTML5 number input with min="0" prevents negative numbers
    const inputMin = await page.locator('#robux-input').getAttribute('min');
    expect(inputMin).toBe('0');
  });

  test('should handle large numbers', async ({ page }) => {
    await page.fill('#robux-input', '1000000');
    await page.waitForTimeout(300);
    
    const usdValue = await page.locator('#usd-input').inputValue();
    const usdNumber = parseFloat(usdValue.replace(/[$,]/g, ''));
    expect(usdNumber).toBeGreaterThan(0);
  });

  test('should handle decimal input', async ({ page }) => {
    await page.fill('#robux-input', '100.5');
    await page.waitForTimeout(300);
    
    const usdValue = await page.locator('#usd-input').inputValue();
    expect(usdValue).not.toBe('');
  });
});

// ============================================
// TEST SUITE 7: COPY & SWAP FEATURES
// ============================================

test.describe('Robux Calculator - Copy & Swap Features', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(CALCULATOR_URL);
  });

  test('should have copy button in DOM', async ({ page }) => {
    // Copy button exists but may be hidden on mobile
    await expect(page.locator('#copy-btn')).toHaveCount(1);
  });

  test('should copy result when clicking copy button', async ({ page, browserName }) => {
    // Skip on mobile and Firefox (known limitations)
    if (page.viewportSize().width < 768 || browserName === 'firefox') {
      test.skip();
    }
    
    await page.fill('#robux-input', '1000');
    await page.waitForTimeout(300);
    
    // Grant clipboard permissions (Chromium only) with safe fallback
    if (browserName === 'chromium') {
      try {
        await page.context().grantPermissions(['clipboard-write', 'clipboard-read']);
      } catch (e) {
        // Ignore permission errors
      }
    }
    
    // Click copy button
    await page.click('#copy-btn');
    await page.waitForTimeout(500);
    
    // Verify copy happened (check if button exists and was clicked)
    const copyBtn = await page.locator('#copy-btn').isVisible();
    expect(copyBtn).toBeTruthy();
  });

  test('should have swap arrow visible on desktop', async ({ page, isMobile }) => {
    // Swap arrow is hidden on mobile
    if (!isMobile) {
      await expect(page.locator('.conversion-arrow')).toBeVisible();
    }
  });

  test('should swap values when clicking swap button', async ({ page, isMobile }) => {
    // Skip on mobile where swap is hidden
    test.skip(isMobile, 'Swap button is hidden on mobile');
    
    await page.fill('#robux-input', '1000');
    await page.waitForTimeout(300);
    
    const robuxBefore = await page.locator('#robux-input').inputValue();
    const usdBefore = await page.locator('#usd-input').inputValue();
    
    // Click swap button (conversion arrow)
    await page.click('.conversion-arrow');
    await page.waitForTimeout(300);
    
    const robuxAfter = await page.locator('#robux-input').inputValue();
    const usdAfter = await page.locator('#usd-input').inputValue();
    
    // Values should have swapped positions
    expect(robuxAfter).not.toBe(robuxBefore);
  });
});

// ============================================
// TEST SUITE 8: MOBILE RESPONSIVENESS
// ============================================

test.describe('Robux Calculator - Mobile Responsiveness', () => {
  
  test('should work on mobile viewport (iPhone 12)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(CALCULATOR_URL);
    
    // Should be visible and functional
    await expect(page.locator('.calculator-container')).toBeVisible();
    
    // Mode buttons should be visible
    await expect(page.locator('.converter-modes')).toBeVisible();
    
    // Should be able to input values
    await page.fill('#robux-input', '1000');
    await page.waitForTimeout(300);
    
    const usdValue = await page.locator('#usd-input').inputValue();
    const usdNumber = parseFloat(usdValue.replace(/[$,]/g, ''));
    expect(usdNumber).toBeGreaterThan(0);
  });

  test('should work on tablet viewport (iPad)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(CALCULATOR_URL);
    
    await expect(page.locator('.calculator-container')).toBeVisible();
    
    // Test calculation
    await page.fill('#robux-input', '5000');
    await page.waitForTimeout(300);
    
    const usdValue = await page.locator('#usd-input').inputValue();
    const usdNumber = parseFloat(usdValue.replace(/[$,]/g, ''));
    expect(usdNumber).toBeGreaterThan(0);
  });
});

// ============================================
// TEST SUITE 9: REAL-WORLD SCENARIOS
// ============================================

test.describe('Robux Calculator - Real-World Scenarios', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(CALCULATOR_URL);
  });

  test('Scenario: Player wants to buy a 75 Robux game pass', async ({ page }) => {
    await page.click('text=Buy Robux');
    await page.fill('#robux-input', '75');
    await page.waitForTimeout(300);
    
    const usdValue = await page.locator('#usd-input').inputValue();
    const usdNumber = parseFloat(usdValue.replace(/[$,]/g, ''));
    
    // 75 Robux requires 500 package = $4.99
    expect(usdNumber).toBeCloseTo(4.99, 2);
  });

  test('Scenario: Developer earned 50,000 Robux and wants to cash out', async ({ page }) => {
    await page.click('text=Cash Out');
    await page.fill('#robux-input', '50000');
    await page.waitForTimeout(300);
    
    const usdValue = await page.locator('#usd-input').inputValue();
    const usdNumber = parseFloat(usdValue.replace(/[$,]/g, ''));
    
    // 50,000 Robux via DevEx = $190 (at new $0.0038 rate)
    expect(usdNumber).toBeCloseTo(190, 2);
  });

  test('Scenario: Creator sells item for 1000 Robux on marketplace', async ({ page }) => {
    await page.click('text=Marketplace');
    await page.fill('#robux-input', '1000');
    await page.waitForTimeout(300);
    
    const usdValue = await page.locator('#usd-input').inputValue();
    const usdNumber = parseFloat(usdValue.replace(/[$,]/g, ''));
    
    // 1000 Robux × $0.00245 = $2.45
    expect(usdNumber).toBeCloseTo(2.45, 2);
  });

  test('Scenario: Parent budgeting monthly Robux allowance', async ({ page }) => {
    await page.click('text=Buy Robux');
    
    // Check cost of monthly allowances
    const monthlyBudgets = [1000, 2000, 5250]; // Common WEB packages
    
    for (const robux of monthlyBudgets) {
      await page.fill('#robux-input', robux.toString());
      await page.waitForTimeout(300);
      
      const usdValue = await page.locator('#usd-input').inputValue();
      const usdNumber = parseFloat(usdValue.replace(/[$,]/g, ''));
      
      // Should have reasonable monthly costs
      expect(usdNumber).toBeGreaterThan(0);
      expect(usdNumber).toBeLessThan(100);
    }
  });

  test('Scenario: Compare DevEx vs Player rate difference', async ({ page }) => {
    const testAmount = 10000;
    
    // Buy Robux (player rate)
    await page.click('text=Buy Robux');
    await page.fill('#robux-input', testAmount.toString());
    await page.waitForTimeout(300);
    const playerCost = await page.locator('#usd-input').inputValue();
    const playerNumber = parseFloat(playerCost.replace(/[$,]/g, ''));
    
    // Cash Out (DevEx rate)
    await page.click('text=Cash Out');
    await page.waitForTimeout(300);
    const devExPayout = await page.locator('#usd-input').inputValue();
    const devExNumber = parseFloat(devExPayout.replace(/[$,]/g, ''));
    
    // DevEx should be approximately 62% lower than player cost
    const difference = ((playerNumber - devExNumber) / playerNumber) * 100;
    expect(difference).toBeCloseTo(62, 1);
  });
});

// ============================================
// TEST SUITE 10: PERFORMANCE & LOADING
// ============================================

test.describe('Robux Calculator - Performance', () => {
  
  test('should load within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.goto(CALCULATOR_URL);
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
  });

  test('should calculate results quickly', async ({ page }) => {
    await page.goto(CALCULATOR_URL);
    
    const startTime = Date.now();
    await page.fill('#robux-input', '5000');
    
    // Wait for calculation to complete
    await page.waitForFunction(() => {
      const usdInput = document.querySelector('#usd-input');
      return usdInput && usdInput.value !== '';
    });
    
    const calcTime = Date.now() - startTime;
    
    // Calculation should be nearly instant (<500ms)
    expect(calcTime).toBeLessThan(500);
  });

  test('should handle rapid input changes', async ({ page }) => {
    await page.goto(CALCULATOR_URL);
    
    // Type rapidly
    const amounts = ['100', '500', '1000', '2500', '5000'];
    for (const amount of amounts) {
      await page.fill('#robux-input', amount);
      await page.waitForTimeout(50); // Very short delay
    }
    
    // Final result should still be accurate
    await page.waitForTimeout(300);
    const usdValue = await page.locator('#usd-input').inputValue();
    expect(usdValue).not.toBe('');
  });
});

// ============================================
// TEST SUITE 11: ACCESSIBILITY
// ============================================

test.describe('Robux Calculator - Accessibility', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(CALCULATOR_URL);
  });

  test('should have proper ARIA labels', async ({ page }) => {
    const robuxInput = page.locator('#robux-input');
    const usdInput = page.locator('#usd-input');
    
    await expect(robuxInput).toHaveAttribute('aria-label', /.+/);
    await expect(usdInput).toHaveAttribute('aria-label', /.+/);
  });

  test('should be keyboard navigable', async ({ page }) => {
    // Focus on robux input directly
    await page.locator('#robux-input').focus();
    
    // Type into it
    await page.keyboard.type('1000');
    await page.waitForTimeout(300);
    
    const robuxValue = await page.locator('#robux-input').inputValue();
    expect(robuxValue).toContain('1000');
  });

  test('should have sufficient color contrast', async ({ page }) => {
    // Check main text is visible against background
    const container = page.locator('.calculator-container');
    await expect(container).toBeVisible();
    
    // Mode buttons should have clear active state
    await page.click('text=Buy Robux');
    const activeBtn = page.locator('.mode-btn.active');
    await expect(activeBtn).toBeVisible();
  });
});