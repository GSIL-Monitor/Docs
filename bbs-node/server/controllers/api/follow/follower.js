/**
 * @overview 推荐页
 * @author longyun
 * @date 7/21/16
 */
'use strict';

const FollowService = require('services/follow');

module.exports = function*() {
    this.body = yield Promise.resolve().then(() => {
         const form = this.request.body;

        const followService = new FollowService(this);
        return followService.getFollower(form);
    });
};