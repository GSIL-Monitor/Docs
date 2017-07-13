/**
 * 用户中心对外提供接口
 * @qingtong
 * 1/20/2017
 */

'use strict';

const UserService = require('model/userInfo');

module.exports = function*() {

	const form = this.request.body;
    const data = yield UserService(this, form);
    this.body = data;
};
