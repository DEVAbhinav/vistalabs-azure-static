// Configure PDF.js Worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Application State
let appFile = null;
let pdfDoc = null;
let pdfArrayBuffer = null;
let conversionLogs = [];

// DOM Elements
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const fileInfoCard = document.getElementById('file-info-card');
const fileNameText = document.getElementById('file-name');
const fileSizeText = document.getElementById('file-size');
const removeFileBtn = document.getElementById('remove-file-btn');
const configForm = document.getElementById('config-form');
const bookTitleInput = document.getElementById('book-title');
const bookAuthorInput = document.getElementById('book-author');
const toggleAdvancedBtn = document.getElementById('toggle-advanced-btn');
const advancedSettings = document.getElementById('advanced-settings');
const baseFontSizeSelect = document.getElementById('base-font-size');
const pageBreakModeSelect = document.getElementById('page-break-mode');
const coverStyleSelect = document.getElementById('cover-style');
const imageDpiSelect = document.getElementById('image-dpi');
const groupFontSize = document.getElementById('group-font-size');
const groupImageDpi = document.getElementById('group-image-dpi');

const stepUpload = document.getElementById('step-upload');
const stepProgress = document.getElementById('step-progress');
const stepSuccess = document.getElementById('step-success');

const progressCircle = document.getElementById('progress-circle');
const progressPercentText = document.getElementById('progress-percent-text');
const progressStatusTitle = document.getElementById('progress-status-title');
const progressStatusDesc = document.getElementById('progress-status-desc');
const toggleLogsBtn = document.getElementById('toggle-logs-btn');
const logsConsole = document.getElementById('logs-console');

const successBookTitle = document.getElementById('success-book-title');
const successBookAuthor = document.getElementById('success-book-author');
const successFileSize = document.getElementById('success-file-size');
const downloadLink = document.getElementById('download-link');
const convertAnotherBtn = document.getElementById('convert-another-btn');
const epubCoverCanvas = document.getElementById('epub-cover-canvas');

// ─────────────────────────────────────────────────────────────────────────────
// Event Listeners: File Upload & Drag-and-Drop
// ─────────────────────────────────────────────────────────────────────────────

dropZone.addEventListener('click', () => { fileInput.click(); });

['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
        e.preventDefault(); e.stopPropagation();
        dropZone.classList.add('dragover');
    }, false);
});
['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
        e.preventDefault(); e.stopPropagation();
        dropZone.classList.remove('dragover');
    }, false);
});
dropZone.addEventListener('drop', (e) => {
    if (e.dataTransfer.files.length > 0) handleFileSelect(e.dataTransfer.files[0]);
});
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) handleFileSelect(e.target.files[0]);
});
removeFileBtn.addEventListener('click', (e) => { e.stopPropagation(); resetUploadStep(); });

document.querySelectorAll('input[name="conv-mode"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        document.querySelectorAll('.radio-card').forEach(card => card.classList.remove('active'));
        e.target.closest('.radio-card').classList.add('active');
        if (e.target.value === 'image') {
            groupFontSize.classList.add('hidden');
            groupImageDpi.classList.remove('hidden');
        } else {
            groupFontSize.classList.remove('hidden');
            groupImageDpi.classList.add('hidden');
        }
    });
});

toggleAdvancedBtn.addEventListener('click', () => {
    const isHidden = advancedSettings.classList.contains('hidden');
    advancedSettings.classList.toggle('hidden');
    toggleAdvancedBtn.classList.toggle('active');
});

toggleLogsBtn.addEventListener('click', () => {
    const isHidden = logsConsole.classList.contains('hidden');
    logsConsole.classList.toggle('hidden');
    toggleLogsBtn.innerHTML = isHidden
        ? 'Hide <i class="fa-solid fa-chevron-up"></i>'
        : 'Show <i class="fa-solid fa-chevron-down"></i>';
});

convertAnotherBtn.addEventListener('click', () => { resetUploadStep(); showStep('upload'); });
configForm.addEventListener('submit', (e) => { e.preventDefault(); startConversion(); });

// ─────────────────────────────────────────────────────────────────────────────
// Core Logic: File Handling & Reading
// ─────────────────────────────────────────────────────────────────────────────

async function handleFileSelect(file) {
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
        alert('Invalid file format. Please upload a PDF document.'); return;
    }
    appFile = file;
    fileNameText.textContent = file.name;
    fileSizeText.textContent = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    fileInfoCard.classList.remove('hidden');
    dropZone.style.display = 'none';
    bookTitleInput.value = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
    configForm.classList.remove('hidden');

    try {
        pdfArrayBuffer = await readFileAsArrayBuffer(file);
        pdfDoc = await pdfjsLib.getDocument({ data: new Uint8Array(pdfArrayBuffer) }).promise;
        try {
            const meta = await pdfDoc.getMetadata();
            if (meta && meta.info) {
                if (meta.info.Title && meta.info.Title.trim()) bookTitleInput.value = meta.info.Title.trim();
                if (meta.info.Author && meta.info.Author.trim()) bookAuthorInput.value = meta.info.Author.trim();
            }
        } catch (e) { /* metadata extraction is optional */ }
        console.log(`PDF loaded: ${pdfDoc.numPages} pages`);
    } catch (e) {
        console.error("Error reading PDF:", e);
        alert("Failed to read this PDF file. It might be corrupted or password-protected.");
        resetUploadStep();
    }
}

function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsArrayBuffer(file);
    });
}

function resetUploadStep() {
    appFile = null; pdfDoc = null; pdfArrayBuffer = null;
    fileInput.value = '';
    fileInfoCard.classList.add('hidden');
    dropZone.style.display = '';
    configForm.classList.add('hidden');
    bookTitleInput.value = '';
    bookAuthorInput.value = '';
    advancedSettings.classList.add('hidden');
    toggleAdvancedBtn.classList.remove('active');
}

function showStep(stepName) {
    [stepUpload, stepProgress, stepSuccess].forEach(s => s.classList.remove('active'));
    if (stepName === 'upload') stepUpload.classList.add('active');
    else if (stepName === 'progress') stepProgress.classList.add('active');
    else if (stepName === 'success') stepSuccess.classList.add('active');
}

// ─────────────────────────────────────────────────────────────────────────────
// Logging & Progress Helpers
// ─────────────────────────────────────────────────────────────────────────────

function clearLogs() { conversionLogs = []; logsConsole.innerHTML = ''; }

function logMessage(text, type = 'info') {
    const time = new Date().toLocaleTimeString();
    const logLine = document.createElement('div');
    logLine.className = `log-line log-${type}`;
    logLine.textContent = `[${time}] ${text}`;
    logsConsole.appendChild(logLine);
    logsConsole.scrollTop = logsConsole.scrollHeight;
    conversionLogs.push({ text, type, time });
    console.log(`[EPUB-CONV] ${text}`);
}

function updateProgress(percent, title, desc) {
    percent = Math.min(100, Math.max(0, percent));
    progressPercentText.textContent = Math.round(percent);
    progressCircle.style.strokeDashoffset = 326.7 - (percent / 100) * 326.7;
    if (title) progressStatusTitle.textContent = title;
    if (desc) progressStatusDesc.textContent = desc;
}

// ─────────────────────────────────────────────────────────────────────────────
// Conversion Pipeline
// ─────────────────────────────────────────────────────────────────────────────

async function startConversion() {
    if (!appFile || !pdfDoc || !pdfArrayBuffer) { alert('Please select a PDF file first.'); return; }
    showStep('progress');
    clearLogs();
    logsConsole.classList.remove('hidden');
    toggleLogsBtn.innerHTML = 'Hide <i class="fa-solid fa-chevron-up"></i>';

    logMessage(`Starting conversion for: ${appFile.name}`);
    updateProgress(0, 'Initializing...', 'Preparing conversion pipeline.');

    const title = bookTitleInput.value.trim() || 'Untitled Book';
    const author = bookAuthorInput.value.trim() || 'Unknown Author';
    const mode = document.querySelector('input[name="conv-mode"]:checked').value;
    const splitMode = pageBreakModeSelect.value;
    const coverStyle = coverStyleSelect.value;
    const baseFontSize = baseFontSizeSelect.value;
    const dpi = parseInt(imageDpiSelect.value, 10);
    const totalPages = pdfDoc.numPages;

    logMessage(`Settings: Mode=${mode}, Split=${splitMode}, Cover=${coverStyle}, Pages=${totalPages}`);

    try {
        let epubBlob = null;
        if (mode === 'text') {
            epubBlob = await convertTextMode(title, author, splitMode, coverStyle, baseFontSize, totalPages);
        } else {
            epubBlob = await convertImageMode(title, author, dpi, coverStyle, totalPages);
        }
        if (epubBlob) {
            finalizeSuccess(title, author, epubBlob, coverStyle);
        } else {
            throw new Error('Conversion produced no output.');
        }
    } catch (err) {
        logMessage(`FATAL ERROR: ${err.message}`, 'error');
        updateProgress(100, 'Conversion Failed', err.message);
    }
}

// =============================================================================
//  INTELLIGENT TEXT EXTRACTION ENGINE
// =============================================================================

/**
 * Phase 0: Pre-analyze the document by scanning a sample of pages.
 * Determines:
 *  - bodyFontSize: the most common font size (= body text)
 *  - headerPatterns: recurring text at the top of pages (running headers)
 *  - footerPatterns: recurring text at the bottom (page numbers, running footers)
 *  - avgPageHeight / avgPageWidth
 */
async function analyzeDocument(pdfDoc) {
    const result = {
        bodyFontSize: 10,
        headerPatterns: new Set(),
        footerPatterns: new Set(),
        avgPageHeight: 792,
        avgPageWidth: 612,
    };

    const fontSizeCharCount = {};   // fontSize → total character count
    const topTexts = {};            // text → number of pages it appears on
    const bottomTexts = {};         // text → number of pages it appears on
    const pagesToScan = Math.min(pdfDoc.numPages, 20);
    let totalHeight = 0, totalWidth = 0;

    for (let i = 1; i <= pagesToScan; i++) {
        const page = await pdfDoc.getPage(i);
        const vp = page.getViewport({ scale: 1 });
        const tc = await page.getTextContent();
        totalHeight += vp.height;
        totalWidth += vp.width;

        const topZone = vp.height * 0.92;   // PDF Y: bottom=0, top=pageHeight
        const bottomZone = vp.height * 0.08;
        const pageTopTexts = new Set();
        const pageBottomTexts = new Set();

        for (const item of tc.items) {
            const text = (item.str || '').trim();
            if (!text) continue;
            const fs = Math.round(Math.abs(item.transform[0]) * 2) / 2; // round to 0.5
            fontSizeCharCount[fs] = (fontSizeCharCount[fs] || 0) + text.length;

            const y = item.transform[5];
            if (y > topZone) pageTopTexts.add(text);
            if (y < bottomZone) pageBottomTexts.add(text);
        }

        // Count how many pages each header/footer text appears on
        for (const t of pageTopTexts) topTexts[t] = (topTexts[t] || 0) + 1;
        for (const t of pageBottomTexts) bottomTexts[t] = (bottomTexts[t] || 0) + 1;
    }

    result.avgPageHeight = totalHeight / pagesToScan;
    result.avgPageWidth = totalWidth / pagesToScan;

    // Body font = font size with the most total characters
    let maxChars = 0;
    for (const [fs, chars] of Object.entries(fontSizeCharCount)) {
        if (chars > maxChars) { maxChars = chars; result.bodyFontSize = parseFloat(fs); }
    }

    // Recurring header text (appears on ≥30% of sampled pages)
    const threshold = Math.max(2, pagesToScan * 0.3);
    for (const [text, count] of Object.entries(topTexts)) {
        if (count >= threshold) result.headerPatterns.add(text);
    }
    for (const [text, count] of Object.entries(bottomTexts)) {
        if (count >= threshold || /^\d{1,5}$/.test(text)) result.footerPatterns.add(text);
    }

    return result;
}

/**
 * Filter out header/footer items from a page's text items.
 * Removes:
 *  - Items in the top/bottom margin zones that match recurring patterns
 *  - Standalone page numbers at the bottom
 *  - Small-font text in extreme top/bottom margins
 */
function filterHeadersFooters(items, analysis, pageHeight) {
    const topZone = pageHeight * 0.91;
    const bottomZone = pageHeight * 0.09;

    return items.filter(item => {
        const text = (item.str || '').trim();
        if (!text) return false;
        const y = item.transform[5];
        const fs = Math.abs(item.transform[0]);

        // --- Top-of-page items ---
        if (y > topZone) {
            // Exact match with known recurring headers
            if (analysis.headerPatterns.has(text)) return false;
            // Substring match: the running header might be split across items
            for (const hp of analysis.headerPatterns) {
                if (hp.includes(text) && text.length > 3) return false;
            }
            // Small text in the header margin is likely a running head
            if (fs < analysis.bodyFontSize * 0.95 && text.length < 100) return false;
        }

        // --- Bottom-of-page items ---
        if (y < bottomZone) {
            if (analysis.footerPatterns.has(text)) return false;
            // Page numbers: purely numeric, or roman numerals, or "Page N"
            if (/^\d{1,5}$/.test(text)) return false;
            if (/^[ivxlcdm]+$/i.test(text) && text.length < 8) return false;
            if (/^page\s+\d+$/i.test(text)) return false;
            if (/^[-–—]\s*\d+\s*[-–—]$/.test(text)) return false; // "- 42 -"
            // Small decorative footer text
            if (fs < analysis.bodyFontSize * 0.95 && text.length < 80) return false;
        }

        return true;
    });
}

/**
 * Detect multi-column layouts using X-axis gap analysis.
 * Returns an array of item arrays — one per column, left-to-right.
 */
function detectColumns(items, pageWidth) {
    if (items.length < 6) return [items];

    // Build a histogram of X-center positions across 40 buckets
    const numBuckets = 40;
    const bucketWidth = pageWidth / numBuckets;
    const buckets = new Array(numBuckets).fill(0);

    for (const item of items) {
        const xCenter = item.transform[4] + (item.width || 0) / 2;
        const b = Math.min(numBuckets - 1, Math.max(0, Math.floor(xCenter / bucketWidth)));
        buckets[b]++;
    }

    // Find the widest empty gap in the middle 60% of the page (buckets 8–32)
    let bestGapCenter = -1, bestGapWidth = 0;
    for (let i = 8; i <= 32; ) {
        if (buckets[i] === 0) {
            let gapStart = i;
            while (i <= 32 && buckets[i] === 0) i++;
            let gapW = i - gapStart;
            if (gapW > bestGapWidth) {
                bestGapWidth = gapW;
                bestGapCenter = (gapStart + i) / 2;
            }
        } else { i++; }
    }

    // Need ≥2 empty buckets (≥5% of page width) to call it multi-column
    if (bestGapWidth >= 2 && bestGapCenter > 0) {
        const splitX = bestGapCenter * bucketWidth;
        const left = items.filter(it => (it.transform[4] + (it.width || 0) / 2) < splitX);
        const right = items.filter(it => (it.transform[4] + (it.width || 0) / 2) >= splitX);
        if (left.length >= 3 && right.length >= 3) {
            return [left, right];
        }
    }
    return [items];
}

/**
 * Reconstruct readable text blocks from a single column of text items.
 * Groups items into lines, then lines into paragraphs.
 * Returns: [ { type: 'h1'|'h2'|'p', text: string } ]
 */
function extractBlocksFromColumn(items, bodyFontSize) {
    if (!items.length) return [];

    // Sort: top-to-bottom (descending Y), then left-to-right
    const sorted = [...items].sort((a, b) => {
        const dy = b.transform[5] - a.transform[5];
        if (Math.abs(dy) < 3) return a.transform[4] - b.transform[4];
        return dy;
    });

    // --- Group into lines (items sharing the same Y baseline ±3 units) ---
    const lines = [];
    let curLine = [sorted[0]];
    for (let i = 1; i < sorted.length; i++) {
        const item = sorted[i];
        const prevY = curLine[curLine.length - 1].transform[5];
        if (Math.abs(prevY - item.transform[5]) < 3) {
            curLine.push(item);
        } else {
            lines.push(curLine);
            curLine = [item];
        }
    }
    lines.push(curLine);

    // --- Build structured line objects ---
    const structuredLines = [];
    for (const lineItems of lines) {
        // Sort items within line by X (left to right)
        lineItems.sort((a, b) => a.transform[4] - b.transform[4]);

        // Join items into a single line string with smart spacing
        let lineText = '';
        for (let i = 0; i < lineItems.length; i++) {
            const item = lineItems[i];
            if (i > 0) {
                const prevItem = lineItems[i - 1];
                const prevEnd = prevItem.transform[4] + (prevItem.width || 0);
                const curStart = item.transform[4];
                const gap = curStart - prevEnd;
                const spaceThreshold = Math.abs(item.transform[0]) * 0.25;
                if (gap > spaceThreshold && !prevItem.str.endsWith(' ') && !item.str.startsWith(' ')) {
                    lineText += ' ';
                }
            }
            lineText += item.str;
        }

        lineText = lineText.trim();
        if (!lineText) continue;

        const fontSize = Math.abs(lineItems[0].transform[0]);
        const y = lineItems[0].transform[5];
        structuredLines.push({ text: lineText, fontSize, y });
    }

    if (!structuredLines.length) return [];

    // --- Group lines into blocks (paragraphs/headings) ---
    const blocks = [];
    let blockLines = [structuredLines[0]];
    let blockFontSize = structuredLines[0].fontSize;

    for (let i = 1; i < structuredLines.length; i++) {
        const line = structuredLines[i];
        const prevLine = structuredLines[i - 1];
        const yGap = Math.abs(prevLine.y - line.y);
        const fontChanged = Math.abs(blockFontSize - line.fontSize) > 0.8;
        const largeGap = yGap > blockFontSize * 1.8;

        if (fontChanged || largeGap) {
            blocks.push(finalizeBlock(blockLines, blockFontSize, bodyFontSize));
            blockLines = [line];
            blockFontSize = line.fontSize;
        } else {
            blockLines.push(line);
        }
    }
    blocks.push(finalizeBlock(blockLines, blockFontSize, bodyFontSize));

    return blocks;
}

/**
 * Finalize a block of lines into a typed text block.
 * Handles hyphenation across lines and classifies as heading or paragraph.
 */
function finalizeBlock(lines, blockFontSize, bodyFontSize) {
    // Join lines, handling end-of-line hyphens
    let text = '';
    for (let i = 0; i < lines.length; i++) {
        const lineText = lines[i].text;
        if (i === 0) {
            text = lineText;
        } else if (text.endsWith('-')) {
            // Remove hyphen and join (e.g. "produc-" + "tivity" → "productivity")
            // But keep double hyphens and dashes
            if (!text.endsWith('--') && !text.endsWith('—') && !text.endsWith('–')) {
                text = text.slice(0, -1) + lineText;
            } else {
                text += ' ' + lineText;
            }
        } else {
            text += ' ' + lineText;
        }
    }

    text = text.trim();

    // Classify block type using RELATIVE font size
    let type = 'p';
    const ratio = blockFontSize / bodyFontSize;

    if (text.length < 120 && ratio >= 1.45) {
        type = 'h1';
    } else if (text.length < 150 && ratio >= 1.15) {
        type = 'h2';
    }

    // Content-based heading detection (strong chapter markers)
    if (text.length < 60 && /^(chapter|part|section|prologue|epilogue|act|scene|appendix|introduction|conclusion|preface|foreword|acknowledgements?|about the author|bibliography|references|glossary|index)\b/i.test(text)) {
        type = 'h1';
    }
    // Numbered chapter patterns: "Chapter 1", "CHAPTER I", "1. Introduction"
    if (text.length < 80 && /^(chapter\s+[IVXLC\d]+|CHAPTER\s+[IVXLC\d]+|\d{1,3}\.\s+\S)/i.test(text)) {
        type = 'h1';
    }

    return { type, text, fontSize: blockFontSize };
}

/**
 * Merge text blocks across page boundaries.
 * Joins paragraphs split across pages when:
 *   - The last block of a page ends without sentence-ending punctuation
 *   - The first block of the next page is also a paragraph (not a heading)
 */
function mergeCrossPageBlocks(allPageBlocks) {
    const merged = [];

    for (let p = 0; p < allPageBlocks.length; p++) {
        const pageBlocks = allPageBlocks[p];
        for (let i = 0; i < pageBlocks.length; i++) {
            const block = { ...pageBlocks[i] };

            if (merged.length > 0 && block.type === 'p') {
                const lastMerged = merged[merged.length - 1];
                // Join if previous block is a paragraph that ends mid-sentence
                if (lastMerged.type === 'p' && !lastMerged.text.match(/[.!?:;""')\]]\s*$/)) {
                    // Also check: current block starts with lowercase or continues a sentence
                    const startsLower = /^[a-z]/.test(block.text);
                    const lastEndsWithComma = /,\s*$/.test(lastMerged.text);
                    if (startsLower || lastEndsWithComma || !lastMerged.text.match(/[.!?]\s*$/)) {
                        lastMerged.text += ' ' + block.text;
                        continue;
                    }
                }
            }

            merged.push(block);
        }
    }

    return merged;
}

/**
 * Build chapters from merged text blocks.
 */
function buildChapters(blocks, splitMode) {
    const chapters = [];
    let chapterCount = 1;
    let currentChapter = {
        id: 'chapter_1',
        title: 'Chapter 1',
        content: ''
    };
    let currentChapterTextLength = 0;

    for (const block of blocks) {
        const escaped = escapeHtml(block.text);
        let shouldSplit = false;

        if (splitMode === 'auto') {
            // Auto: Split on strong chapter titles, or on any h1 IF the chapter is already fairly long
            const isStrongChapter = /^(chapter|part|section|prologue|epilogue|act|scene|appendix)\b/i.test(block.text);
            if (block.type === 'h1' && escaped.length < 100) {
                if (isStrongChapter || currentChapterTextLength > 1500) {
                    shouldSplit = true;
                } else {
                    // Downgrade h1 to h2 if we decided not to split, to maintain flow
                    block.type = 'h2';
                }
            }
        } else if (splitMode === 'header') {
            // Split on all h1s
            if (block.type === 'h1' && escaped.length < 100) {
                shouldSplit = true;
            }
        }

        if (shouldSplit) {
            if (currentChapter.content.trim().length > 0) {
                chapters.push({ ...currentChapter });
                chapterCount++;
            }
            currentChapter = {
                id: `chapter_${chapterCount}`,
                title: escaped,
                content: `<h1>${escaped}</h1>\n`
            };
            currentChapterTextLength = escaped.length;
            continue;
        }

        // Render block as HTML
        if (block.type === 'h1') {
            currentChapter.content += `<h1>${escaped}</h1>\n`;
        } else if (block.type === 'h2') {
            currentChapter.content += `<h2>${escaped}</h2>\n`;
        } else {
            currentChapter.content += `<p>${escaped}</p>\n`;
        }
        currentChapterTextLength += escaped.length;

        // Auto-split very large chapters to keep EPUB performant
        if (splitMode === 'auto' && currentChapter.content.length > 30000) {
            chapters.push({ ...currentChapter });
            chapterCount++;
            currentChapter = {
                id: `chapter_${chapterCount}`,
                title: `Section ${chapterCount}`,
                content: ''
            };
            currentChapterTextLength = 0;
        }
    }

    // Save final chapter
    if (currentChapter.content.trim().length > 0 || chapters.length === 0) {
        if (!currentChapter.content.trim()) currentChapter.content = '<p>Empty Chapter.</p>';
        chapters.push(currentChapter);
    }

    return chapters;
}


// ─────────────────────────────────────────────────────────────────────────────
// Mode A: Reflowable Text Mode Converter (Intelligent Pipeline)
// ─────────────────────────────────────────────────────────────────────────────

async function convertTextMode(title, author, splitMode, coverStyle, baseFontSize, totalPages) {
    const zip = new JSZip();

    // ═══ PHASE 1: Document Analysis ═══
    logMessage('Phase 1: Analyzing document structure...', 'info');
    updateProgress(2, 'Analyzing document...', 'Scanning pages for layout patterns, fonts, and headers.');
    const analysis = await analyzeDocument(pdfDoc);
    logMessage(`Body font: ${analysis.bodyFontSize}pt | ${analysis.headerPatterns.size} header patterns | ${analysis.footerPatterns.size} footer patterns detected`, 'success');
    if (analysis.headerPatterns.size > 0) {
        logMessage(`Headers to strip: "${[...analysis.headerPatterns].join('", "')}"`, 'info');
    }

    // ═══ PHASE 2: Per-page text extraction with intelligence ═══
    logMessage('Phase 2: Extracting text with column & header/footer awareness...', 'info');
    const allPageBlocks = [];
    let multiColPages = 0;
    let skippedPages = 0;

    for (let i = 1; i <= totalPages; i++) {
        updateProgress(5 + (i / totalPages) * 60, `Parsing page ${i}/${totalPages}`, 'Intelligent text extraction with column detection.');

        const page = await pdfDoc.getPage(i);
        const vp = page.getViewport({ scale: 1 });
        const tc = await page.getTextContent();

        if (!tc.items || tc.items.length === 0) {
            skippedPages++;
            continue;
        }

        // Step A: Strip headers and footers
        const filtered = filterHeadersFooters(tc.items, analysis, vp.height);
        if (filtered.length === 0) { skippedPages++; continue; }

        // Step B: Detect columns
        const columns = detectColumns(filtered, vp.width);
        if (columns.length > 1) multiColPages++;

        // Step C: Extract text blocks from each column (left → right)
        const pageBlocks = [];
        for (const colItems of columns) {
            const blocks = extractBlocksFromColumn(colItems, analysis.bodyFontSize);
            pageBlocks.push(...blocks);
        }

        // Step D: Skip near-empty pages (< 30 chars of meaningful text)
        const pageTextLen = pageBlocks.reduce((s, b) => s + b.text.length, 0);
        if (pageTextLen < 30) { skippedPages++; continue; }

        if (splitMode === 'page') {
            // In per-page mode, each PDF page = one chapter, no cross-page merging
            const html = pageBlocks.map(b => {
                const escaped = escapeHtml(b.text);
                if (b.type === 'h1') return `<h1>${escaped}</h1>`;
                if (b.type === 'h2') return `<h2>${escaped}</h2>`;
                return `<p>${escaped}</p>`;
            }).join('\n');

            allPageBlocks.push([{ type: 'p', text: '', _rawHtml: html, _pageTitle: `Page ${i}` }]);
        } else {
            allPageBlocks.push(pageBlocks);
        }
    }

    logMessage(`Extraction done: ${multiColPages} multi-column pages, ${skippedPages} empty/header-only pages skipped.`, 'success');

    // ═══ PHASE 3: Cross-page paragraph merging ═══
    logMessage('Phase 3: Merging split paragraphs across page boundaries...', 'info');
    updateProgress(68, 'Restructuring...', 'Joining paragraphs split across pages.');

    let chapters;
    if (splitMode === 'page') {
        // Per-page mode: one chapter per page, no merging
        chapters = [];
        let chapterCount = 1;
        for (const pageBlocks of allPageBlocks) {
            if (pageBlocks[0] && pageBlocks[0]._rawHtml !== undefined) {
                chapters.push({
                    id: `chapter_${chapterCount}`,
                    title: pageBlocks[0]._pageTitle || `Page ${chapterCount}`,
                    content: pageBlocks[0]._rawHtml
                });
            }
            chapterCount++;
        }
    } else {
        const merged = mergeCrossPageBlocks(allPageBlocks);
        const totalTextLen = merged.reduce((s, b) => s + b.text.length, 0);

        // If very little text, auto-switch to image mode
        if (totalTextLen < 200) {
            logMessage('Very little text extracted — switching to Fixed Image mode.', 'error');
            const dpi = parseInt(imageDpiSelect.value, 10);
            return await convertImageMode(title, author, dpi, coverStyle, totalPages);
        }

        logMessage(`Total extracted: ${merged.length} blocks, ~${Math.round(totalTextLen / 1000)}KB of text.`, 'info');

        // ═══ PHASE 4: Chapter building ═══
        logMessage('Phase 4: Building chapter structure...', 'info');
        updateProgress(72, 'Building chapters...', 'Organizing content into readable sections.');
        chapters = buildChapters(merged, splitMode);
    }

    logMessage(`Created ${chapters.length} chapter(s).`, 'success');

    // ═══ PHASE 5: EPUB Assembly ═══
    updateProgress(80, 'Assembling EPUB...', 'Creating package structure and metadata.');
    logMessage('Phase 5: Assembling EPUB container...');

    zip.file('mimetype', 'application/epub+zip', { compression: "STORE" });
    zip.file('META-INF/container.xml',
`<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`);

    zip.file('OEBPS/stylesheet.css',
`body {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    margin: 1.5em 1em;
    padding: 0;
    line-height: 1.6;
    font-size: ${baseFontSize};
    color: #111;
    background: #fff;
}
p {
    text-indent: 1.5em;
    margin: 0 0 0.5em 0;
    text-align: justify;
    orphans: 2;
    widows: 2;
}
h1 {
    font-size: 1.8em;
    font-weight: bold;
    text-align: center;
    margin: 2em 0 1em;
    page-break-before: always;
}
h2 {
    font-size: 1.4em;
    font-weight: bold;
    margin: 1.5em 0 0.8em;
}
.cover-wrapper { text-align: center; page-break-after: always; margin: 0; padding: 0; }
.cover-img { max-width: 100%; height: auto; max-height: 95vh; }`);

    // Cover
    let hasCover = false;
    if (coverStyle !== 'none') {
        updateProgress(85, 'Generating cover...', 'Creating cover image.');
        try {
            const coverBlob = await generateBookCoverBlob(coverStyle, title, author);
            if (coverBlob) { zip.file('OEBPS/images/cover.jpg', coverBlob); hasCover = true; logMessage('Cover image created.', 'success'); }
        } catch (e) { logMessage(`Cover failed: ${e.message}. Skipping.`, 'info'); }
    }

    if (hasCover) {
        zip.file('OEBPS/cover.xhtml',
`<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head><title>Cover</title><link rel="stylesheet" type="text/css" href="stylesheet.css"/></head>
<body><div class="cover-wrapper"><img class="cover-img" src="images/cover.jpg" alt="Cover"/></div></body>
</html>`);
    }

    chapters.forEach(ch => {
        zip.file(`OEBPS/${ch.id}.xhtml`,
`<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head><title>${escapeHtml(ch.title)}</title><link rel="stylesheet" type="text/css" href="stylesheet.css"/></head>
<body>
${ch.content}
</body>
</html>`);
    });

    let tocItems = '';
    chapters.forEach(ch => { tocItems += `        <li><a href="${ch.id}.xhtml">${escapeHtml(ch.title)}</a></li>\n`; });

    zip.file('OEBPS/toc.xhtml',
`<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head><title>Table of Contents</title><link rel="stylesheet" type="text/css" href="stylesheet.css"/></head>
<body>
    <nav epub:type="toc" id="toc">
        <h1>Table of Contents</h1>
        <ol>
${hasCover ? '            <li><a href="cover.xhtml">Cover</a></li>\n' : ''}${tocItems}        </ol>
    </nav>
</body>
</html>`);

    const uuid = generateUUID();
    const now = new Date().toISOString().replace(/\.\d+Z$/, "Z");
    let manifest = '', spine = '';

    if (hasCover) {
        manifest += `    <item id="cover-page" href="cover.xhtml" media-type="application/xhtml+xml"/>\n`;
        manifest += `    <item id="cover-image" href="images/cover.jpg" media-type="image/jpeg" properties="cover-image"/>\n`;
        spine += `    <itemref idref="cover-page"/>\n`;
    }
    manifest += `    <item id="toc" href="toc.xhtml" media-type="application/xhtml+xml" properties="nav"/>\n`;
    manifest += `    <item id="style" href="stylesheet.css" media-type="text/css"/>\n`;
    spine += `    <itemref idref="toc"/>\n`;
    chapters.forEach(ch => {
        manifest += `    <item id="${ch.id}" href="${ch.id}.xhtml" media-type="application/xhtml+xml"/>\n`;
        spine += `    <itemref idref="${ch.id}"/>\n`;
    });

    zip.file('OEBPS/content.opf',
`<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookID" version="3.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>${escapeHtml(title)}</dc:title>
    <dc:creator>${escapeHtml(author)}</dc:creator>
    <dc:language>en</dc:language>
    <dc:identifier id="BookID">urn:uuid:${uuid}</dc:identifier>
    <meta property="dcterms:modified">${now}</meta>
  </metadata>
  <manifest>
${manifest}  </manifest>
  <spine>
${spine}  </spine>
</package>`);

    updateProgress(95, 'Zipping...', 'Building compressed EPUB package.');
    logMessage('Compiling files into EPUB ZIP container...');
    const blob = await zip.generateAsync({ type: 'blob', mimeType: 'application/epub+zip' });
    logMessage('EPUB file completed.', 'success');
    return blob;
}


// ─────────────────────────────────────────────────────────────────────────────
// Mode B: Fixed Image Mode Converter
// ─────────────────────────────────────────────────────────────────────────────

async function convertImageMode(title, author, dpi, coverStyle, totalPages) {
    const zip = new JSZip();
    logMessage(`Executing Fixed Image extraction at ${dpi} DPI...`);
    const scale = dpi / 72;

    zip.file('mimetype', 'application/epub+zip', { compression: "STORE" });
    zip.file('META-INF/container.xml',
`<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`);
    zip.file('OEBPS/stylesheet.css',
`@page { margin: 0; padding: 0; }
body { margin: 0; padding: 0; background: #000; text-align: center; }
.page-wrapper { margin: 0; padding: 0; width: 100%; height: 100vh; display: flex; align-items: center; justify-content: center; }
.page-img { max-width: 100%; max-height: 100%; object-fit: contain; }`);

    let hasCover = false;
    if (coverStyle !== 'none') {
        updateProgress(5, 'Generating cover...', 'Creating cover image.');
        try {
            const coverBlob = await generateBookCoverBlob(coverStyle, title, author);
            if (coverBlob) { zip.file('OEBPS/images/cover.jpg', coverBlob); hasCover = true; logMessage('Cover generated.', 'success'); }
        } catch (e) { logMessage(`Cover failed. Skipping.`, 'info'); }
    }

    for (let i = 1; i <= totalPages; i++) {
        updateProgress(10 + (i / totalPages) * 80, `Rendering page ${i}/${totalPages}`, 'Rasterizing page graphics.');
        try {
            const page = await pdfDoc.getPage(i);
            const vp = page.getViewport({ scale });
            const canvas = document.createElement('canvas');
            canvas.width = vp.width; canvas.height = vp.height;
            await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
            const imgBlob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', 0.75));
            zip.file(`OEBPS/images/page_${i}.jpg`, imgBlob);
            zip.file(`OEBPS/page_${i}.xhtml`,
`<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head><title>Page ${i}</title><link rel="stylesheet" type="text/css" href="stylesheet.css"/></head>
<body><div class="page-wrapper"><img class="page-img" src="images/page_${i}.jpg" alt="Page ${i}"/></div></body>
</html>`);
        } catch (e) { logMessage(`Failed page ${i}: ${e.message}`, 'error'); }
    }

    if (hasCover) {
        zip.file('OEBPS/cover.xhtml',
`<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head><title>Cover</title><link rel="stylesheet" type="text/css" href="stylesheet.css"/></head>
<body><div class="page-wrapper"><img class="page-img" src="images/cover.jpg" alt="Cover"/></div></body>
</html>`);
    }

    let tocItems = '';
    for (let i = 1; i <= totalPages; i++) tocItems += `        <li><a href="page_${i}.xhtml">Page ${i}</a></li>\n`;

    zip.file('OEBPS/toc.xhtml',
`<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head><title>Table of Contents</title><link rel="stylesheet" type="text/css" href="stylesheet.css"/></head>
<body>
    <nav epub:type="toc" id="toc">
        <h1>Table of Contents</h1>
        <ol>
${hasCover ? '            <li><a href="cover.xhtml">Cover</a></li>\n' : ''}${tocItems}        </ol>
    </nav>
</body>
</html>`);

    const uuid = generateUUID();
    const now = new Date().toISOString().replace(/\.\d+Z$/, "Z");
    let manifest = '', spine = '';
    if (hasCover) {
        manifest += `    <item id="cover-page" href="cover.xhtml" media-type="application/xhtml+xml"/>\n`;
        manifest += `    <item id="cover-image" href="images/cover.jpg" media-type="image/jpeg" properties="cover-image"/>\n`;
        spine += `    <itemref idref="cover-page"/>\n`;
    }
    manifest += `    <item id="toc" href="toc.xhtml" media-type="application/xhtml+xml" properties="nav"/>\n`;
    manifest += `    <item id="style" href="stylesheet.css" media-type="text/css"/>\n`;
    spine += `    <itemref idref="toc"/>\n`;
    for (let i = 1; i <= totalPages; i++) {
        manifest += `    <item id="page_${i}" href="page_${i}.xhtml" media-type="application/xhtml+xml"/>\n`;
        manifest += `    <item id="img_${i}" href="images/page_${i}.jpg" media-type="image/jpeg"/>\n`;
        spine += `    <itemref idref="page_${i}"/>\n`;
    }

    zip.file('OEBPS/content.opf',
`<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookID" version="3.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>${escapeHtml(title)}</dc:title>
    <dc:creator>${escapeHtml(author)}</dc:creator>
    <dc:language>en</dc:language>
    <dc:identifier id="BookID">urn:uuid:${uuid}</dc:identifier>
    <meta property="dcterms:modified">${now}</meta>
  </metadata>
  <manifest>
${manifest}  </manifest>
  <spine>
${spine}  </spine>
</package>`);

    updateProgress(95, 'Zipping...', 'Building compressed EPUB package.');
    const blob = await zip.generateAsync({ type: 'blob', mimeType: 'application/epub+zip' });
    logMessage('EPUB file completed.', 'success');
    return blob;
}


// ─────────────────────────────────────────────────────────────────────────────
// Cover Art Generation
// ─────────────────────────────────────────────────────────────────────────────

async function generateBookCoverBlob(style, title, author) {
    if (style === 'first-page' && pdfDoc) {
        logMessage('Rendering PDF first page as cover...');
        try {
            const page = await pdfDoc.getPage(1);
            const vp = page.getViewport({ scale: 120 / 72 });
            const canvas = document.createElement('canvas');
            canvas.width = vp.width; canvas.height = vp.height;
            await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
            return new Promise(r => canvas.toBlob(r, 'image/jpeg', 0.85));
        } catch (e) { logMessage('First-page cover failed, using typography.', 'info'); }
    }

    logMessage('Drawing typography cover...');
    const canvas = document.createElement('canvas');
    canvas.width = 600; canvas.height = 840;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1e1b4b');
    gradient.addColorStop(0.5, '#0f172a');
    gradient.addColorStop(1, '#020617');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)'; ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)'; ctx.lineWidth = 1;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    ctx.fillStyle = '#8b5cf6';
    ctx.beginPath(); ctx.roundRect(canvas.width / 2 - 60, 80, 120, 24, 12); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('VISTA LABS EPUB', canvas.width / 2, 96);

    ctx.fillStyle = '#fff'; ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const words = title.split(' ');
    let lines = [], cur = '';
    for (let n = 0; n < words.length; n++) {
        let test = cur + words[n] + ' ';
        if (ctx.measureText(test).width > 480 && n > 0) { lines.push(cur.trim()); cur = words[n] + ' '; }
        else cur = test;
    }
    lines.push(cur.trim());
    let sy = 320 - (lines.length - 1) * 24;
    for (let i = 0; i < lines.length; i++) ctx.fillText(lines[i], canvas.width / 2, sy + i * 52);

    ctx.fillStyle = '#a78bfa'; ctx.font = '500 20px sans-serif';
    ctx.fillText(author, canvas.width / 2, 580);
    ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.font = 'bold 14px sans-serif';
    ctx.fillText('V I S T A  L A B S', canvas.width / 2, 750);

    return new Promise(r => canvas.toBlob(r, 'image/jpeg', 0.85));
}

function finalizeSuccess(title, author, blob, coverStyle) {
    logMessage('Preparing download...', 'success');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${sanitizeFilename(title)}.epub`;
    successBookTitle.textContent = title;
    successBookAuthor.textContent = author ? `by ${author}` : '';
    successFileSize.textContent = (blob.size / (1024 * 1024)).toFixed(2) + ' MB';
    drawCoverPreview(coverStyle, title, author);
    updateProgress(100, 'Done!', 'EPUB created successfully.');
    logMessage('All tasks completed. Ready for download.', 'success');
    setTimeout(() => showStep('success'), 500);
}

async function drawCoverPreview(style, title, author) {
    const ctx = epubCoverCanvas.getContext('2d');
    if (style === 'first-page' && pdfDoc) {
        try {
            const page = await pdfDoc.getPage(1);
            const s = epubCoverCanvas.width / page.getViewport({ scale: 1 }).width;
            const vp = page.getViewport({ scale: s });
            await page.render({ canvasContext: ctx, viewport: vp }).promise;
            return;
        } catch (e) { /* fall through */ }
    }
    const gradient = ctx.createLinearGradient(0, 0, 0, epubCoverCanvas.height);
    gradient.addColorStop(0, '#1e1b4b'); gradient.addColorStop(1, '#020617');
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, epubCoverCanvas.width, epubCoverCanvas.height);
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)'; ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, epubCoverCanvas.width - 20, epubCoverCanvas.height - 20);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const words = title.split(' ');
    let lines = [], cur = '';
    for (let n = 0; n < words.length; n++) {
        let test = cur + words[n] + ' ';
        if (ctx.measureText(test).width > epubCoverCanvas.width - 40 && n > 0) { lines.push(cur.trim()); cur = words[n] + ' '; }
        else cur = test;
    }
    lines.push(cur.trim());
    let sy = 160 - (lines.length - 1) * 10;
    for (let i = 0; i < lines.length; i++) ctx.fillText(lines[i], epubCoverCanvas.width / 2, sy + i * 24);
    ctx.fillStyle = '#a78bfa'; ctx.font = '500 11px sans-serif';
    ctx.fillText(author, epubCoverCanvas.width / 2, 280);
    ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.font = 'bold 8px sans-serif';
    ctx.fillText('V I S T A  L A B S', epubCoverCanvas.width / 2, 380);
}

// ─────────────────────────────────────────────────────────────────────────────
// System Utilities
// ─────────────────────────────────────────────────────────────────────────────

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function sanitizeFilename(name) {
    return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}
