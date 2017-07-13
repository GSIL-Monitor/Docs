/**
 * @overview
 * @author cisong
 * @date 3/22/16
 */

'use strict';

const MemberService = require('services/member');
const util = require('lib/util');

module.exports = function*() {
    const userAgent = this.headers['user-agent'] || 'unkown';
    let badAndroid = false;
    const agent = userAgent.match(/Android\s(\w.+?);/i);
    if(agent){
        if(util.versionCompare(agent[1], '4.4.4') == -1){
            badAndroid = true;
        }
    }

    const data = yield Promise.resolve().then(() => {
        const memberService = new MemberService(this);

        return memberService.getMoreInfo();
    }).then((ret) => {
        const data = ret.data;
        const msgCount = data.msgCount || 0;

        data.msgCount = String(msgCount);

        if (msgCount > 99) {
            data.msgCount = '99+';
        }

        data.hideH5Bar = +badAndroid;

        return data;
    }).catch(e => e);

    yield this.render('member/more/index', data);
};

