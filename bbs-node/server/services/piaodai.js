/**
 * @overview 飘带入口
 * @author qingtong
 * @date 7/6/17
 */

'use strict';

function Service(ctx) {
    const state = ctx.state;

    this.api = state.api;

    this.request = state.request;
    this.env = state.env;
}

Object.setPrototypeOf(Service.prototype, {
    // 获取用户中奖纪录
    showEntrance(form) {
        return this.request({
            url: this.api['piaodai/get_active'],
            form
        }).then((ret) => {
            return ret;
        });
    }
});

module.exports = Service;