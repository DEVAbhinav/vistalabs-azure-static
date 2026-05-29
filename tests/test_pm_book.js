const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    page.on('console', msg => console.log('BROWSER:', msg.text()));
    console.log('Navigating to live production site...');
    await page.goto('http://localhost:8080/pdf-to-epub/');

    const samplePdfPath = '/Users/britz/Downloads/Cracking the PM Interview.pdf';
    console.log(`Uploading sample PDF: ${samplePdfPath}`);
    await page.setInputFiles('input[type="file"]', samplePdfPath);

    console.log('Waiting for PDF to process internally...');
    await page.waitForTimeout(10000);

    await page.click('#convert-btn');
    console.log('Conversion started...');

    const downloadBtn = page.locator('#download-link');
    await downloadBtn.waitFor({ state: 'visible', timeout: 300000 }); // 5 minutes max
    console.log('Download link is visible!');

    const downloadPromise = page.waitForEvent('download');
    await downloadBtn.click();
    const download = await downloadPromise;

    const downloadPath = path.join(__dirname, 'pm-book-result.epub');
    await download.saveAs(downloadPath);
    console.log(`Saved EPUB to ${downloadPath}`);

    await browser.close();
})();
