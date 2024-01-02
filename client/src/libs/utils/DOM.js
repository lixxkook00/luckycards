/**
 * @namespace DOMUtils
 */
const DOMUtils = {
    /**
     * Returns true, if the browser is Safari.
     */
    IsSafari() {
        return (
            navigator.userAgent &&
            navigator.userAgent.includes('Safari') &&
            !navigator.userAgent.includes('CriOS') &&
            !navigator.userAgent.includes('FxiOS')
        );
    },

    /**
     * If the browser is Safari, create a temporary anchor element, set its href to the url, click it, and remove it.
     * Otherwise, open the url in a new window.
     * @param {URL} url - The URL to open.
     */
    OpenURL(url) {
        if (this.IsSafari()) {
            let a = document.createElement('a');
            document.body.appendChild(a);
            a.href = url;
            a.click();
            document.body.removeChild(a);
        } else window.open(url, '_blank');
    },

    /**
     * Replaces all non-word characters followed by a word character with the capitalized one.
     * @param {string} string - The string to be camelCased.
     */
    CamelCase(string = '') {
        return string.replace(/\W+\w/g, (match) => match.slice(-1).toUpperCase());
    },

    /**
     * Takes a string of CSS and returns an object with the selector and style properties
     * @param {string} string - The CSS string to parse.
     */
    CSSParse(string = '') {
        const cssText = string.replace(/\/\*(.|\s)*?\*\//g, ' ').replace(/\s+/g, ' ');

        const style = {},
            [, selector, rule] = cssText.match(/ ?(.*?) ?{([^}]*)}/) || [, , cssText];

        const properties = rule.split(';').map((o) => o.split(':').map((x) => x && x.trim()));
        for (let [prop, val] of properties) style[this.toCamelCase(prop)] = val;

        return { selector, style };
    },

    /**
     * Takes an object and returns a CSS text.
     * @param {object} style - The style object that you want to convert to a string.
     */
    CSSStringify(style = {}) {
        return Object.keys(style).reduce(
            (prop, key) =>
                `${prop}${key
                    .split(/(?=[A-Z])/)
                    .join('-')
                    .toLowerCase()}:${style[key]};`,
            ''
        );
    },
};

export default DOMUtils;
