'use strict';

const path = require('path');
const url = require('url');
const fs = require('fs-extra');
const glob = require('glob');
const execa = require('execa');
const webpack = require('webpack');
const Promise = require('bluebird');
const deploy = require('@wac/static-deploy');

Promise.promisifyAll(fs);

console.log('start compiling...');

const startTime = Date.now();
let env = process.env.NODE_ENV || 'development';

if (env === 'staging') {
    env = 'test';
}

console.log(`using ${env} config`);

const root = path.join(__dirname, '..');
const processPath = path.join(root, 'process.json');
const viewsPath = path.join(root, 'server/views');
const configPath = path.join(root, `config/webpack.config.${env}`);

const config = require(configPath);
const processJson = require(processPath);

const buildPath = config.output.path;
const publicPath = config.output.publicPath;
const pkgName = process.env.npm_package_name;

Promise.resolve()
    .then(() => {
        console.log('clean views and build path');

        // 清理 views && output.path
        return Promise.all([
            fs.removeAsync(viewsPath),
            fs.removeAsync(buildPath)
        ]);
    })
    .then(() => {
        console.log('update process.json');

        // 更新 process.json
        processJson.apps.forEach((app) => {
            if (app.name.indexOf(pkgName) !== 0) {
                app.name = `${pkgName}-${app.name}`;
            }
        });

        return fs.writeJsonAsync(processPath, processJson);
    })
    .then(() => {
        console.log('webpack building...');

        // webpack 编译
        return new Promise((resolve, reject) => {
            webpack(config, (err, stats) => {
                if (err || stats.hasErrors()) {
                    console.log(stats.toString({
                        colors: true,
                        timings: true,
                        hash: true,
                        version: true,
                        errorDetails: true,
                        assets: false,
                        chunks: false,
                        children: false,
                        modules: false,
                        chunkModules: false
                    }));

                    return reject(err);
                }

                const time = (stats.endTime - stats.startTime) / 1000;

                console.log(`webpack build success in ${time.toFixed(2)} s`);

                resolve();
            });
        });
    })
    .then(() => {
        console.log('move views template');

        // 移动模版文件
        const templates = glob.sync('**/*.html', {
            cwd: buildPath
        });

        return Promise.map(templates, (template) => {
            const srcPath = path.join(buildPath, template);
            const distPath = path.join(viewsPath, template);

            return fs.moveAsync(srcPath, distPath, {
                clobber: true
            });
        });
    })
    .then(() => {
        // 非测试及生成环境
        if (['test', 'production'].indexOf(env) === -1) {
            return Promise.resolve();
        }

        console.log('publishing static assets...');

        // 发布静态资源
        const parsedUrl = url.parse(publicPath, true, true);
        const assetsPath = parsedUrl.pathname;

        return deploy({
            env: env,
            cwd: buildPath,
            imagemin: true,
            path: assetsPath
        }).then((ret) => {
            if (ret.code !== 0) {
                return Promise.reject(ret.error);
            }

            console.log('publish success');
            console.log(JSON.stringify(ret, null, 4));
        });
    })
    .then(() => {
        const time = (Date.now() - startTime) / 1000;
        console.log(`compile success in ${time.toFixed(2)} s`);
    })
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });
