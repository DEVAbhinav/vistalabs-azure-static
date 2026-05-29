// Configure PDF.js Worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Application State
let appFile = null;
let pdfDoc = null;
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

// Click to browse
dropZone.addEventListener('click', () => {
    fileInput.click();
});

// Drag events
['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add('dragover');
    }, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('dragover');
    }, false);
});

// Handle drop
dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
        handleFileSelect(files[0]);
    }
});

// Handle file input change
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
    }
});

// Remove selected file
removeFileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    resetUploadStep();
});

// Mode toggle listener (adjust advanced settings visibility based on mode)
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

// Advanced settings toggle
toggleAdvancedBtn.addEventListener('click', () => {
    const isHidden = advancedSettings.classList.contains('hidden');
    if (isHidden) {
        advancedSettings.classList.remove('hidden');
        toggleAdvancedBtn.classList.add('active');
    } else {
        advancedSettings.classList.add('hidden');
        toggleAdvancedBtn.classList.remove('active');
    }
});

// Logs toggle
toggleLogsBtn.addEventListener('click', () => {
    const isHidden = logsConsole.classList.contains('hidden');
    if (isHidden) {
        logsConsole.classList.remove('hidden');
        toggleLogsBtn.innerHTML = 'Hide <i class="fa-solid fa-chevron-up"></i>';
    } else {
        logsConsole.classList.add('hidden');
        toggleLogsBtn.innerHTML = 'Show <i class="fa-solid fa-chevron-down"></i>';
    }
});

// Convert another book click
convertAnotherBtn.addEventListener('click', () => {
    resetUploadStep();
    showStep('upload');
});

// Form submission handler
configForm.addEventListener('submit', (e) => {
    e.preventDefault();
    startConversion();
});

// ─────────────────────────────────────────────────────────────────────────────
// Core Logic: File Handling & Reading
// ─────────────────────────────────────────────────────────────────────────────

async function handleFileSelect(file) {
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
        alert('Invalid file format. Please upload a PDF document.');
        return;
    }
    
    appFile = file;
    
    // Display file info
    fileNameText.textContent = file.name;
    fileSizeText.textContent = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    fileInfoCard.classList.remove('hidden');
    dropZone.classList.add('hidden');
    
    // Prefill Title from filename
    const cleanTitle = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
    bookTitleInput.value = cleanTitle;
    
    // Show configuration form
    configForm.classList.remove('hidden');
    
    // Attempt to extract PDF metadata
    try {
        const fileReader = new FileReader();
        fileReader.onload = async function() {
            const typedarray = new Uint8Array(this.result);
            try {
                const loadingTask = pdfjsLib.getDocument({ data: typedarray });
                pdfDoc = await loadingTask.promise;
                const meta = await pdfDoc.getMetadata();
                
                if (meta && meta.info) {
                    if (meta.info.Title && meta.info.Title.trim()) {
                        bookTitleInput.value = meta.info.Title.trim();
                    }
                    if (meta.info.Author && meta.info.Author.trim()) {
                        bookAuthorInput.value = meta.info.Author.trim();
                    }
                }
            } catch (err) {
                console.error("Error parsing PDF metadata:", err);
            }
        };
        fileReader.readAsArrayBuffer(file);
    } catch (e) {
        console.error("Error reading file:", e);
    }
}

function resetUploadStep() {
    appFile = null;
    pdfDoc = null;
    fileInput.value = '';
    fileInfoCard.classList.add('hidden');
    dropZone.classList.remove('hidden');
    configForm.classList.add('hidden');
    bookTitleInput.value = '';
    bookAuthorInput.value = '';
    advancedSettings.classList.add('hidden');
    toggleAdvancedBtn.classList.remove('active');
}

function showStep(stepName) {
    [stepUpload, stepProgress, stepSuccess].forEach(step => step.classList.remove('active'));
    
    if (stepName === 'upload') {
        stepUpload.classList.add('active');
    } else if (stepName === 'progress') {
        stepProgress.classList.add('active');
    } else if (stepName === 'success') {
        stepSuccess.classList.add('active');
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Logging & Progress Helpers
// ─────────────────────────────────────────────────────────────────────────────

function clearLogs() {
    conversionLogs = [];
    logsConsole.innerHTML = '';
}

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
    
    // Circle progress calculation (circumference is 2 * pi * r = 2 * 3.14159 * 52 = ~326.7)
    const strokeOffset = 326.7 - (percent / 100) * 326.7;
    progressCircle.style.strokeDashoffset = strokeOffset;
    
    if (title) progressStatusTitle.textContent = title;
    if (desc) progressStatusDesc.textContent = desc;
}

// ─────────────────────────────────────────────────────────────────────────────
// Conversion Pipeline Execution
// ─────────────────────────────────────────────────────────────────────────────

async function startConversion() {
    if (!appFile) return;
    
    showStep('progress');
    clearLogs();
    logMessage(`Starting conversion pipeline for file: ${appFile.name}`);
    updateProgress(0, 'Initializing PDF parser...', 'Loading document elements into browser memory.');
    
    const title = bookTitleInput.value.trim() || 'Untitled Book';
    const author = bookAuthorInput.value.trim() || 'Unknown Author';
    const mode = document.querySelector('input[name="conv-mode"]:checked').value;
    const splitMode = pageBreakModeSelect.value;
    const coverStyle = coverStyleSelect.value;
    const baseFontSize = baseFontSizeSelect.value;
    const dpi = parseInt(imageDpiSelect.value, 10);
    
    logMessage(`Settings: Title="${title}", Author="${author}", Mode="${mode}", Split="${splitMode}", Cover="${coverStyle}"`);
    
    try {
        const fileReader = new FileReader();
        
        fileReader.onload = async function() {
            try {
                const typedarray = new Uint8Array(this.result);
                logMessage('PDF array loaded successfully. Rendering document structure...');
                
                const loadingTask = pdfjsLib.getDocument({ data: typedarray });
                pdfDoc = await loadingTask.promise;
                
                const totalPages = pdfDoc.numPages;
                logMessage(`PDF loaded. Total Pages: ${totalPages}`, 'success');
                
                let epubBlob = null;
                if (mode === 'text') {
                    epubBlob = await convertTextMode(title, author, splitMode, coverStyle, baseFontSize, totalPages);
                } else {
                    epubBlob = await convertImageMode(title, author, dpi, coverStyle, totalPages);
                }
                
                if (epubBlob) {
                    finalizeSuccess(title, author, epubBlob, coverStyle);
                } else {
                    throw new Error('Failed to generate EPUB contents.');
                }
            } catch (err) {
                logMessage(`Conversion Error: ${err.message}`, 'error');
                updateProgress(100, 'Conversion Failed', err.message);
                alert(`An error occurred during conversion: ${err.message}`);
            }
        };
        
        fileReader.onerror = function() {
            logMessage('Error reading local file buffer.', 'error');
            throw new Error('Failed to read file from disk.');
        };
        
        fileReader.readAsArrayBuffer(appFile);
    } catch (err) {
        logMessage(`Conversion Pipeline Error: ${err.message}`, 'error');
        updateProgress(100, 'Conversion Failed', err.message);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Mode A: Reflowable Text Mode Converter
// ─────────────────────────────────────────────────────────────────────────────

async function convertTextMode(title, author, splitMode, coverStyle, baseFontSize, totalPages) {
    const zip = new JSZip();
    const chapters = [];
    let currentChapterTitle = 'Chapter 1';
    let currentChapterText = '';
    let chapterCount = 1;
    let totalTextLength = 0;
    
    logMessage('Executing Reflowable Text extraction...');
    
    for (let i = 1; i <= totalPages; i++) {
        updateProgress((i / totalPages) * 80, `Parsing page ${i} of ${totalPages}`, `Extracting text content from PDF structure.`);
        logMessage(`Extracting text nodes from Page ${i}...`, 'page');
        
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        
        // Skip empty pages
        if (!textContent.items || textContent.items.length === 0) {
            logMessage(`Page ${i} appears to have no text elements. Skipping.`, 'info');
            continue;
        }
        
        // Reconstruct layout blocks
        const blocks = reconstructPageTextBlocks(textContent.items);
        let pageHtml = '';
        
        for (const block of blocks) {
            const escapedText = escapeHtml(block.text);
            
            // Check if we need to split chapter by H1 or custom match
            if (splitMode !== 'none' && block.type === 'h1' && escapedText.length < 60) {
                // If we already have accumulated text, save current chapter
                if (currentChapterText.trim().length > 0) {
                    chapters.push({
                        id: `chapter_${chapterCount}`,
                        title: currentChapterTitle,
                        content: currentChapterText
                    });
                    logMessage(`Created chapter: "${currentChapterTitle}" (${currentChapterText.length} characters)`);
                    chapterCount++;
                    currentChapterText = '';
                }
                currentChapterTitle = escapedText;
                pageHtml += `<h1>${escapedText}</h1>\n`;
            } else if (block.type === 'h1') {
                pageHtml += `<h1>${escapedText}</h1>\n`;
            } else if (block.type === 'h2') {
                pageHtml += `<h2>${escapedText}</h2>\n`;
            } else {
                pageHtml += `<p>${escapedText}</p>\n`;
            }
        }
        
        currentChapterText += pageHtml;
        totalTextLength += pageHtml.length;
        
        // Force split if page split mode is active
        if (splitMode === 'page') {
            chapters.push({
                id: `chapter_${chapterCount}`,
                title: `Page ${i}`,
                content: pageHtml
            });
            chapterCount++;
            currentChapterText = '';
            currentChapterTitle = `Page ${i + 1}`;
        }
        
        // Soft split if document is huge and we have no h1 headers
        if (splitMode === 'auto' && currentChapterText.length > 25000) {
            chapters.push({
                id: `chapter_${chapterCount}`,
                title: currentChapterTitle,
                content: currentChapterText
            });
            logMessage(`Auto-split chapter at 25KB boundary: "${currentChapterTitle}"`);
            chapterCount++;
            currentChapterText = '';
            currentChapterTitle = `Chapter ${chapterCount}`;
        }
    }
    
    // Save final outstanding chapter
    if (currentChapterText.trim().length > 0 || chapters.length === 0) {
        chapters.push({
            id: `chapter_${chapterCount}`,
            title: currentChapterTitle,
            content: currentChapterText || '<p>Empty Chapter.</p>'
        });
        logMessage(`Created final chapter: "${currentChapterTitle}"`);
    }
    
    // Fallback detection: if we got almost no text, PDF is likely scanned
    if (totalTextLength < 200) {
        logMessage('WARNING: Extracted text is extremely short. This PDF might be scanned.', 'error');
        const proceed = confirm('Warning: We extracted almost no text from this PDF. It might be a scanned document (image-based).\n\nWould you like to switch to "Fixed Image Layout" mode for high-quality visual pages instead?');
        if (proceed) {
            logMessage('Switching to Image Mode based on user prompt.');
            const dpi = parseInt(imageDpiSelect.value, 10);
            return await convertImageMode(title, author, dpi, coverStyle, totalPages);
        }
    }
    
    // Assemble EPUB Structure
    updateProgress(85, 'Structuring EPUB container...', 'Creating package files and metadata.');
    
    // 1. mimetype (Must be uncompressed and first in the zip)
    zip.file('mimetype', 'application/epub+zip', { compression: "STORED" });
    
    // 2. META-INF/container.xml
    zip.file('META-INF/container.xml', 
`<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`);

    // 3. OEBPS/stylesheet.css
    zip.file('OEBPS/stylesheet.css', 
`body {
    font-family: var(--epub-font-sans, "Helvetica Neue", Helvetica, Arial, sans-serif);
    margin: 1.5em 1em;
    padding: 0;
    line-height: 1.5;
    font-size: ${baseFontSize};
    color: #111111;
    background-color: #ffffff;
}
p {
    text-indent: 1.5em;
    margin: 0 0 0.5em 0;
    text-align: justify;
}
h1 {
    font-size: 1.8em;
    font-weight: bold;
    text-align: center;
    margin-top: 1.5em;
    margin-bottom: 1em;
    page-break-before: always;
}
h2 {
    font-size: 1.4em;
    font-weight: bold;
    margin-top: 1.2em;
    margin-bottom: 0.8em;
}
.cover-wrapper {
    text-align: center;
    page-break-after: always;
    margin: 0;
    padding: 0;
}
.cover-img {
    max-width: 100%;
    height: auto;
    max-height: 95vh;
}`);

    // Generate Cover Image
    let hasCover = false;
    if (coverStyle !== 'none') {
        updateProgress(90, 'Generating cover image...', 'Creating custom graphic layout.');
        try {
            const coverBlob = await generateBookCoverBlob(coverStyle, title, author);
            if (coverBlob) {
                zip.file('OEBPS/images/cover.jpg', coverBlob);
                hasCover = true;
                logMessage('Cover image created successfully.', 'success');
            }
        } catch (coverErr) {
            logMessage(`Cover generation failed: ${coverErr.message}. Skipping cover.`, 'info');
        }
    }
    
    // Add Cover XHTML Page if we have a cover
    if (hasCover) {
        zip.file('OEBPS/cover.xhtml', 
`<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Cover</title>
    <link rel="stylesheet" type="text/css" href="stylesheet.css"/>
</head>
<body>
    <div class="cover-wrapper">
        <img class="cover-img" src="images/cover.jpg" alt="Cover Page"/>
    </div>
</body>
</html>`);
    }

    // Add Chapter XHTML Pages
    chapters.forEach(ch => {
        zip.file(`OEBPS/${ch.id}.xhtml`, 
`<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>${escapeHtml(ch.title)}</title>
    <link rel="stylesheet" type="text/css" href="stylesheet.css"/>
</head>
<body>
    ${ch.content}
</body>
</html>`);
    });

    // Create Navigation / Table of Contents (TOC) XHTML
    let tocListItems = '';
    chapters.forEach(ch => {
        tocListItems += `        <li><a href="${ch.id}.xhtml">${escapeHtml(ch.title)}</a></li>\n`;
    });
    
    zip.file('OEBPS/toc.xhtml', 
`<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
    <title>Table of Contents</title>
    <link rel="stylesheet" type="text/css" href="stylesheet.css"/>
</head>
<body>
    <nav epub:type="toc" id="toc">
        <h1>Table of Contents</h1>
        <ol>
            ${hasCover ? '<li><a href="cover.xhtml">Cover</a></li>' : ''}
            ${tocListItems}
        </ol>
    </nav>
</body>
</html>`);

    // Create content.opf (Open Packaging Format Manifest)
    const uuid = generateUUID();
    const currentDate = new Date().toISOString().replace(/\.\d+Z$/, "Z"); // Clean Zulu time format
    
    // Build manifest item lists
    let opfManifest = '';
    let opfSpine = '';
    
    if (hasCover) {
        opfManifest += `    <item id="cover-page" href="cover.xhtml" media-type="application/xhtml+xml"/>\n`;
        opfManifest += `    <item id="cover-image" href="images/cover.jpg" media-type="image/jpeg" properties="cover-image"/>\n`;
        opfSpine += `    <itemref idref="cover-page"/>\n`;
    }
    
    opfManifest += `    <item id="toc" href="toc.xhtml" media-type="application/xhtml+xml" properties="nav"/>\n`;
    opfManifest += `    <item id="style" href="stylesheet.css" media-type="text/css"/>\n`;
    opfSpine += `    <itemref idref="toc"/>\n`;
    
    chapters.forEach(ch => {
        opfManifest += `    <item id="${ch.id}" href="${ch.id}.xhtml" media-type="application/xhtml+xml"/>\n`;
        opfSpine += `    <itemref idref="${ch.id}"/>\n`;
    });
    
    const opfContent = 
`<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookID" version="3.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>${escapeHtml(title)}</dc:title>
    <dc:creator>${escapeHtml(author)}</dc:creator>
    <dc:language>en</dc:language>
    <dc:identifier id="BookID">urn:uuid:${uuid}</dc:identifier>
    <meta property="dcterms:modified">${currentDate}</meta>
  </metadata>
  <manifest>
${opfManifest}  </manifest>
  <spine>
${opfSpine}  </spine>
</package>`;

    zip.file('OEBPS/content.opf', opfContent);
    
    // Generate EPUB Blob
    updateProgress(95, 'Zipping files...', 'Building compressed ePUB package.');
    logMessage('Compiling files into EPUB ZIP container...');
    
    const blob = await zip.generateAsync({ type: 'blob', mimeType: 'application/epub+zip' });
    logMessage('EPUB file zip archive completed.', 'success');
    return blob;
}

// ─────────────────────────────────────────────────────────────────────────────
// Mode B: Fixed Image Mode Converter
// ─────────────────────────────────────────────────────────────────────────────

async function convertImageMode(title, author, dpi, coverStyle, totalPages) {
    const zip = new JSZip();
    logMessage(`Executing Fixed Image extraction at ${dpi} DPI (canvas rendering)...`);
    
    // Configure standard scale: PDF points to screen pixels is 72 points per inch.
    // scale = DPI / 72. 150 DPI = 2.08 scale.
    const scale = dpi / 72;
    
    // Setup Zip basic files
    zip.file('mimetype', 'application/epub+zip', { compression: "STORED" });
    zip.file('META-INF/container.xml', 
`<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`);

    zip.file('OEBPS/stylesheet.css', 
`@page {
    margin: 0;
    padding: 0;
}
body {
    margin: 0;
    padding: 0;
    background-color: #000000;
    text-align: center;
}
.page-wrapper {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}
.page-img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    width: auto;
    height: auto;
}`);

    // Generate Cover Image
    let hasCover = false;
    if (coverStyle !== 'none') {
        updateProgress(5, 'Generating cover image...', 'Creating custom graphic layout.');
        try {
            const coverBlob = await generateBookCoverBlob(coverStyle, title, author);
            if (coverBlob) {
                zip.file('OEBPS/images/cover.jpg', coverBlob);
                hasCover = true;
                logMessage('Cover image generated successfully.', 'success');
            }
        } catch (coverErr) {
            logMessage(`Cover generation failed: ${coverErr.message}. Skipping.`, 'info');
        }
    }
    
    // Loop over pages and render to canvases
    for (let i = 1; i <= totalPages; i++) {
        // Map progress from 10% to 90%
        const percent = 10 + (i / totalPages) * 80;
        updateProgress(percent, `Rendering page ${i} of ${totalPages}`, `Rasterizing layout graphics.`);
        logMessage(`Rasterizing page ${i} via canvas...`, 'page');
        
        try {
            const page = await pdfDoc.getPage(i);
            const viewport = page.getViewport({ scale: scale });
            
            // Setup offscreen canvas
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            
            // Render PDF page to canvas context
            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            await page.render(renderContext).promise;
            
            // Extract JPEG Blob from canvas (75% quality for compression/size balance)
            const imgBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.75));
            zip.file(`OEBPS/images/page_${i}.jpg`, imgBlob);
            
            // Create XHTML wrapper page for this image
            zip.file(`OEBPS/page_${i}.xhtml`, 
`<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Page ${i}</title>
    <link rel="stylesheet" type="text/css" href="stylesheet.css"/>
</head>
<body>
    <div class="page-wrapper">
        <img class="page-img" src="images/page_${i}.jpg" alt="Page ${i}"/>
    </div>
</body>
</html>`);
            
        } catch (renderErr) {
            logMessage(`Failed to render page ${i}: ${renderErr.message}. Skipping page.`, 'error');
        }
    }
    
    // Add Cover XHTML Page if we have a cover
    if (hasCover) {
        zip.file('OEBPS/cover.xhtml', 
`<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Cover</title>
    <link rel="stylesheet" type="text/css" href="stylesheet.css"/>
</head>
<body>
    <div class="page-wrapper">
        <img class="page-img" src="images/cover.jpg" alt="Cover Page"/>
    </div>
</body>
</html>`);
    }

    // Build Navigation / Table of Contents (TOC) XHTML
    let tocListItems = '';
    for (let i = 1; i <= totalPages; i++) {
        tocListItems += `        <li><a href="page_${i}.xhtml">Page ${i}</a></li>\n`;
    }
    
    zip.file('OEBPS/toc.xhtml', 
`<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
    <title>Table of Contents</title>
    <link rel="stylesheet" type="text/css" href="stylesheet.css"/>
</head>
<body>
    <nav epub:type="toc" id="toc">
        <h1>Table of Contents</h1>
        <ol>
            ${hasCover ? '<li><a href="cover.xhtml">Cover</a></li>' : ''}
            ${tocListItems}
        </ol>
    </nav>
</body>
</html>`);

    // Create content.opf Manifest file
    const uuid = generateUUID();
    const currentDate = new Date().toISOString().replace(/\.\d+Z$/, "Z");
    
    let opfManifest = '';
    let opfSpine = '';
    
    if (hasCover) {
        opfManifest += `    <item id="cover-page" href="cover.xhtml" media-type="application/xhtml+xml"/>\n`;
        opfManifest += `    <item id="cover-image" href="images/cover.jpg" media-type="image/jpeg" properties="cover-image"/>\n`;
        opfSpine += `    <itemref idref="cover-page"/>\n`;
    }
    
    opfManifest += `    <item id="toc" href="toc.xhtml" media-type="application/xhtml+xml" properties="nav"/>\n`;
    opfManifest += `    <item id="style" href="stylesheet.css" media-type="text/css"/>\n`;
    opfSpine += `    <itemref idref="toc"/>\n`;
    
    for (let i = 1; i <= totalPages; i++) {
        opfManifest += `    <item id="page_${i}" href="page_${i}.xhtml" media-type="application/xhtml+xml"/>\n`;
        opfManifest += `    <item id="img_${i}" href="images/page_${i}.jpg" media-type="image/jpeg"/>\n`;
        opfSpine += `    <itemref idref="page_${i}"/>\n`;
    }
    
    const opfContent = 
`<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookID" version="3.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>${escapeHtml(title)}</dc:title>
    <dc:creator>${escapeHtml(author)}</dc:creator>
    <dc:language>en</dc:language>
    <dc:identifier id="BookID">urn:uuid:${uuid}</dc:identifier>
    <meta property="dcterms:modified">${currentDate}</meta>
  </metadata>
  <manifest>
${opfManifest}  </manifest>
  <spine>
${opfSpine}  </spine>
</package>`;

    zip.file('OEBPS/content.opf', opfContent);
    
    // Compile EPUB Blob
    updateProgress(95, 'Zipping files...', 'Building compressed ePUB package.');
    logMessage('Compiling images into EPUB ZIP container...');
    
    const blob = await zip.generateAsync({ type: 'blob', mimeType: 'application/epub+zip' });
    logMessage('EPUB file zip archive completed.', 'success');
    return blob;
}

// ─────────────────────────────────────────────────────────────────────────────
// Algorithmic Helpers: Layout Reconstruction & Cover Art
// ─────────────────────────────────────────────────────────────────────────────

function reconstructPageTextBlocks(items) {
    // Sort items: primary by vertical position (Y descending), secondary by horizontal position (X ascending)
    const sortedItems = [...items].sort((a, b) => {
        const yA = a.transform[5];
        const yB = b.transform[5];
        if (Math.abs(yA - yB) < 5) { // Same line vertical tolerance
            return a.transform[4] - b.transform[4];
        }
        return yB - yA; // Sort top to bottom
    });

    let lines = [];
    let currentLine = [];
    let lastY = null;

    for (const item of sortedItems) {
        const y = item.transform[5];
        if (lastY === null || Math.abs(lastY - y) < 5) {
            currentLine.push(item);
        } else {
            lines.push(currentLine);
            currentLine = [item];
        }
        lastY = y;
    }
    if (currentLine.length > 0) {
        lines.push(currentLine);
    }

    // Merge lines into text blocks (paragraphs or headings)
    let blocks = [];
    let currentBlockLines = [];
    let lastLineY = null;
    let lastFontSize = null;

    for (const line of lines) {
        // Join items in a line
        const lineText = line.map(item => item.str).join("").trim();
        if (!lineText) continue;

        // Font size is represented by the scale factor in the transform matrix
        const fontSize = Math.abs(line[0].transform[0]);
        const y = line[0].transform[5];

        let isNewBlock = false;
        if (lastLineY !== null) {
            const yGap = Math.abs(lastLineY - y);
            // If font size shifts noticeably, or vertical spacing exceeds line height gap
            if (Math.abs(lastFontSize - fontSize) > 1.5 || yGap > fontSize * 2.2) {
                isNewBlock = true;
            }
        }

        if (isNewBlock) {
            if (currentBlockLines.length > 0) {
                blocks.push({
                    type: detectBlockType(currentBlockLines, lastFontSize),
                    text: currentBlockLines.join(" ")
                });
                currentBlockLines = [];
            }
        }

        currentBlockLines.push(lineText);
        lastLineY = y;
        lastFontSize = fontSize;
    }

    if (currentBlockLines.length > 0) {
        blocks.push({
            type: detectBlockType(currentBlockLines, lastFontSize),
            text: currentBlockLines.join(" ")
        });
    }

    return blocks;
}

function detectBlockType(blockLines, fontSize) {
    const fullText = blockLines.join(" ").trim();
    // Headings are short, typically large, and stand alone
    if (fullText.length < 120 && fontSize > 13.5) {
        if (fontSize > 17.5) return 'h1';
        return 'h2';
    }
    // Check if line looks like "Chapter X"
    if (fullText.length < 50 && /^(chapter|part|section|prologue|epilogue|act|scene)\b/i.test(fullText)) {
        return 'h1';
    }
    return 'p';
}

async function generateBookCoverBlob(style, title, author) {
    if (style === 'first-page' && pdfDoc) {
        logMessage('Rendering PDF first page as cover art...');
        try {
            const page = await pdfDoc.getPage(1);
            // Render at standard DPI (120 DPI) to make it high quality but compact cover image
            const scale = 120 / 72;
            const viewport = page.getViewport({ scale: scale });
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            
            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            await page.render(renderContext).promise;
            return new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.85));
        } catch (e) {
            logMessage(`PDF page render cover failed. Falling back to Typography Cover.`, 'info');
        }
    }
    
    // Default: Generate clean typography cover using HTML5 Canvas
    logMessage('Drawing typography design cover on canvas...');
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 840;
    const ctx = canvas.getContext('2d');
    
    // Draw background gradient (Indigo to Deep Slate)
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1e1b4b'); // Deep indigo
    gradient.addColorStop(0.5, '#0f172a'); // Slate 900
    gradient.addColorStop(1, '#020617'); // Blackish slate
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw decorative border lines
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)'; // Violet border
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)'; // Blue border
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
    
    // Draw Badge
    ctx.fillStyle = '#8b5cf6';
    ctx.beginPath();
    ctx.roundRect(canvas.width / 2 - 60, 80, 120, 24, 12);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('VISTA LABS EPUB', canvas.width / 2, 96);
    
    // Draw Book Title (Auto-wrapped)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const words = title.split(' ');
    let lines = [];
    let currentLine = '';
    const maxWidth = 480;
    
    for (let n = 0; n < words.length; n++) {
        let testLine = currentLine + words[n] + ' ';
        let metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
            lines.push(currentLine.trim());
            currentLine = words[n] + ' ';
        } else {
            currentLine = testLine;
        }
    }
    lines.push(currentLine.trim());
    
    let startY = 320 - ((lines.length - 1) * 24);
    for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], canvas.width / 2, startY + (i * 52));
    }
    
    // Draw Author Name
    ctx.fillStyle = '#a78bfa'; // Violet 300
    ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(author, canvas.width / 2, 580);
    
    // Draw Footer Brand
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.font = 'bold 14px Outfit, sans-serif';
    ctx.fillText('V I S T A  L A B S', canvas.width / 2, 750);
    
    return new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.85));
}

function finalizeSuccess(title, author, blob, coverStyle) {
    logMessage('Finalizing download link...', 'success');
    
    const fileUrl = URL.createObjectURL(blob);
    downloadLink.href = fileUrl;
    downloadLink.download = `${sanitizeFilename(title)}.epub`;
    
    successBookTitle.textContent = title;
    successBookAuthor.textContent = author ? `by ${author}` : '';
    successFileSize.textContent = (blob.size / (1024 * 1024)).toFixed(2) + ' MB';
    
    // Render preview cover to canvas in Step 3 Success UI
    drawCoverPreview(coverStyle, title, author);
    
    updateProgress(100, 'Done!', 'EPUB created successfully.');
    logMessage('All tasks completed. Ready for download.', 'success');
    
    // Add short delay before showing success screen
    setTimeout(() => {
        showStep('success');
    }, 600);
}

async function drawCoverPreview(style, title, author) {
    const ctx = epubCoverCanvas.getContext('2d');
    
    if (style === 'first-page' && pdfDoc) {
        try {
            const page = await pdfDoc.getPage(1);
            const scale = epubCoverCanvas.width / page.getViewport({ scale: 1 }).width;
            const viewport = page.getViewport({ scale: scale });
            
            const renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };
            await page.render(renderContext).promise;
            return;
        } catch (e) {
            console.error("Failed to render preview cover:", e);
        }
    }
    
    // Fallback: draw typography preview
    const gradient = ctx.createLinearGradient(0, 0, 0, epubCoverCanvas.height);
    gradient.addColorStop(0, '#1e1b4b');
    gradient.addColorStop(1, '#020617');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, epubCoverCanvas.width, epubCoverCanvas.height);
    
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, epubCoverCanvas.width - 20, epubCoverCanvas.height - 20);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Wrap Title for preview
    const words = title.split(' ');
    let lines = [];
    let currentLine = '';
    const maxWidth = epubCoverCanvas.width - 40;
    
    for (let n = 0; n < words.length; n++) {
        let testLine = currentLine + words[n] + ' ';
        let metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
            lines.push(currentLine.trim());
            currentLine = words[n] + ' ';
        } else {
            currentLine = testLine;
        }
    }
    lines.push(currentLine.trim());
    
    let startY = 160 - ((lines.length - 1) * 10);
    for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], epubCoverCanvas.width / 2, startY + (i * 24));
    }
    
    ctx.fillStyle = '#a78bfa';
    ctx.font = '500 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(author, epubCoverCanvas.width / 2, 280);
    
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.font = 'bold 8px Outfit, sans-serif';
    ctx.fillText('V I S T A  L A B S', epubCoverCanvas.width / 2, 380);
}

// ─────────────────────────────────────────────────────────────────────────────
// System Utilities
// ─────────────────────────────────────────────────────────────────────────────

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

function sanitizeFilename(name) {
    return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}
