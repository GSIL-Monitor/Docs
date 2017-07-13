/**
 * @overview
 * @author longyun
 * @date 8/3/16
 */

const MemberService = require('services/member');

module.exports = function*() {
    this.body = yield Promise.resolve().then(() => {
        const uid = this.request.body.uid;

        if (!uid) {
            return Promise.reject();
        }

        const memberService = new MemberService(this);

        return memberService.unFollow(uid);
    });
};
