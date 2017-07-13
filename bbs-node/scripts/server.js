'use strict';

const path = require('path');
const fs = require('fs-extra');
const ip = require('dev-ip');
const yaml = require('js-yaml');
const Promise = require('bluebird');
const webpack = require('webpack');
const bodyParser = require('body-parser');
const WebpackDevServer = require('webpack-dev-server');

Promise.promisifyAll(fs);

let env = process.env.NODE_ENV || 'development';

if (env === 'dev') {
    env = 'development'
}


const devIp = ip()[0];
const root = path.join(__dirname, '..');
const configPath = path.join(root, `config/webpack.config.${env}`);
const appConfigPath = path.join(root, 'config/app.yaml');

const config = require(configPath);
const appConfig = yaml.safeLoad(fs.readFileSync(appConfigPath));

const entry = config.entry;
const devPort = appConfig.server.devPort;
const devClient = [`webpack-dev-server/client?http://${devIp}:${devPort}/`];
const publicPath = config.output.publicPath = `http://${devIp}:${devPort}/build/`;

Object.keys(entry).forEach((entryName) => {
    entry[entryName] = devClient.concat(entry[entryName]);
});

const compiler = webpack(config);
const server = new WebpackDevServer(compiler, {
    quiet: true,
    noInfo: true,
    disableHostCheck:true,
    compress: true,
    publicPath: publicPath,
    watchOptions: {
        aggregateTimeout: 50
    },
    proxy: {
        '/build': {
            target: `http://${devIp}:${devPort}/`,
            rewrite: (req) => {
                req.url = '/webpack-dev-server';
            }
        }
    }
});

compiler.plugin('compile', () => {
    console.log('webpack building...');
});
compiler.plugin('done', (stats) => {
    const time = (stats.endTime - stats.startTime) / 1000;

    if (stats.hasErrors()) {
        console.log('webpack build error');

        return console.log(stats.toString({
            colors: true,
            timings: false,
            hash: false,
            version: false,
            assets: false,
            reasons: false,
            chunks: false,
            children: false,
            chunkModules: false,
            modules: false
        }));
    }

    const outputPath = config.output.path;
    const assets = stats.compilation.assets;

    Promise.map(Object.keys(assets), (file) => {
        const asset = assets[file];
        const filePath = path.relative(outputPath, asset.existsAt);

        if (path.extname(filePath) === '.html') {
            const content = asset.source();
            const distPath = path.join(root, 'server/views', filePath);

            return fs.outputFileAsync(distPath, content);
        }
    }).then(() => {
        console.log(`webpack build success in ${time.toFixed(2)} s`);
    });
});

const app = server.app;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.all('/mock/*', (req, res) => {
    let ret;
    const mockPath = path.join(root, `${req.path}.js`);

    try {
        delete require.cache[mockPath];
        ret = require(mockPath);
    } catch (e) {
        return res.status(404).send({
            code: 1,
            error: e.message
        });
    }

    if (typeof ret === 'function') {
        ret = ret(req);
    }

    if (ret.$$header) {
        Object.keys(ret.$$header).forEach((key) => {
            res.setHeader(key, ret.$$header[key]);
        });
    }

    const delay = ret.$$delay || 0;

    delete ret.$$header;
    delete ret.$$delay;

    setTimeout(() => {
        if (req.query.callback) {
            res.jsonp(ret);
        } else {
            res.send(ret);
        }
    }, delay);
});

server.listen(devPort, () => {
    console.log(`webpack-dev-server started at localhost:${devPort}`);
    console.log('webpack building...');
});