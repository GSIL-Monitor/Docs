/**
 * @overview 用户服务
 * @author cisong
 * @date 3/23/16
 */

'use strict';

const _ = require('lodash');
const moment = require('moment');

function Service(ctx) {
    const state = ctx.state;

    this.api = state.api;
    this.request = state.request;
}

Object.setPrototypeOf(Service.prototype, {
    // 获取当前登录用户信息
    getCurrentInfo() {
        return this.request({
            url: this.api['member/current_info']
        });
    },

    // 获取更多页面用户信息
    getMoreInfo() {
        return this.request({
            url: this.api['member/more_info']
        });
    },

    // 签到
    doSign() {
        return this.request({
            url: this.api['member/sign']
        });
    },

    // 获取签到信息
    getSignInfo(opts) {
        const form = Object.assign({
            signLog: 1
        }, opts);

        return this.request({
            url: this.api['member/sign_info'],
            form: form
        }).then((ret) => {
            const data = ret.data;

            const m = moment();
            const currentDate = m.date();

            let days = m.daysInMonth();
            let signDays = data.signDays;

            // 签到日期
            signDays = signDays.map((day) => {
                return parseInt(String(day).slice(-2), 10);
            });

            // 本月前
            let firstDayWeek = m.date(1).day();
            let beforeDays = _.range(firstDayWeek).map(() => {
                return {
                    disabled: true
                };
            });

            // 本月后
            let row = Math.ceil((days + firstDayWeek) / 7);
            let afterDays = _.range(row * 7 - days - firstDayWeek).map(() => {
                return {
                    disabled: true
                }
            });

            // 本月签到
            days = _.range(1, days + 1).map((date) => {
                const day = {
                    date: date
                };

                if (date === currentDate) {
                    day.current = true;
                }

                if (_.includes(signDays, date)) {
                    day.active = true;
                }

                return day;
            });

            data.signDays = _.chunk(_.concat(beforeDays, days, afterDays), 7);

            return ret;
        });
    },

    // 签到排行榜
    signRanking() {
        return Promise.map([1, 2, 3], (page) => {
            return this.request({
                url: this.api['member/sign_ranking'],
                form: {
                    pageSize: 20,
                    currPage: page
                }
            }).then((ret) => {
                return ret.data;
            });
        }).then((results) => {
            return {
                code: 0,
                data: _.flatten(results).slice(0, 50)
            };
        });
    },

    // 分享推荐
    sharePost() {
        return this.request({
            url: this.api['member/share_post']
        });
    },

    // 保存用户昵称
    saveName(opts) {
        return this.request({
            url: this.api['member/save_name'],
            form: opts
        });
    },

    // 关注用户
    doFollow(uid) {
        return this.request({
            url: this.api['member/follow'],
            form: { uid }
        });
    },
    // 批量关注
    doBatchFollow(uids) {
        return this.request({
            url: this.api['member/batch_follow'],
            form: { uids }
        });
    },
    // 取消关注用户
    unFollow(uid) {
        return this.request({
            url: this.api['member/unfollow'],
            form: { uid }
        });
    },
    //帖子详细 推荐达人
    getTagList() {
        return this.request({
            url: this.api['member/get_tag_list'],
            timeout: 2000,
            form: { from: "recommend" }
        }).then((ret) => {
            ret.data = _.sampleSize(ret.data, 3)
            return ret;
        });
    },

    // 任务状态
    getUserTaskList(opt){
        return this.request({
            url: this.api['member/user_task_list'],
            form: opt
        }).then((ret) => {
            
            if(ret.code == 0){
                let taskDesc = ret.data.newUserGift.taskDesc;
                ret.data.newUserGift.taskDesc = taskDesc.replace(/(\d+)/g,'<em>$1</em>');
            }

            return ret;
        });
    },

    // 任务状态
    doCopperTask(opt){
        return this.request({
            url: this.api['member/do_copper_task'],
            form: opt
        }).then((ret) => {
            return ret;
        });
    },

    // 获取铜钱账单
    getBillList(lastId = null, size = 20) {
        return this.request({
            url: this.api['copper/app_get_op_list'],
            form: {
                lastId,
                size
            }
        }).then(ret => ret);
    }
});

module.exports = Service;
