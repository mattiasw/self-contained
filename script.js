(function () {
    const htmlMinifier = window.require('html-minifier');

    const form = document.querySelector('form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const html = document.querySelector('[name="site-content"]').value;
        const minifiedHtml = htmlMinifier.minify(html, {
            collapseWhitespace: true,
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
        output.classList.add('active');
        output.focus();
        selectOutput();

        document.querySelector('.copy-button').classList.add('active');
    });

    const copyButton = document.querySelector('.copy-button');
    copyButton.addEventListener('click', function (event) {
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
}());
