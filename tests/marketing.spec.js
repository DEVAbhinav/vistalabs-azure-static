const { test, expect } = require('@playwright/test');
const path = require('path');

const artifactPath = (testInfo, name) => {
  const safeProject = testInfo.project.name.replace(/\s+/g, '-').toLowerCase();
  return path.join(__dirname, 'artifacts', `${safeProject}-${name}`);
};

test.describe('VIstalabs marketing site', () => {
  const ensureNavOpen = async page => {
    const toggle = page.locator('[data-nav-toggle]');
    if (await toggle.isVisible()) {
      const expanded = await toggle.getAttribute('aria-expanded');
      if (expanded !== 'true') {
        await toggle.click();
      }
    }
  };

  test('renders hero and captures visual baseline', async ({ page }, testInfo) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const heroHeading = page.getByRole('heading', {
      name: 'World-class engineers delivering maintainable technology for lasting impact.'
    });

    await expect(heroHeading).toBeVisible();
    await expect(page.getByRole('button', { name: 'View recent launches' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Book a discovery call' })).toBeVisible();

    await page.waitForTimeout(500);
    await page.screenshot({
      path: artifactPath(testInfo, 'home.png'),
      fullPage: true
    });
  });

  test('navigation anchors reveal key sections', async ({ page }) => {
    await page.goto('/');
    await ensureNavOpen(page);
    await page.getByRole('link', { name: 'Azure Advantage' }).click();
    await expect(page.locator('#azure h2')).toHaveText('The Azure advantage, delivered responsibly');

    await ensureNavOpen(page);
    await page.getByRole('link', { name: 'Process' }).click();
    await expect(page.locator('#process .timeline')).toBeVisible();

    await ensureNavOpen(page);
    await page.getByRole('link', { name: 'Portfolio' }).click();
    await expect(page.getByRole('heading', { name: 'Kashitaxi.in' })).toBeVisible();
    await expect(page.locator('img[alt="Landing page hero of Kashitaxi mobility platform"]')).toBeVisible();
  });

  test('cta section lists multiple contact channels', async ({ page }, testInfo) => {
    await page.goto('/#contact');
    const contactSection = page.locator('#contact');
    await expect(page.getByRole('heading', { name: "Let's design your next launch together" })).toBeVisible();
    const contactLinks = contactSection.locator('.contact-grid a');
    await expect(contactLinks).toHaveCount(2);

    await contactSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const clip = await contactSection.boundingBox();

    if (clip) {
      await page.screenshot({
        path: artifactPath(testInfo, 'contact.png'),
        fullPage: false,
        clip
      });
    } else {
      await page.screenshot({
        path: artifactPath(testInfo, 'contact.png'),
        fullPage: true
      });
    }
  });
});