/**
 * @overview
 * @author cisong
 * @date 5/13/16
 */

const MemberService = require('services/member');

function validate(val) {
    const chineseReg = /[\u4e00-\u9fa5]/;
    const mustContainReg = /[\u4e00-\u9fa5a-zA-Z]/;
    const nickNameReg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;

    // 中文, 英文字母, 数字, _
    if (!nickNameReg.test(val)) {
        return '仅支持汉字、英文、数字及“_”';
    }

    // 需含英文或汉字
    if (!mustContainReg.test(val)) {
        return '需含英文或汉字';
    }

    // 总字符数 [4-20], 中文算两个字符
    const len = val.split('').reduce((a, b) => {
        return a + (chineseReg.test(b) ? 2 : 1);
    }, 0);

    if (len < 4 || len > 20) {
        return '昵称需 4-20 字符，汉字占两个字符';
    }

    return true;
}

module.exports = function*() {
    this.body = yield Promise.resolve().then(() => {
        const newName = this.request.body.newName;
        const ret = validate(newName);

        if (ret !== true) {
            return {
                code: 1,
                error: ret
            };
        }

        const memberService = new MemberService(this);

        return memberService.saveName({newName});
    });
};
