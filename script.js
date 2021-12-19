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

    const content = document.querySelector('[name="site-content"]').value;
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
