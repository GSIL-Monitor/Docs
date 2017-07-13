/**
 * @overview
 * @author qingtong
 * @date 11/17/16
 */

const MemberService = require('services/member');

module.exports = function*() {
    this.body = yield Promise.resolve().then(() => {
        
        const memberService = new MemberService(this);

        return memberService.getCurrentInfo();
    });
};
