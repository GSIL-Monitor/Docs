/**
 * @overview 关注+粉丝
 * @author qingtong
 * @date 3/10/17
 */

'use strict';

const url = require('url');
const request = require('co-request');

function Service(ctx) {
    const state = ctx.state;
    this.headers = ctx.headers;
    this.api = state.api;
    this.request = state.request;
    this.env = state.env;
}


Object.setPrototypeOf(Service.prototype, {
    getFollower(query) {
        return this.request({
            url: this.api["follow/follower"],
            form: query
        })
    },

    getFans(query) {
        return this.request({
            url: this.api["follow/fans"],
            form: query
        })
    }
});

module.exports = Service;