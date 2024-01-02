const webpack = require('webpack');
const { merge } = require('webpack-merge');
const base = require('./webpack.base');
const ENV = require('./webpack.env');

function production(env) {
    const platform = env.platform || 'aa';
    const plugins = [
        new webpack.EnvironmentPlugin({ platform }),
        ENV.copyPlugin(platform),
        ENV.htmlEntryPlugin(platform),
        ENV.htmlInjectPlugin(platform),
    ];

    if (platform === 'aa' || platform === 'studio') plugins.push(ENV.replacePlugin(platform));
    return merge(base, { mode: 'production', devtool: false, plugins });
}

module.exports = production;
