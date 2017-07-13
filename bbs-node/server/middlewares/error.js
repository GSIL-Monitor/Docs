/**
 * @overview 异常处理
 * @author cisong
 * @date 3/29/16
 */

'use strict';

module.exports = function () {
    const methods = ['HEAD', 'GET', 'POST'];

    return function* errorHandler(next) {
        if (methods.indexOf(this.method) == -1) {
            return this.status = 405;
        }

        const isProd = ['staging', 'production'].indexOf(this.app.env) > -1;
        const isApi = this.path.match(/\/app\/api\//);

        try {
            yield* next;
        } catch (e) {
            const data = {};
            this.log.error(e);

            if (typeof e === 'string') {
                // 主动抛错
                data.error = e;
            } else if (e instanceof Error) {
                // 网络错误或JS异常
                data.icon = 'error';
                data.error = isProd ? '系统异常，请稍后再试' : e.stack;
            } else if (!e || e.code !== undefined || e.error) {
                // 后端接口抛错
                e = e || {};
                e.error = e.error || '接口异常';
                Object.assign(data, e);
            }

            // 异步接口异常
            if (isApi) {
                return this.body = Object.assign({
                    code: 1
                }, data);
            } else {
                // 未登录
                if (data.code == 4008 || data.code == 5004 || data.code == 5005) {
                    data.error = '请登录后操作';
                    data.icon = 'error';
                    data.type = 'login';
                }

                // 页面异常
                data.INIT_DATA = JSON.stringify(data);
                yield this.render('error/index', data);
            }
        }
    }
};
