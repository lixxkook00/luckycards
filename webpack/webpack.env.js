const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInjectPlugin = require('html-webpack-inject-plugin').default;
const ReplacePlugin = require('replace-in-file-webpack-plugin');

const clientPath = path.resolve(__dirname, '../client');
const distPath = path.resolve(__dirname, '../dist');
const htmlFile = 'index.html';
const port = { aa: 8080, studio: 8008, ga: 3000 };
const studioTag = { 'ad.size': 'width=0, height=0' };
const GA_ID = 'G-XXXXXXXXX';

const eventScript = {
    aa: [
        { tagName: 'script', attributes: { src: 'https://ads.superawesome.tv/v2/events.js', type: 'text/javascript' } },
    ],

    studio: [
        { tagName: 'script', attributes: { src: 'http://s0.2mdn.net/ads/studio/Enabler.js', type: 'text/javascript' } },
    ],

    ga: [
        {
            tagName: 'script',
            attributes: {
                src: `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`,
                type: 'text/javascript',
                async: true,
            },
        },
        {
            tagName: 'script',
            innerHTML: `window.dataLayer = window.dataLayer || []; function gtag() {window.dataLayer.push(arguments);} gtag("js", new Date()); gtag("config", "${GA_ID}");`,
        },
    ],
};

const copyPlugin = (platform) => {
    const staticPath = platform === 'studio' ? '' : 'static';

    return new CopyWebpackPlugin({
        patterns: [
            {
                from: path.resolve(clientPath, 'static'),
                to: path.resolve(distPath, staticPath),
            },
        ],
    });
};

const htmlEntryPlugin = (platform) => {
    const options = {
        inject: true,
        filename: htmlFile,
        template: path.resolve(clientPath, htmlFile),
    };

    if (platform === 'studio') options.meta = studioTag;
    return new HtmlWebpackPlugin(options);
};

const htmlInjectPlugin = (platform) => {
    return new HtmlWebpackInjectPlugin({ externals: eventScript[platform], parent: 'head', prepend: true });
};

const replacePlugin = (platform) => {
    const rules = {
        aa: [{ search: /\http:/g, replace: 'https:' }],
        studio: [{ search: /\localStorage/g, replace: 'locStg' }],
        ga: null,
    };

    return rules[platform]
        ? new ReplacePlugin([
              {
                  dir: path.resolve(__dirname, '../dist/'),
                  test: /\.(js|txt|LICENSE|html)$/i,
                  rules: rules[platform],
              },
          ])
        : null;
};

module.exports = { clientPath, distPath, port, copyPlugin, htmlEntryPlugin, htmlInjectPlugin, replacePlugin };
