/**
 * @overview
 * @author cisong
 * @date 4/18/16
 */

const MemberService = require('services/member');

module.exports = function*() {
    this.body = yield Promise.resolve().then(() => {
        const memberService = new MemberService(this);

        return memberService.doSign();
    });
};
