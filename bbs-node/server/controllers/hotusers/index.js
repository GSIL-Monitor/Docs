/**
 * @overview 推荐页
 * @author longyun
 * @date 7/21/16
 */
'use strict';

var HotUsersService = require('services/hotusers');

module.exports = function*() {

    const data = yield Promise.resolve().then(() => {

        const hotUsersService = new HotUsersService(this);
        return hotUsersService.getHotUsers(1);
    }).then((ret) => {
        const uids = ret.data.map(function(user) {
            return user.uid;
        })
        return { users: ret.data, INIT_STATE: {uids:uids} }
    });

    yield this.render('hot-user/index', data);
};