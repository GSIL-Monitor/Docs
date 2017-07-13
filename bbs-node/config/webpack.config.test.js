'use strict';

const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HashOutput = require('webpack-plugin-hash-output');
const os = require('os');

const entry = {};
const plugins = [];
const root = path.join(__dirname, '../');
const srcPath = path.join(root, 'app');
const buildPath = path.join(root, 'build');
const pkgJSON = require('../package.json');
const publicPath = `//test.wacdn.com/nbbs/${pkgJSON.name}/`;
const env = process.env.NODE_ENV || 'development';
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const homeDir = os.homedir();
const happyTempDir = path.join(homeDir, `.happypack/${pkgJSON.group}/${pkgJSON.name}`);

// 入口文件
glob.sync('{common,pages}/**/*.js', {
    cwd: srcPath
}).forEach((filePath) => {
    const chunk = filePath.slice(0, -3);
    entry[chunk] = [`./${chunk}`];
});

// 模版文件
glob.sync('**/*.html', {
    cwd: srcPath
}).forEach((filePath) => {
    const chunk = filePath.slice(0, -5);
    const chunkFile = `${chunk}.html`;

    if (chunk.match(/^pages\//) && entry[chunk]) {
        plugins.push(new HtmlWebpackPlugin({
            filename: chunkFile,
            template: chunkFile,
            chunks: [
                'common/index',
                chunk
            ]
        }));
    } else {
        plugins.push(new HtmlWebpackPlugin({
            inject: false,
            filename: chunkFile,
            template: chunkFile
        }));
    }
});

const config = {
    context: srcPath,
    entry: entry,
    devtool: 'source-map',
    output: {
        path: buildPath,
        publicPath: publicPath,
        filename: '[chunkhash].js',
        chunkFilename: '[chunkhash].js',
        hashDigestLength: 21
    },
    resolve: {
        extensions: ['.web.js', '.js', '.vue', '.less', '.css'],
        alias: {
            c: path.join(srcPath, 'components'),
            common: path.join(srcPath, 'common'),
            components: path.join(srcPath, 'components'),
            wux: path.resolve(root, 'node_modules/@wac/wux/src'),
            vue$: 'vue/dist/vue.esm.js'
        },
        modules: [
            srcPath,
            'components',
            'node_modules'
        ]
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                loaders: {}
                // other vue-loader options go here
            }
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'happypack/loader',
            options: {
                id: 'js'
            }
        }, {
            oneOf: [{
                test: /\.html$/,
                resourceQuery: /\?.*/,
                use: [
                    'nunjucks-loader',
                    'extract-loader',
                    'html-loader'
                ]
            }, {
                test: /\.html$/,
                loader: 'html-loader'
            }]
        }, {
            test: /\.tpl$/,
            loader: 'dot-tpl-loader'
        }, {
            oneOf: [{
                test: /\.(png|gif|jpg|jpeg|svg|woff|ttf|eot)$/,
                resourceQuery: /\?.*/,
                loader: 'url-loader'
            }, {
                test: /\.(png|gif|jpg|jpeg|svg|woff|ttf|eot)$/,
                loader: 'file-loader',
                options: {
                    name: '[hash:21].[ext]'
                }
            }]
        }, {
            test: /\.(less|css)$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'happypack/loader',
                    options: {
                        id: 'less'
                    }
                }]
            })
        }, {
            test: /wux.src.*?js$/,
            loader: 'babel-loader'
        }]
    },
    plugins: [
        new HappyPack({
            id: 'js',
            threadPool: happyThreadPool,
            tempDir: happyTempDir,
            loaders: ['babel-loader'],
            cache: false,
        }),
        new HappyPack({
            id: 'less',
            threadPool: happyThreadPool,
            tempDir: happyTempDir,
            loaders: [{
                loader: 'css-loader',
                options: {
                    minimize: true
                }
            }, {
                loader: 'postcss-loader'
            }, {
                loader: 'less-loader'
            }],
            cache: false,
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(env)
            }
        }),
        new ExtractTextPlugin({
            filename: '[contenthash:22].css',
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common/index',
            filename: '[chunkhash].js',
            minChunks: 4
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            output: {
                comments: false
            },
            compress: {
                warnings: false
            }
        }),
        new webpack.HashedModuleIdsPlugin(),
        new HashOutput()
    ].concat(plugins)
};

module.exports = config;
