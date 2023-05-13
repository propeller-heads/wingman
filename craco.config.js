const { addBeforeLoader, loaderByName } = require("@craco/craco");

module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            const wasmExtensionRegExp = /\.wasm$/;

            webpackConfig.module.rules.forEach((rule) => {
                (rule.oneOf || []).forEach((oneOf) => {
                    if (oneOf.loader && oneOf.loader.indexOf("file-loader") >= 0) {
                        oneOf.exclude.push(wasmExtensionRegExp);
                    }
                });
            });

            const wasmLoader = {
                test: wasmExtensionRegExp,
                exclude: /node_modules/,
                loaders: [
                    {
                        loader: "wasm-loader",
                    },
                ],
            };

            addBeforeLoader(webpackConfig, loaderByName("file-loader"), wasmLoader);
            return webpackConfig;
        },
    },
    babel: {
        plugins: [
            "@babel/plugin-proposal-numeric-separator",
            "@babel/plugin-proposal-optional-chaining",
            "@babel/plugin-proposal-nullish-coalescing-operator"
        ]
    }
};