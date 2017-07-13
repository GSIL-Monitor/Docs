/**
 * @overview
 * @author cisong
 * @date 5/12/16
 */

'use strict';

const MemberService = require('services/member');

module.exports = function*() {
    const data = yield Promise.resolve().then(() => {
        const memberService = new MemberService(this);

        return memberService.getCurrentInfo().then((ret) => {
            return ret.data;
        });
    });

    yield this.render('member/nickname/index', data);
};

