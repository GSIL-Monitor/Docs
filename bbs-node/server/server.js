/**
 * @overview bbs-node 服务端
 * @author cisong
 * @date 2/29/16
 */

'use strict';

require('app-module-path/register');

const Promise = require('bluebird');

Promise.config({
    warnings: false,
    longStackTraces: true
});

global.Promise = Promise;
require('babel-runtime/core-js/promise').default = Promise;

const path = require('path');
const fs = require('fs-extra');
const koa = require('koa');
const yaml = require('js-yaml');
const moment = require('moment');
const cluster = require('cluster');
const bodyParser = require('koa-bodyparser');
const nunjucks = require('koa-nunjucks-2');
const compressor = require('koa-compressor');
const Router = require('koa-router');
const convert = require('koa-convert')
const logger = require('@wac/koa-logger')
const helmet = require('koa-helmet')

const state = require('middlewares/state');
const heartbeat = require('middlewares/heartbeat');
const errorHandler = require('middlewares/error');
const xssFilter = require('middlewares/xss');

const appConfigPath = path.join(__dirname, '../config/app.yaml');
const appConfig = yaml.safeLoad(fs.readFileSync(appConfigPath));
const devPort = appConfig.server.devPort;

const app = koa();
const isDev = app.env === 'dev' || app.env === 'development';
const isProduction = app.env === 'staging' || app.env === 'production';
const port = isProduction ? appConfig.server.productionPort : appConfig.server.port;

app.name = 'bbs-node';

// catch app error
app.on('error', (err, ctx) => {
    ctx && ctx.log.error(err);
});

// internal heartbeat
app.use(heartbeat());

// xss防范
app.use(helmet.xssFilter())
app.use(xssFilter());
// logger
app.use(convert.back(logger(app)));

// body parser
app.use(bodyParser());

// nunjucks
app.context.render = nunjucks({
    ext: 'html',
    path: path.join(__dirname, './views/pages'),
    nunjucksConfig: {
        noCache: isDev,
        autoescape: true
    }
});

// initialize middlewares
app.use(errorHandler());
app.use(state(app.env, devPort));

// custom routes
require('./routes')(app, Router);

/* istanbul ignore if  */
if (require.main === module) {
    app.listen(port, () => {
        app.log.info(`server started at localhost: ${port}`);
    });
} else {
    module.exports = app
}