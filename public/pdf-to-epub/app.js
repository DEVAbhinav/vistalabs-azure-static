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

const TEXT_MODE_SNAPSHOT_DPI = 110;
const TEXT_MODE_SNAPSHOT_QUALITY = 0.78;
const PDF_OPS = (typeof pdfjsLib !== 'undefined' && pdfjsLib.OPS) ? pdfjsLib.OPS : {};
const IMAGE_PAINT_OPS = new Set([
    PDF_OPS.paintImageXObject,
    PDF_OPS.paintJpegXObject,
    PDF_OPS.paintInlineImageXObject,
    PDF_OPS.paintImageMaskXObject,
].filter(Boolean));

function normalizeText(text) {
    return (text || '').replace(/\s+/g, ' ').trim();
}

function canonicalText(text) {
    return normalizeText(text)
        .toLowerCase()
        .replace(/\bpage\s+\d+\b/g, 'page #')
        .replace(/\bchapter\s+\d+\b/g, 'chapter #')
        .replace(/\d+/g, '#')
        .replace(/[^\p{L}\p{N}# ]/gu, '')
        .trim();
}

function getItemFontSize(item) {
    if (!item || !item.transform) return 0;
    return Math.max(Math.abs(item.transform[0] || 0), Math.abs(item.transform[3] || 0));
}

function collectSamplePages(numPages) {
    const pages = new Set();
    for (let i = 1; i <= Math.min(numPages, 20); i++) pages.add(i);
    if (numPages > 20) {
        const step = Math.max(1, Math.floor(numPages / 35));
        for (let i = 21; i <= numPages && pages.size < 60; i += step) pages.add(i);
    }
    return [...pages].sort((a, b) => a - b);
}

async function analyzeDocument(pdfDoc) {
    const result = {
        bodyFontSize: 10,
        headerPatterns: new Set(),
        footerPatterns: new Set(),
        canonicalHeaderPatterns: new Set(),
        canonicalFooterPatterns: new Set(),
        avgPageHeight: 792,
        avgPageWidth: 612,
    };

    const fontSizeCharCount = {};
    const topTexts = {};
    const bottomTexts = {};
    const samplePages = collectSamplePages(pdfDoc.numPages);
    let totalHeight = 0, totalWidth = 0;

    for (const pageNum of samplePages) {
        const page = await pdfDoc.getPage(pageNum);
        const vp = page.getViewport({ scale: 1 });
        const tc = await page.getTextContent();
        totalHeight += vp.height;
        totalWidth += vp.width;

        const topZone = vp.height * 0.88;
        const bottomZone = vp.height * 0.12;
        const pageTopTexts = new Set();
        const pageBottomTexts = new Set();

        for (const item of tc.items || []) {
            const text = normalizeText(item.str);
            if (!text) continue;
            const fs = Math.round(getItemFontSize(item) * 2) / 2;
            if (fs > 0) fontSizeCharCount[fs] = (fontSizeCharCount[fs] || 0) + text.length;

            const y = item.transform[5];
            if (y > topZone) pageTopTexts.add(text);
            if (y < bottomZone) pageBottomTexts.add(text);
        }

        for (const t of pageTopTexts) topTexts[t] = (topTexts[t] || 0) + 1;
        for (const t of pageBottomTexts) bottomTexts[t] = (bottomTexts[t] || 0) + 1;
    }

    result.avgPageHeight = totalHeight / Math.max(samplePages.length, 1);
    result.avgPageWidth = totalWidth / Math.max(samplePages.length, 1);

    let maxChars = 0;
    for (const [fs, chars] of Object.entries(fontSizeCharCount)) {
        if (chars > maxChars) {
            maxChars = chars;
            result.bodyFontSize = parseFloat(fs);
        }
    }

    const threshold = Math.max(2, samplePages.length * 0.25);
    for (const [text, count] of Object.entries(topTexts)) {
        const canonical = canonicalText(text);
        if (count >= threshold || isLikelyRunningHeader(text)) {
            result.headerPatterns.add(text);
            if (canonical) result.canonicalHeaderPatterns.add(canonical);
        }
    }
    for (const [text, count] of Object.entries(bottomTexts)) {
        const canonical = canonicalText(text);
        if (count >= threshold || isPageNumberText(text)) {
            result.footerPatterns.add(text);
            if (canonical) result.canonicalFooterPatterns.add(canonical);
        }
    }

    return result;
}

function isPageNumberText(text) {
    const t = normalizeText(text);
    return /^\d{1,5}$/.test(t)
        || /^[ivxlcdm]+$/i.test(t) && t.length < 8
        || /^page\s+\d+$/i.test(t)
        || /^[-–—]\s*\d+\s*[-–—]$/.test(t);
}

function isLikelyRunningHeader(text) {
    const t = normalizeText(text);
    return t.length < 90 && (
        /\bcracking\s+the\s+pm\s+interview\b/i.test(t)
        || /\bchapter\s+\d{1,3}\b/i.test(t)
    );
}

function matchesRecurringPattern(text, exactPatterns, canonicalPatterns) {
    const t = normalizeText(text);
    if (exactPatterns.has(t)) return true;
    const canonical = canonicalText(t);
    if (canonical && canonicalPatterns.has(canonical)) return true;
    for (const pattern of exactPatterns) {
        if (pattern.includes(t) && t.length > 3) return true;
    }
    return false;
}

function filterHeadersFooters(items, analysis, pageHeight) {
    const topZone = pageHeight * 0.88;
    const bottomZone = pageHeight * 0.115;

    return items.filter(item => {
        const text = normalizeText(item.str);
        if (!text) return false;
        const y = item.transform[5];
        const fs = getItemFontSize(item);

        if (y > topZone) {
            if (matchesRecurringPattern(text, analysis.headerPatterns, analysis.canonicalHeaderPatterns)) return false;
            if (isLikelyRunningHeader(text) && fs <= analysis.bodyFontSize * 1.15) return false;
            if (fs < analysis.bodyFontSize * 0.95 && text.length < 100) return false;
        }

        if (y < bottomZone) {
            if (matchesRecurringPattern(text, analysis.footerPatterns, analysis.canonicalFooterPatterns)) return false;
            if (isPageNumberText(text)) return false;
            if (fs < analysis.bodyFontSize * 0.95 && text.length < 90) return false;
        }

        return true;
    });
}

function detectColumns(items, pageWidth) {
    if (items.length < 8) return [items];

    const numBuckets = 48;
    const bucketWidth = pageWidth / numBuckets;
    const buckets = new Array(numBuckets).fill(0);

    for (const item of items) {
        const xCenter = item.transform[4] + (item.width || 0) / 2;
        const b = Math.min(numBuckets - 1, Math.max(0, Math.floor(xCenter / bucketWidth)));
        buckets[b]++;
    }

    let bestGapCenter = -1, bestGapWidth = 0;
    for (let i = Math.floor(numBuckets * 0.18); i <= Math.ceil(numBuckets * 0.82); ) {
        if (buckets[i] === 0) {
            const gapStart = i;
            while (i <= Math.ceil(numBuckets * 0.82) && buckets[i] === 0) i++;
            const gapW = i - gapStart;
            if (gapW > bestGapWidth) {
                bestGapWidth = gapW;
                bestGapCenter = (gapStart + i) / 2;
            }
        } else {
            i++;
        }
    }

    if (bestGapWidth >= 3 && bestGapCenter > 0) {
        const splitX = bestGapCenter * bucketWidth;
        const left = items.filter(it => (it.transform[4] + (it.width || 0) / 2) < splitX);
        const right = items.filter(it => (it.transform[4] + (it.width || 0) / 2) >= splitX);
        const balance = Math.min(left.length, right.length) / Math.max(left.length, right.length);
        if (left.length >= 5 && right.length >= 5 && balance > 0.22) return [left, right];
    }

    return [items];
}

function groupItemsIntoLines(items) {
    const sorted = [...items].sort((a, b) => {
        const dy = b.transform[5] - a.transform[5];
        if (Math.abs(dy) < 2) return a.transform[4] - b.transform[4];
        return dy;
    });
    const lines = [];

    for (const item of sorted) {
        const fs = getItemFontSize(item) || 10;
        const threshold = Math.max(3, Math.min(6.5, fs * 0.55));
        let target = null;
        for (const line of lines) {
            if (Math.abs(line.y - item.transform[5]) <= threshold) {
                target = line;
                break;
            }
        }
        if (!target) {
            target = { y: item.transform[5], items: [] };
            lines.push(target);
        }
        target.items.push(item);
        target.y = target.items.reduce((sum, it) => sum + it.transform[5], 0) / target.items.length;
    }

    return lines.sort((a, b) => b.y - a.y).map(line => buildStructuredLine(line.items));
}

function buildStructuredLine(lineItems) {
    lineItems.sort((a, b) => a.transform[4] - b.transform[4]);
    const fontSizes = lineItems.map(getItemFontSize).filter(Boolean);
    const fontSize = fontSizes.length ? Math.max(...fontSizes) : 10;
    const baseline = lineItems.reduce((sum, item) => sum + item.transform[5], 0) / lineItems.length;
    const x = Math.min(...lineItems.map(item => item.transform[4]));
    const right = Math.max(...lineItems.map(item => item.transform[4] + (item.width || 0)));
    let text = '';
    let html = '';
    let largeGapCount = 0;

    for (let i = 0; i < lineItems.length; i++) {
        const item = lineItems[i];
        const raw = item.str || '';
        if (i > 0) {
            const prev = lineItems[i - 1];
            const prevEnd = prev.transform[4] + (prev.width || 0);
            const gap = item.transform[4] - prevEnd;
            const spaceThreshold = Math.max(1.2, getItemFontSize(item) * 0.25);
            if (gap > spaceThreshold && !text.endsWith(' ') && !raw.startsWith(' ')) {
                const spacer = gap > fontSize * 1.4 ? '    ' : ' ';
                if (spacer.length > 1) largeGapCount++;
                text += spacer;
                html += spacer;
            }
        }

        const itemFont = getItemFontSize(item);
        const isSuper = item.transform[5] > baseline + Math.max(1.6, fontSize * 0.25) && itemFont < fontSize * 0.95;
        const isSub = item.transform[5] < baseline - Math.max(1.6, fontSize * 0.25) && itemFont < fontSize * 0.95;
        text += raw;
        if (isSuper) html += `<sup>${escapeHtml(raw)}</sup>`;
        else if (isSub) html += `<sub>${escapeHtml(raw)}</sub>`;
        else html += escapeHtml(raw);
    }

    return {
        text: normalizeText(text),
        html: html.trim(),
        fontSize,
        y: baseline,
        x,
        width: right - x,
        largeGapCount,
        itemCount: lineItems.length,
    };
}

function extractBlocksFromColumn(items, bodyFontSize) {
    if (!items.length) return [];
    const structuredLines = groupItemsIntoLines(items).filter(line => line.text);
    if (!structuredLines.length) return [];

    const blocks = [];
    let blockLines = [structuredLines[0]];
    let blockFontSize = structuredLines[0].fontSize;

    for (let i = 1; i < structuredLines.length; i++) {
        const line = structuredLines[i];
        const prevLine = structuredLines[i - 1];
        const yGap = Math.abs(prevLine.y - line.y);
        const fontChanged = Math.abs(blockFontSize - line.fontSize) > 0.9;
        const largeGap = yGap > Math.max(blockFontSize * 1.75, 15);
        const listBoundary = parseListLine(line.text) || parseListLine(prevLine.text);
        const codeBoundary = isLikelyCodeLine(line.text) || isLikelyCodeLine(prevLine.text);
        const startsHeading = looksLikeStandaloneHeading(line.text, line.fontSize / bodyFontSize);

        if (fontChanged || largeGap || (startsHeading && blockLines.length > 0) || (listBoundary && largeGap) || (codeBoundary && largeGap)) {
            blocks.push(finalizeBlock(blockLines, blockFontSize, bodyFontSize));
            blockLines = [line];
            blockFontSize = line.fontSize;
        } else {
            blockLines.push(line);
        }
    }
    blocks.push(finalizeBlock(blockLines, blockFontSize, bodyFontSize));

    return blocks.filter(Boolean);
}

function parseListLine(text) {
    const t = normalizeText(text);
    let m = t.match(/^(\d{1,3})[.)]\s+(.+)$/);
    if (m) return { ordered: true, number: parseInt(m[1], 10), text: m[2] };
    m = t.match(/^(\d{1,3}(?:\.\d{1,3})+)\s+(.+)$/);
    if (m) return { ordered: true, number: parseInt(m[1], 10), text: m[2] };
    m = t.match(/^([A-Za-z])[.)]\s+(.+)$/);
    if (m) return { ordered: true, number: null, text: m[2] };
    m = t.match(/^[-*•]\s+(.+)$/);
    if (m) return { ordered: false, number: null, text: m[1] };
    return null;
}

function isQuestionPrompt(text) {
    return /^(?:\d{1,3}(?:[.)]|\.\d{1,3})?\s*)?(tell me|describe|suppose|estimate|design|improve|create|write|implement|what|how|why|when|where|which|you notice|given)\b/i.test(text)
        || /\?\s*$/.test(text);
}

function isLikelyCodeLine(text) {
    const t = normalizeText(text);
    if (!t) return false;
    if (/^(?:\d{1,3}[.)]\s*)?(for|while|if|else|return|class|public|private|void|int|string|boolean|function|let|const|var|print|sum)\b/i.test(t)) return true;
    if (/[{};]/.test(t) && /\b(for|while|if|return|int|string|void|new|class|function)\b/i.test(t)) return true;
    if (/^\d{1,3}[.)]\s*[\w[\]<>]+\s*[=({]/.test(t)) return true;
    return false;
}

function isLikelyCodeBlock(lines) {
    const codeLines = lines.filter(line => isLikelyCodeLine(line.text)).length;
    const hasCodePunctuation = lines.some(line => /[{};]/.test(line.text));
    return codeLines >= 2 || (codeLines >= 1 && hasCodePunctuation);
}

function isLikelyTableBlock(lines) {
    if (lines.length < 2) return false;
    const tabularLines = lines.filter(line => line.largeGapCount >= 2 || /\s{4,}/.test(line.text)).length;
    return tabularLines >= Math.max(2, Math.ceil(lines.length * 0.5));
}

function looksLikeStandaloneHeading(text, ratio) {
    const t = cleanHeadingText(text);
    if (!t || t.length > 140) return false;
    if (isQuestionPrompt(t) || isLikelyCodeLine(t)) return false;
    if (isLikelyNumberedChapterTitle(t, ratio)) return true;
    if (/^(chapter\s+[ivxlcdm\d]+|part\s+[ivxlcdm\d]+|section\s+[ivxlcdm\d]+|prologue|epilogue|appendix|introduction|conclusion|preface|foreword|acknowledgements?|about the author|bibliography|references|glossary|index)\b/i.test(t)) return true;
    return ratio >= 1.18 && !/[.!?]\s*$/.test(t) && countWords(t) <= 12;
}

function countWords(text) {
    return normalizeText(text).split(/\s+/).filter(Boolean).length;
}

function cleanHeadingText(text) {
    let t = normalizeText(text);
    t = t.replace(/\s+\bChapter\s+\d{1,3}\s*$/i, '');
    t = t.replace(/^Chapter\s+\d{1,3}\s+(.+)$/i, '$1');
    t = t.replace(/\s+\bPage\s+\d{1,5}\s*$/i, '');
    return normalizeText(t);
}

function isLikelyNumberedChapterTitle(text, ratio) {
    const m = normalizeText(text).match(/^(\d{1,2})[.)]\s+(.+)$/);
    if (!m) return false;
    const rest = m[2].trim();
    if (!rest || rest.length > 70) return false;
    if (isQuestionPrompt(text) || isLikelyCodeLine(text)) return false;
    if (/[.!?]\s*$/.test(rest)) return false;
    if (/\b(and|or|to|with|across|when|in|of|a|the)$/i.test(rest)) return false;
    return ratio >= 1.1 && /^[A-Z]/.test(rest) && countWords(rest) <= 8;
}

function joinLinesForParagraph(lines) {
    let text = '';
    let html = '';
    for (let i = 0; i < lines.length; i++) {
        const lineText = lines[i].text;
        const lineHtml = lines[i].html || escapeHtml(lineText);
        if (i === 0) {
            text = lineText;
            html = lineHtml;
        } else if (text.endsWith('-') && !text.endsWith('--')) {
            text = text.slice(0, -1) + lineText;
            html = html.endsWith('-') ? html.slice(0, -1) + lineHtml : html + lineHtml;
        } else {
            text += ' ' + lineText;
            html += ' ' + lineHtml;
        }
    }
    return { text: normalizeText(text), html: normalizeText(html) };
}

function finalizeBlock(lines, blockFontSize, bodyFontSize) {
    if (!lines.length) return null;
    const ratio = blockFontSize / bodyFontSize;
    const parsedList = lines.map(line => parseListLine(line.text));
    const listCount = parsedList.filter(Boolean).length;

    if (isLikelyCodeBlock(lines)) {
        return {
            type: 'pre',
            text: lines.map(line => line.text).join('\n'),
            fontSize: blockFontSize,
        };
    }

    if (isLikelyTableBlock(lines)) {
        return {
            type: 'pre',
            subtype: 'table',
            text: lines.map(line => line.text).join('\n'),
            fontSize: blockFontSize,
        };
    }

    if (listCount > 0 && listCount >= Math.ceil(lines.length * 0.6)) {
        const first = parsedList.find(Boolean);
        return {
            type: 'list',
            ordered: first.ordered,
            start: first.number || 1,
            items: parsedList.map((item, idx) => item ? item.text : lines[idx].text),
            text: lines.map(line => line.text).join(' '),
            fontSize: blockFontSize,
        };
    }

    const joined = joinLinesForParagraph(lines);
    let text = joined.text;
    let html = joined.html;
    let type = 'p';
    const cleanedHeading = cleanHeadingText(text);

    if (looksLikeStandaloneHeading(cleanedHeading, ratio)) {
        text = cleanedHeading;
        html = escapeHtml(cleanedHeading);
        type = ratio >= 1.35 || /^(chapter|part|appendix|introduction|conclusion|preface|foreword|acknowledgements?|about the author)\b/i.test(text)
            ? 'h1'
            : 'h2';
    } else if (text.length < 150 && ratio >= 1.2 && !isQuestionPrompt(text) && !isLikelyCodeLine(text)) {
        text = cleanedHeading;
        html = escapeHtml(cleanedHeading);
        type = 'h2';
    }

    return { type, text, html, fontSize: blockFontSize };
}

function mergeCrossPageBlocks(allPageBlocks) {
    const merged = [];

    for (const pageBlocks of allPageBlocks) {
        for (const pageBlock of pageBlocks) {
            const block = { ...pageBlock };
            if (merged.length > 0 && block.type === 'p') {
                const last = merged[merged.length - 1];
                if (last.type === 'p' && !last.text.match(/[.!?:;""')\]]\s*$/)) {
                    const startsLower = /^[a-z]/.test(block.text);
                    const lastEndsWithComma = /,\s*$/.test(last.text);
                    if (startsLower || lastEndsWithComma) {
                        last.text += ' ' + block.text;
                        last.html = `${last.html || escapeHtml(last.text)} ${block.html || escapeHtml(block.text)}`;
                        continue;
                    }
                }
            }
            merged.push(block);
        }
    }

    return merged;
}

function isBareChapterMarker(text) {
    return /^chapter\s+[ivxlcdm\d]{1,6}$/i.test(normalizeText(text));
}

function isExplicitSectionMarker(text) {
    return /^(part|prologue|epilogue|appendix|acknowledgements?|about the author|bibliography|references|glossary|index)\b/i.test(normalizeText(text));
}

function isGoodChapterTitleCandidate(block) {
    if (!block || !['h1', 'h2'].includes(block.type)) return false;
    const title = cleanHeadingText(block.text);
    if (!title || title.length > 95) return false;
    if (isBareChapterMarker(title) || isQuestionPrompt(title) || isLikelyCodeLine(title)) return false;
    if (/^\d{1,3}(?:[.)]|\.\d{1,3})\s+/.test(title) && !isLikelyNumberedChapterTitle(title, block.fontSize / 10)) return false;
    if (!/^[A-Z0-9"'“‘([]/.test(title)) return false;
    if (/[.!?]/.test(title)) return false;
    if (/\b(and|or|to|with|across|when|in|of|a|the)$/i.test(title)) return false;
    return countWords(title) <= 10;
}

function prepareBlocksForChaptering(blocks) {
    const prepared = blocks.map(block => ({ ...block }));
    for (let i = 0; i < prepared.length - 1; i++) {
        const current = prepared[i];
        const next = prepared[i + 1];
        if (isGoodChapterTitleCandidate(current) && next && isBareChapterMarker(next.text)) {
            current.type = 'h1';
            current._explicitChapter = true;
            current._chapterMarker = next.text;
            next._dropFromContent = true;
        }
    }
    return prepared;
}

function isChapterSplitTitle(block, splitMode, currentTextLength, currentParagraphs, chapterPairMode) {
    if (!block || block.type !== 'h1') return false;
    const title = cleanHeadingText(block.text);
    if (!title || title.length > 100) return false;
    if (isQuestionPrompt(title) || isLikelyCodeLine(title)) return false;
    if (block._explicitChapter) return true;
    if (isExplicitSectionMarker(title)) return true;
    if (chapterPairMode) return false;
    if (isBareChapterMarker(title)) return true;
    if (/^\d{1,3}(?:[.)]|\.\d{1,3})\s+/.test(title) && !isLikelyNumberedChapterTitle(title, block.fontSize / 10)) return false;
    if (splitMode === 'header') return isGoodChapterTitleCandidate(block);
    return currentTextLength > 16000
        && currentParagraphs > 14
        && isGoodChapterTitleCandidate(block)
        && !/:/.test(title);
}

function renderBlock(block) {
    if (block.type === 'h1') return `<h1>${escapeHtml(cleanHeadingText(block.text))}</h1>`;
    if (block.type === 'h2') return `<h2>${escapeHtml(cleanHeadingText(block.text))}</h2>`;
    if (block.type === 'pre') {
        const cls = block.subtype === 'table' ? 'table-like' : 'code-block';
        return `<pre class="${cls}"><code>${escapeHtml(block.text)}</code></pre>`;
    }
    if (block.type === 'list') {
        const tag = block.ordered ? 'ol' : 'ul';
        const start = block.ordered && block.start > 1 ? ` start="${block.start}"` : '';
        const items = block.items.map(item => `        <li>${escapeHtml(item)}</li>`).join('\n');
        return `<${tag} class="list-block"${start}>\n${items}\n</${tag}>`;
    }
    if (block.type === 'image') {
        return `<figure class="page-snapshot"><img src="${escapeHtml(block.src)}" alt="${escapeHtml(block.alt)}"/></figure>`;
    }
    return `<p>${block.html || escapeHtml(block.text)}</p>`;
}

function buildChapters(blocks, splitMode) {
    const chapterBlocks = prepareBlocksForChaptering(blocks);
    const chapterPairMode = splitMode === 'auto' && chapterBlocks.filter(block => block._explicitChapter).length >= 3;
    const chapters = [];
    let chapterCount = 1;
    let currentChapter = { id: 'chapter_1', title: 'Front Matter', content: '' };
    let currentChapterTextLength = 0;
    let currentChapterParagraphs = 0;

    const pushCurrent = () => {
        if (currentChapter.content.trim()) chapters.push({ ...currentChapter });
    };

    for (const originalBlock of chapterBlocks) {
        const block = { ...originalBlock };
        if (block._dropFromContent) continue;
        const shouldSplit = splitMode !== 'none'
            && isChapterSplitTitle(block, splitMode, currentChapterTextLength, currentChapterParagraphs, chapterPairMode);

        if (shouldSplit) {
            pushCurrent();
            if (chapters.length > 0 || currentChapter.content.trim()) chapterCount++;
            const chapterTitle = cleanHeadingText(block.text);
            currentChapter = {
                id: `chapter_${chapterCount}`,
                title: chapterTitle,
                content: `<h1>${escapeHtml(chapterTitle)}</h1>\n`
            };
            currentChapterTextLength = chapterTitle.length;
            currentChapterParagraphs = 0;
            continue;
        }

        if (block.type === 'h1') block.type = 'h2';
        currentChapter.content += renderBlock(block) + '\n';
        if (block.type === 'p') currentChapterParagraphs++;
        if (block.text) currentChapterTextLength += block.text.length;

        if (splitMode === 'auto' && currentChapter.content.length > 120000) {
            const baseTitle = currentChapter.title.replace(/\s+\(continued.*\)$/i, '');
            pushCurrent();
            chapterCount++;
            currentChapter = {
                id: `chapter_${chapterCount}`,
                title: `${baseTitle} (continued ${chapterCount})`,
                content: ''
            };
            currentChapterTextLength = 0;
            currentChapterParagraphs = 0;
        }
    }

    pushCurrent();
    if (chapters.length === 0) chapters.push({ id: 'chapter_1', title: 'Book Content', content: '<p>Empty Chapter.</p>' });
    return chapters;
}

function getSourceTocMetrics(pageBlocks) {
    const textBlocks = pageBlocks.filter(block => block.type !== 'image');
    const texts = textBlocks.map(block => block.text || '').filter(Boolean);
    const fullText = texts.join(' ');
    const entryCount = texts.filter(text => {
        const t = cleanHeadingText(text);
        return /^\d{1,2}[.)]\s+[A-Z]/.test(t) || /^(appendix|acknowledgements?|index|references|bibliography)\b/i.test(t);
    }).length;
    const headingCount = textBlocks.filter(block => block.type === 'h1' || block.type === 'h2' || block.type === 'list').length;
    const longNarrativeCount = texts.filter(text => text.length > 450 && /[.!?]\s+["A-Z]/.test(text)).length;
    return {
        hasTocHeading: /\btable\s+of\s+contents\b/i.test(fullText),
        entryCount,
        headingCount,
        longNarrativeCount,
        totalChars: fullText.length,
        blockCount: textBlocks.length,
    };
}

function isLikelySourceTocPage(pageBlocks, pageNumber, totalPages, tocActive) {
    if (pageNumber > Math.min(35, Math.max(12, totalPages * 0.18))) return false;
    const m = getSourceTocMetrics(pageBlocks);
    if (m.hasTocHeading && (m.entryCount >= 1 || m.headingCount >= 3)) return true;
    if (tocActive && m.entryCount >= 1 && m.longNarrativeCount === 0 && m.totalChars < 2200) return true;
    return m.entryCount >= 5 && m.longNarrativeCount === 0 && m.headingCount >= 5;
}

async function pageHasVisualContent(page, pageTextLen) {
    if (pageTextLen > 650) return false;
    const opList = await page.getOperatorList();
    const imageOps = (opList.fnArray || []).filter(fn => IMAGE_PAINT_OPS.has(fn)).length;
    return imageOps > 0 && (pageTextLen < 250 || imageOps >= 2);
}

async function renderPageSnapshot(page, pageNumber) {
    const viewport = page.getViewport({ scale: TEXT_MODE_SNAPSHOT_DPI / 72 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
    const blob = await new Promise((resolve, reject) => {
        canvas.toBlob(result => result ? resolve(result) : reject(new Error(`Could not encode page ${pageNumber} snapshot.`)), 'image/jpeg', TEXT_MODE_SNAPSHOT_QUALITY);
    });
    return {
        id: `snapshot_${pageNumber}`,
        path: `images/page_snapshot_${pageNumber}.jpg`,
        blob,
    };
}

async function createSnapshotBlock(page, pageNumber, imageAssets) {
    const asset = await renderPageSnapshot(page, pageNumber);
    imageAssets.push(asset);
    return {
        type: 'image',
        text: '',
        src: asset.path,
        alt: `Page ${pageNumber} visual snapshot`,
        pageNumber,
    };
}

function attachPageNumber(blocks, pageNumber) {
    return blocks.map(block => ({ ...block, pageNumber }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Mode A: Reflowable Text Mode Converter (Intelligent Pipeline)
// ─────────────────────────────────────────────────────────────────────────────

async function convertTextMode(title, author, splitMode, coverStyle, baseFontSize, totalPages) {
    const zip = new JSZip();
    const imageAssets = [];

    logMessage('Phase 1: Analyzing document structure...', 'info');
    updateProgress(2, 'Analyzing document...', 'Scanning pages for layout patterns, fonts, and headers.');
    const analysis = await analyzeDocument(pdfDoc);
    logMessage(`Body font: ${analysis.bodyFontSize}pt | ${analysis.headerPatterns.size} header patterns | ${analysis.footerPatterns.size} footer patterns detected`, 'success');

    logMessage('Phase 2: Extracting structured text, lists, code, tables, and visual fallbacks...', 'info');
    const allPageBlocks = [];
    let multiColPages = 0;
    let skippedEmptyPages = 0;
    let skippedSourceTocPages = 0;
    let hybridSnapshotPages = 0;
    let sourceTocActive = false;

    for (let i = 1; i <= totalPages; i++) {
        updateProgress(5 + (i / totalPages) * 60, `Parsing page ${i}/${totalPages}`, 'Reading text geometry and preserving book structure.');

        const page = await pdfDoc.getPage(i);
        const vp = page.getViewport({ scale: 1 });
        const tc = await page.getTextContent();
        let pageBlocks = [];

        if (tc.items && tc.items.length > 0) {
            const filtered = filterHeadersFooters(tc.items, analysis, vp.height);
            const columns = detectColumns(filtered, vp.width);
            if (columns.length > 1) multiColPages++;
            for (const colItems of columns) {
                pageBlocks.push(...extractBlocksFromColumn(colItems, analysis.bodyFontSize));
            }
            pageBlocks = attachPageNumber(pageBlocks, i);
        }

        let pageTextLen = pageBlocks.reduce((sum, block) => sum + (block.text || '').length, 0);

        if (splitMode !== 'page' && pageBlocks.length > 0 && isLikelySourceTocPage(pageBlocks, i, totalPages, sourceTocActive)) {
            sourceTocActive = true;
            skippedSourceTocPages++;
            continue;
        }
        if (sourceTocActive) sourceTocActive = false;

        if (pageTextLen < 30) {
            pageBlocks = [await createSnapshotBlock(page, i, imageAssets)];
            pageTextLen = 0;
            skippedEmptyPages++;
            hybridSnapshotPages++;
        } else if (await pageHasVisualContent(page, pageTextLen)) {
            pageBlocks.push(await createSnapshotBlock(page, i, imageAssets));
            hybridSnapshotPages++;
        }

        if (splitMode === 'page') {
            allPageBlocks.push([{
                type: 'page',
                text: '',
                _rawHtml: pageBlocks.map(renderBlock).join('\n'),
                _pageTitle: `Page ${i}`,
            }]);
        } else {
            allPageBlocks.push(pageBlocks);
        }
    }

    logMessage(`Extraction done: ${multiColPages} multi-column pages, ${skippedSourceTocPages} source ToC pages skipped, ${hybridSnapshotPages} visual snapshots added.`, 'success');
    if (skippedEmptyPages > 0) logMessage(`${skippedEmptyPages} sparse/scanned pages preserved as images.`, 'info');

    logMessage('Phase 3: Merging split paragraphs across page boundaries...', 'info');
    updateProgress(68, 'Restructuring...', 'Joining paragraphs split across pages.');

    let chapters;
    if (splitMode === 'page') {
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
        const totalTextLen = merged.reduce((sum, block) => block.type === 'image' ? sum : sum + (block.text || '').length, 0);

        if (totalTextLen < 200 && imageAssets.length === 0) {
            logMessage('Very little text extracted; switching to Fixed Image mode.', 'error');
            const dpi = parseInt(imageDpiSelect.value, 10);
            return await convertImageMode(title, author, dpi, coverStyle, totalPages);
        }

        logMessage(`Total extracted: ${merged.length} blocks, ~${Math.round(totalTextLen / 1000)}KB of text.`, 'info');
        logMessage('Phase 4: Building chapter structure...', 'info');
        updateProgress(72, 'Building chapters...', 'Organizing content into readable sections.');
        chapters = buildChapters(merged, splitMode);
    }

    logMessage(`Created ${chapters.length} chapter(s).`, 'success');

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
    font-size: 1.35em;
    font-weight: bold;
    margin: 1.4em 0 0.7em;
}
.list-block { margin: 0.4em 0 0.8em 1.6em; padding-left: 1.1em; }
.list-block li { margin: 0.2em 0; }
.code-block, .table-like {
    white-space: pre-wrap;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.9em;
    line-height: 1.35;
    background: #f4f4f5;
    border-left: 0.25em solid #c4b5fd;
    padding: 0.8em;
    overflow-wrap: anywhere;
}
.table-like { background: #fafafa; border-left-color: #93c5fd; }
.page-snapshot { margin: 1em 0; text-align: center; page-break-inside: avoid; }
.page-snapshot img { max-width: 100%; height: auto; }
.cover-wrapper { text-align: center; page-break-after: always; margin: 0; padding: 0; }
.cover-img { max-width: 100%; height: auto; max-height: 95vh; }`);

    let hasCover = false;
    if (coverStyle !== 'none') {
        updateProgress(85, 'Generating cover...', 'Creating cover image.');
        try {
            const coverBlob = await generateBookCoverBlob(coverStyle, title, author);
            if (coverBlob) {
                zip.file('OEBPS/images/cover.jpg', coverBlob);
                hasCover = true;
                logMessage('Cover image created.', 'success');
            }
        } catch (e) {
            logMessage(`Cover failed: ${e.message}. Skipping.`, 'info');
        }
    }

    for (const asset of imageAssets) {
        zip.file(`OEBPS/${asset.path}`, asset.blob);
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
    chapters.forEach(ch => { tocItems += `            <li><a href="${ch.id}.xhtml">${escapeHtml(ch.title)}</a></li>\n`; });

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
    imageAssets.forEach(asset => {
        manifest += `    <item id="${asset.id}" href="${asset.path}" media-type="image/jpeg"/>\n`;
    });
    spine += `    <itemref idref="toc"/>\n`;
    chapters.forEach(ch => {
        manifest += `    <item id="${ch.id}" href="${ch.id}.xhtml" media-type="application/xhtml+xml"/>\n`;
        spine += `    <itemref idref="${ch.id}"/>\n`;
    });

    zip.file('OEBPS/content.opf',
`<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookID" version="3.0" prefix="dcterms: http://purl.org/dc/terms/">
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
