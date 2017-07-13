/**
 * @overview
 * @author cisong
 * @date 3/22/16
 */

'use strict';

const api = require('lib/api');
const request = require('lib/request');

module.exports = function(env, port) {
    return function* state(next) {

        var state = this.state;

        state.api = api(env, port);
        state.request = request(this);
        state.env = env;
        yield * next;
    }
};