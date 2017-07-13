/**
 * @overview 页面及API路由规则
 * @author cisong
 * @date 3/1/16
 */

'use strict';

const path = require('path');
const glob = require('glob');

module.exports = function (app, Router) {
    const router = Router({
        prefix: '/app'
    });
    const controllersDir = path.join(__dirname, 'controllers');

    glob.sync('**/*.js', {
        cwd: controllersDir
    }).forEach(function (ctrPath) {
        ctrPath = ctrPath.replace(/([\/\\]?index)?\.js$/, '');
        const controller = require(path.join(controllersDir, ctrPath));

        let method = 'get';
        if (ctrPath.slice(0, 3) === 'api') {
            method = 'all';
        }

        router[method]('/' + ctrPath, controller);
    });

    app.use(router.routes());
};
