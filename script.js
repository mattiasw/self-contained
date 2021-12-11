import {minify} from 'html-minifier-terser/dist/htmlminifier.esm.bundle.js';

document.querySelector('form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const html = document.querySelector('[name="site-content"]').value;
    const minifiedHtml = await minify(html, {
        minifyCSS: true,
        minifyJS: true,
        removeAttributeQuotes: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
    });
    const dataUri = 'data:text/html;charset=utf-8;base64,' + btoa(minifiedHtml);

    const output = document.querySelector('[name="data-uri"]');
    output.value = encodeURI(dataUri);
    output.focus();
    selectOutput();

    document.querySelector('.copy-button').disabled = false;

    updateSize(output.value.length);
});

document.querySelector('.copy-button').addEventListener('click', function (event) {
    event.preventDefault();
    selectOutput();
    document.execCommand('copy');
    this.focus();
});

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
