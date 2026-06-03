(function loadSharedPdfToEpubConverter() {
    const script = document.createElement('script');
    script.src = '../../pdf-to-epub/app.js';
    const current = document.currentScript;
    if (current && current.parentNode) {
        current.parentNode.insertBefore(script, current.nextSibling);
    } else {
        document.body.appendChild(script);
    }
})();
