// const path = require('path');
const autoprefixer = require('autoprefixer');
// const px2rem = require('postcss-plugin-px2rem');

// function resolve (dir) {
//     return path.join(__dirname, dir);
// }

module.exports = {
    pages: {
        index: {
            entry: 'src/entries/main.js',
            // 模板来源
            template: 'public/index.html',
            filename: 'index.html',
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            title: 'fapiao'
        }
    },
    publicPath: process.env.NODE_ENV === 'production' ? '/fapiao' : '/',

    lintOnSave: 'error',
    productionSourceMap: false,

    css: {
        extract: false,
        requireModuleExtension: true,

        loaderOptions: {
            css: {
                modules: {
                    localIdentName: '[name]_[local]_[hash:base64:8]'
                },
                localsConvention: 'camelCase'
            },
            less: {
                javascriptEnabled: true
            },
            postcss: {
                plugins: [
                    autoprefixer({
                        remove: false
                    })// ,
                    // px2rem({
                    //     rootValue: 100,
                    //     unitPrecision: 5,
                    //     exclude: /(assets)|(views)|(element-ui)|(components)/, // /([^(views_mobile)])/,  // (Reg) a way to exclude some folder,eg. /(node_module)/.
                    //     propWhiteList: [],
                    //     propBlackList: [],
                    //     selectorBlackList: [],
                    //     ignoreIdentifier: false,
                    //     replace: true,
                    //     mediaQuery: false,
                    //     minPixelValue: 3
                    // })
                ]
            }
        }
    },
    chainWebpack: (config) => {
        config.plugins.delete('preload');
        config.plugins.delete('prefetch');
    }
};
