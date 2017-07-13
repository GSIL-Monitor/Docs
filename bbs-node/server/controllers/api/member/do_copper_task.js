/**
 * @overview
 * @author qingtong
 * @date 6/7/17
 */

const MemberService = require('services/member');

module.exports = function*() {
    this.body = yield Promise.resolve().then(() => {
        const memberService = new MemberService(this);
        const taskType = this.request.body.taskType;
        const deviceid = this.request.body.deviceid;

        return memberService.doCopperTask({deviceid, taskType});
    });
};
