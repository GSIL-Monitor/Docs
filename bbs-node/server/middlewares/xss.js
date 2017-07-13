/**
 * xss防范
 * @author qingtong
 * @date 4/24/17
 */

'use strict';

const fs = require('fs');

module.exports = function () {
    return function* (next) {
        this.url = decodeURIComponent(this.url)
        .replace(/</g, '&lt;')
  		.replace(/>/g, '&gt;')

        yield* next;
    }
};
