/**
 * @overview 用户中心数据接口
 * @author qingtong
 * @date 1/20/17
 */

'use strict';

function Service(ctx) {
    const state = ctx.state;
    this.headers = ctx.headers;
    this.api = state.api;
    this.request = state.request;
    this.env = state.env;
}

Object.setPrototypeOf(Service.prototype, {
    getUserProfile(uids) {
        return this.request({
            url: this.api['uc/get_batch_profile'],
            timeout: 500,
            form: uids
        }).then((ret) => {
            return ret;
        });
    }
});

module.exports = Service;
