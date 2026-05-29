const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

test('PDF to EPUB conversion end-to-end', async ({ page }) => {
    // 1. Go to the live production URL
    console.log('Navigating to live production site...');
    await page.goto('https://vistalabs.in/pdf-to-epub/');
    await page.waitForLoadState('networkidle');

    // 2. Expect title and heading to be correct
    await expect(page.locator('h1.hero-title')).toHaveText('Convert PDF to EPUB');
    console.log('Page loaded successfully.');

    // 3. Upload a sample PDF file
    const samplePdfPath = '/Users/britz/Desktop/Code/TravelAgentERP/docs/VEHICLE-GUIDE.pdf';
    console.log(`Uploading sample PDF: ${samplePdfPath}`);
    
    // Playwright locator for hidden file inputs
    await page.setInputFiles('input[type="file"]', samplePdfPath);

    // 4. Verify file info is displayed and config form is visible
    await expect(page.locator('#file-info-card')).toBeVisible();
    await expect(page.locator('#config-form')).toBeVisible();
    console.log('File details and configuration form are visible.');

    // 5. Fill out custom metadata
    await page.fill('#book-title', 'Vehicle Guide Test Book');
    await page.fill('#book-author', 'Vista Labs Auto-Test');

    // 6. Click convert button and trigger conversion
    console.log('Clicking convert button...');
    await page.click('#convert-btn');

    // 7. Verify step progress is active
    await expect(page.locator('#step-progress')).toBeVisible();
    console.log('Conversion progress screen active.');

    // 8. Wait for success screen (Step 3) to be active (download-link becomes visible)
    const downloadBtn = page.locator('#download-link');
    console.log('Waiting for conversion to complete (download link visibility)...');
    await expect(downloadBtn).toBeVisible({ timeout: 60000 }); // Wait up to 60s for conversion
    console.log('Conversion completed successfully!');

    // 9. Capture download event and download file
    const downloadPromise = page.waitForEvent('download');
    await downloadBtn.click();
    const download = await downloadPromise;

    // Save download to temporary location
    const downloadPath = path.join(__dirname, 'test-output.epub');
    await download.saveAs(downloadPath);

    // 10. Verify downloaded file exists
    const fileExists = fs.existsSync(downloadPath);
    expect(fileExists).toBe(true);
    
    const stats = fs.statSync(downloadPath);
    console.log(`Success! EPUB file downloaded: size = ${stats.size} bytes`);

    // Clean up
    fs.unlinkSync(downloadPath);
});
