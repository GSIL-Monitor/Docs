/**
 * @overview 小红包，获取用户剩余抽奖次数
 * @author qingtong
 * @date 10/16/16
 */

'use strict';

function Service(ctx) {
    const state = ctx.state;

    this.api = state.api;

    this.request = state.request;
    this.env = state.env;
}

Object.setPrototypeOf(Service.prototype, {
    // 剩余抽奖次数
    drawtimes(isApp) {
       return this.request({
            url: this.api['lottery/drawtimes'],
            form: { isApp }
        }).then((ret) => {
            return ret;
        });
    },

    // 中奖纪录
    records() {
       return this.request({
            url: this.api['lottery/records']
        }).then((ret) => {
            return ret;
        });
    },

    // 奖品列表
    prizes() {
       return this.request({
            url: this.api['lottery/prizes']
        }).then((ret) => {
            return ret;
        });
    },

    // 获取中奖结果
    draw(isApp) {
       return this.request({
            url: this.api['lottery/draw'],
            form: { isApp }
        }).then((ret) => {
            return ret;
        });
    },

    // 获取中奖结果
    share() {
       return this.request({
            url: this.api['lottery/share']
        }).then((ret) => {
            return ret;
        });
    },

    // 获取用户中奖纪录
    myRecord() {
        return this.request({
            url: this.api['lottery/myRecord']
        }).then((ret) => {
            return ret;
        });
    },

    // 获取用户中奖纪录
    activityStarted() {
        return this.request({
            url: this.api['lottery/activityStarted']
        }).then((ret) => {
            return ret;
        });
    },

    // 获取用户中奖纪录
    showEntrance() {
        return this.request({
            url: this.api['lottery/showEntrance']
        }).then((ret) => {
            return ret;
        });
    }
});

module.exports = Service;