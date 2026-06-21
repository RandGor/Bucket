const fs = require('fs');

function escapeHtml(value) {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function createFilesPageRenderer(options) {
    const indexTemplate = fs.readFileSync(options.templatePath, 'utf8');

    return function renderFilesPage(files) {
        const rows = files.length === 0
            ? '<tr><td colspan="2">No files</td></tr>'
            : files.map(file => {
                const safeFileName = escapeHtml(file);
                const encodedFileName = encodeURIComponent(file);

                return `<tr><td>${safeFileName}</td><td><a href="./uploads/${encodedFileName}">Download</a></td></tr>`;
            }).join('');

        return indexTemplate
            .replace('{{uploadFieldName}}', options.uploadFieldName)
            .replace('{{fileRows}}', rows);
    };
}

module.exports = createFilesPageRenderer;
