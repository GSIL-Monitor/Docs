/**
 * @overview 帖子服务
 * @author cisong
 * @date 6/3/16
 */

'use strict';

const _ = require('lodash');
const moment = require('moment');

function Service(ctx) {
    const state = ctx.state;

    this.api = state.api;
    this.request = state.request;
}

Object.setPrototypeOf(Service.prototype, {
    // 获取板块详情
    getForumDetail(fid) {
        return this.request({
            url: this.api['forum/get_detail'],
            form: { fid }
        });
    }
});

module.exports = Service;
