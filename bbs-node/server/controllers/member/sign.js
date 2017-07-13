/**
 * @overview
 * @author cisong
 * @date 4/15/16
 */

'use strict';

const url = require('url');
const util = require('lib/util');
const MemberService = require('../../services/member');

module.exports = function*() {
    const isQianTangApp = util.isQiantangApp(this);
    const isQianTang = util.isQiantang(this);
    const platform = util.getPlatform(this) || this.query.platform;
    const userAgent = this.headers['user-agent'] || 'unkown';
    const isWacai = util.isApp(platform)

    const deviceid = this.headers['x-deviceid'] || '';

    const data = yield Promise.resolve().then(() => {
        const memberService = new MemberService(this);
        return Promise.props({
            signInfo: memberService.getSignInfo().then(ret => {
                const data = ret.data;
                return data;
            }).catch(e => {
                this.log.error(e);
            }),

            userTaskList: memberService.getUserTaskList({deviceid}).then(ret => {
                const data = ret.data
                return data;
            }).catch(e => {
                this.log.error(e);
            })

        })
    }).then(ret => {
        const { signInfo,userTaskList = [] } = ret;
        ret.isQianTangApp = isQianTangApp;
        ret.isQianTang = isQianTang;
        ret.isWacai = isWacai;
        ret.platform = platform;
        ret.deviceid = deviceid;
        return ret;
    })

    yield this.render('sign/index', {data});
   
};

