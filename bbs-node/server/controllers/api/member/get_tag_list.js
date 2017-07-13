/**
 * @overview
 * @author 郎坤
 * @date 12/19/16
 */

const MemberService = require('services/member');

module.exports = function*() {
    this.body = yield Promise.resolve().then(() => {
        const memberService = new MemberService(this);

        return memberService.getTagList();
    });
};
