/**
 * @overview
 * @author cisong
 * @date 3/22/16
 */

'use strict';

const MemberService = require('services/member');
const MessageService = require('services/message');

module.exports = function*() {
    let officialUser="2230550";//默认测试环境下堂妹的uid
    if(this.app.env == "staging"||this.app.env == "production"){
        officialUser="4821537";//线上环境堂妹的uid
    }
    const data = yield Promise.resolve().then(() => {
        const memberService = new MemberService(this);
        const messageService = new MessageService(this);

        return Promise.all([
            memberService.getCurrentInfo().then((ret) => {
                return {
                    user: ret.data
                };
            }),
            messageService.queryInbox().then((ret) => {
                ret.data.forEach((item)=>{
                    if (item.fromUid == officialUser) {
                        item.official = true;
                    }
                });
                return {
                    items: ret.data || []
                };
            }),
            messageService.countNotify().then((ret) => {
                const data = ret.data;

                Object.keys(data).forEach((k) => {
                    let v = data[k];

                    data[k] = String(v);

                    if (v > 99) {
                        data[k] = '99+';
                    }
                });

                return {
                    notify: data
                };
            })
        ])
    }).then((results) => {
        return Object.assign.apply(null, results);
    });

    yield this.render('message/index/index', data);
};

