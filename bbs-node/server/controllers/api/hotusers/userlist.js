/**
 * @overview 推荐页
 * @author longyun
 * @date 7/21/16
 */
'use strict';

var HotUsersService = require('services/hotusers');

module.exports = function*() {
    this.body = yield Promise.resolve().then(() => {
        const query = this.query;

        const hotUsersService = new HotUsersService(this);
        return hotUsersService.getHotUsers(query.page);
    });
};