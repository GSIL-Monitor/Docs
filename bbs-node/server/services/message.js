/**
 * @overview 消息服务
 * @author cisong
 * @date 3/25/16
 */

'use strict';

const url = require('url');

function Service(ctx) {
    const state = ctx.state;

    this.env = state.env;
    this.api = state.api;
    this.request = state.request;
}

Object.setPrototypeOf(Service.prototype, {
    // 获取消息提醒数量
    countNotify() {
        return this.request({
            url: this.api['message/count_notify']
        });
    },

    // 查询私信列表
    queryInbox(options) {
        const form = Object.assign({
            pageNo: 1,
            pageSize: 15
        }, options);

        return this.request({
            url: this.api['message/query_inbox'],
            form: form
        }).then((ret) => {
            const data = ret.data || [];

            data.forEach((item) => {
                const imgUrl = item.fromUserHead || '';

                if (imgUrl) {
                    item.fromUserHead = imgUrl;
                }
            });

            return ret;
        });
    },

    // 查询赞列表
    queryLike(options) {
        const form = Object.assign({
            pageNo: 1,
            pageSize: 15
        }, options);

        return this.request({
            url: this.api['message/query_like'],
            form: form
        }).then((ret) => {
            const data = ret.data || [];
            const baseUrl = `/m/thread?need_zinfo=1&popup=1&navTitle=帖子详情`;

            data.forEach((item) => {
                item.postUrl = `${baseUrl}&tid=${item.tid}`;

                if (item.pid) {
                    item.replyUrl = `${item.postUrl}&pid=${item.pid}`;
                } else {
                    item.replyUrl = item.postUrl;
                }
            });

            return ret;
        });
    },

    // 查询回复与@列表
    queryReply(options) {
        const form = Object.assign({
            pageNo: 1,
            pageSize: 15
        }, options);

        return this.request({
            url: this.api['message/query_reply'],
            form: form
        }).then((ret) => {
            const data = ret.data || [];
            const baseUrl = `/m/thread?need_zinfo=1&popup=1&navTitle=帖子详情`;

            data.forEach((item) => {
                item.postUrl = `${baseUrl}&tid=${item.tid}`;

                if (item.pid) {
                    item.replyUrl = `${item.postUrl}&pid=${item.pid}`;
                } else {
                    item.replyUrl = item.postUrl;
                }
            });

            return ret;
        });
    },

    // 重置新粉丝提醒
    resetFollow() {
        return this.request({
            url: this.api['message/reset_follow']
        });
    },

    // 查询私信消息
    queryMessage(options) {

        // 坑！
        let isOfficialUser = false;
        // 默认测试环境下堂妹的uid
        let officialUser = '2230550';
        if(this.env == 'staging' || this.env == 'production') {
            // 线上环境堂妹的uid
            officialUser = '4821537';
        }

        const targetUid = options.targetUid;
        const form = Object.assign({
            pageSize: 15,
            dataPoint: -1
        }, options);

        return this.request({
            url: this.api['message/query_message'],
            form: form
        }).then((ret) => {
            const users = {};
            const data = ret.data;

            const members = data.members || [];
            const messages = data.messages || [];

            if (members.length != 2) {
                return Promise.reject('对方用户不存在');
            }

            data.members.forEach((item) => {
                users[item.uid] = item;
            });

            messages.forEach(item => {
                if(item.uid == officialUser){
                    item.verify = true;
                }
            })

            return {
                code: 0,
                data: {
                    users: users,
                    messages: messages,
                    targetUid: targetUid,
                    currentUid: data.currentUid
                }
            };
        });
    },

    // 发送私信
    sendMessage(data) {
        return this.request({
            url: this.api['message/send_message'],
            form: data
        });
    }
});

module.exports = Service;
