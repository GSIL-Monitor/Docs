/**
 * @overview
 * @author cisong
 * @date 5/12/16
 */

'use strict';

const MemberService = require('services/member');

module.exports = function*() {
    yield this.render('ranking/index');
};