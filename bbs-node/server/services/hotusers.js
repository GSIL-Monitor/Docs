/**
 * @overview 社区达人
 * @author longyun
 * @date 7/28/16
 */

'use strict';

const url = require('url');
const request = require('co-request');

function Service(ctx) {
    const state = ctx.state;

    this.api = state.api;
    this.request = state.request;
}

Object.setPrototypeOf(Service.prototype, {
    getHotUsers(page) {
        return this.request({
            url: this.api['hot_users/list'],
            form: { page }
        })
    }
});

module.exports = Service;