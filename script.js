document.querySelector('[name="show-import"]').addEventListener('click', showImport);
document.querySelector('[name="import-button"]').addEventListener('click', importPrevious);
document.querySelector('form').addEventListener('submit', generate);
document.querySelector('.copy-button').addEventListener('click', copyDataURI);

generate();

function showImport() {
    document.querySelector('.import-container--collapsed').classList.remove('import-container--collapsed');
}

function importPrevious() {
    const importField = document.querySelector('[name="import"]');
    const dataURI = importField.value;
    const base64Html = dataURI.replace(/^data:text\/html;[^,]*base64,/, '');
    document.querySelector('[name="site-content"]').value = atob(base64Html);
    generate();
    importField.value = '';
}

async function generate(event) {
    event?.preventDefault();

    const content = addWatermark(document.querySelector('[name="site-content"]').value);
    const shouldMinify = document.querySelector('[name="minify"]').checked;
    const html = shouldMinify ? await minify(content) : content;
    const dataURI = 'data:text/html;charset=utf-8;base64,' + btoa(html);
    const encodedUri = encodeURI(dataURI);

    const output = document.querySelector('[name="data-uri"]');
    output.value = encodedUri;
    if (event) {
        output.focus();
        selectOutput();
    }

    document.querySelector('.copy-button').disabled = false;

    const preview = document.querySelector('.preview');
    preview.src = encodedUri;

    updateSize(output.value.length);
}

function addWatermark(content) {
    const htmlPattern = /<\/html>[\n\r\s]*$/;
    if (htmlPattern.test(content)) {
        const wrapperStyles = [
            'background: rgba(20, 90, 180, .35);',
            'bottom: 0;',
            'display: block;',
            'font-size: .8rem;',
            'left: 0;',
            'opacity: .5;',
            'padding: 4px 8px;',
            'position: fixed;',
        ].join('');
        return content.replace(
            htmlPattern,
            `<a href="https://mattiasw.github.io/self-contained/" target="_blank" style="${wrapperStyles}">Created with Web page data URI generator.</a></html>`,
        );
    }
    return content;
}

async function minify(content) {
    const HtmlMinifier = await import('html-minifier-terser/dist/htmlminifier.cjs');

    return HtmlMinifier.minify(content, {
        minifyCSS: true,
        minifyJS: true,
        removeAttributeQuotes: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
    });
}


function selectOutput() {
    const output = document.querySelector('[name="data-uri"]');
    output.select();
    setTimeout(function () {
        output.scrollTop = 0;
    }, 10);
}

function updateSize(length) {
    const size = document.querySelector('.size');
    if (length < 1024) {
        size.textContent = `${length} byte${length === 1 ? '' : 's'}`;
    } else if (length < 1024 * 1024) {
        size.textContent = `${(length / 1024).toFixed(1)} KiB`;
    } else {
        size.textContent = `${(length / 1024 / 1024).toFixed(1)} MiB`;
    }
}

function copyDataURI(event) {
    event.preventDefault();
    selectOutput();
    document.execCommand('copy');
    this.focus();
}
