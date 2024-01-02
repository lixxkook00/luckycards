const webpack = require('webpack');
const { merge } = require('webpack-merge');
const base = require('./webpack.base');
const ENV = require('./webpack.env');

function development(env) {
    const platform = env.platform || 'aa';

    return merge(base, {
        mode: 'development',

        devServer: {
            static: { directory: ENV.distPath },
            open: true,
            compress: true,
            hot: true,
            liveReload: true,
            port: env.port || ENV.port[platform],
        },

        plugins: [
            new webpack.EnvironmentPlugin({ platform }),
            ENV.copyPlugin(platform),
            ENV.htmlEntryPlugin(platform),
            ENV.htmlInjectPlugin(platform),
        ],
    });
}

module.exports = development;
