/**
 * @overview
 * @author cisong
 * @date 3/22/16
 */

'use strict';

const MessageService = require('services/message');
const util = require('lib/util');

module.exports = function*() {
    const targetUid = parseInt(this.query.targetUid);
    const isQianTangApp = util.isQiantangApp(this);
    const isBBSApp = util.isBBSApp(this);

    let isOfficialUser = false;
    let officialUser="2230550";//默认测试环境下堂妹的uid
    if(this.app.env == "staging"||this.app.env == "production"){
        officialUser="4821537";//线上环境堂妹的uid
    }
    if(targetUid == officialUser){
        isOfficialUser = true;
    }
    

    const data = yield Promise.resolve().then(() => {
        if (!targetUid) {
            return Promise.reject('不存在的会话');
        }

        const messageService = new MessageService(this);

        return messageService.queryMessage({targetUid});
    }).then((ret) => {
        const data = ret.data;
        const curretVersion = util.getVersion(this) || this.query.version;
        const platform = util.getPlatform(this);

        const isLowerQT = util.isQiantangApp(this) && util.versionCompare(curretVersion, '2.1.0') == -1;

        //const isSDK = util.isApp(platform) && !util.isApp(platform,'bbs');
        // 替换成bbsWaxVersion判断: 如果不存在bbsWaxVersion则一定为false
        const isQiantang = !!util.isQiantang(this);

        data.messages = data.messages.map((message) => {
            
            if(message.uid == officialUser){
                message.verify = true;
            }

            if(isLowerQT || !isQiantang ){
                if(message.message && message.message.includes('nt://')) {
                    const tempMsg = message.message.replace(/(<[^>]+>)/ig, '');
                    return Object.assign({}, message, {message: tempMsg})
                }
                return message;
            }
            return message;
        })

        const targetUser = data.users[targetUid] || {};

        data.initJson = JSON.stringify(data);

        data.pageTitle = targetUser.userName;
        data.isPublicUser = targetUser.publicUser;
        data.showOfficialUser = true;

        //用来SDK环境下堂妹反馈入口关闭
        if(!isBBSApp && isOfficialUser){
            data.showOfficialUser = false;
        }
        return data;
    });
    yield this.render('message/inbox/index', data);
};
