/**
 * @overview
 * @author cisong
 * @date 3/22/16
 */

'use strict';

module.exports = function () {
    return function* heartbeat(next) {
        var path = this.path;
        var method = this.method;

        if (method === 'GET' &&
            path === '/check_backend_active.html') {
            return this.body = 'I am alive';
        }

        yield* next;
    }
};
