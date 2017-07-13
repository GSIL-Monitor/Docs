/**
 * @overview
 * @author qingtong
 * @date 6/12/17
 */

const MemberService = require('services/member');

module.exports = function*() {
    this.body = yield Promise.resolve().then(() => {
        const memberService = new MemberService(this);

        return memberService.getSignInfo();
    });
};