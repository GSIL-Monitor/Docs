/**
 * @overview 错误页面路由
 * @author cisong
 * @date 9/29/16.
 */
'use strict';

module.exports = function*() {
    const data = {};
    const type = this.query.type || '';

    data.type = type;

    if (type === 'login') {
        data.error = '请登录后操作';
        data.referrer = this.get('referrer');
    } else {
        data.type = '';
    }

    data.INIT_DATA = JSON.stringify(data);

    yield this.render('error/index', data);
};
