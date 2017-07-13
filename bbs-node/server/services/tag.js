/**
 * 标签页服务
 * Created by L3au on 9/20/16.
 */

'use strict';

const url = require('url');

function Service(ctx) {
    const state = ctx.state;

    this.api = state.api;
    this.request = state.request;
}

Object.setPrototypeOf(Service.prototype, {
    // 获取标签基础信息
    getTagInfo(tagId) {
        return this.request({
            method: 'GET',
            url: this.api['tag/basic_info'],
            qs: {
                tagId
            }
        });
    },

    // 获取标签订阅用户列表
    queryTagSubscriber(opts) {
        return this.request({
            method: 'GET',
            url: this.api['tag/subscribe_member'],
            qs: opts
        });
    },

    // 订阅及取消订阅标签
    saveTags(fids, canel_tags)  {
        return this.request({
            url: this.api['tag/save_tags'],
            form: {
                fids,
                canel_tags
            }
        });
    },
    //小组详情页的具体小组信息
    getPageInfo(tagIdObj) {
        return this.request({
            method: 'GET',
            url: this.api['tag/get_page_info'],
            qs: tagIdObj
        }).then((ret) => {
            const data = ret.data || {};

            if(data.tag && !data.tag.icon){
                data.tag.icon = '//s1.wacdn.com/wis/126/8a4bb0c62ccc42c1_142x142.png'
            }

            return ret;
        })
    },
    // 获取我加入的小组有哪些
    getMyTagList() {
        return this.request({
            method: 'GET',
            url: this.api['tag/my_tag_list']
        });
    },
    // 查询
    queryPostList(opts) {
        const type = ['new', 'digest'].indexOf(opts.type) > -1 ? opts.type : 'new';

        return this.request({
            method: 'GET',
            url: this.api[`tag/${type}_post_list`],
            qs: {
                pageSize: opts.pageSize || 20,
                tagId: opts.tagId,
                orderBy: opts.orderBy,
                lastTime: opts.lastTime
            }
        }).then((ret) => {
            const data = ret.data || [];

            data.forEach((item) => {
                const imgUrl = item.picture;

                if(item.summary){
                    item.summary = item.summary.replace("\u2028", "\\u2028");
                }

                if (imgUrl) {
                    item.picture = url.resolve(imgUrl, '?imageView2/0/w/160/interlace/1');
                }
            });

            return ret;
        });
    },

    // 更新帖子未读数信息
    updatReadCount(tagId) {
        return this.request({
            method: 'GET',
            url: this.api['tag/update_read_count'],
            qs: { tagId }
        });
    }
});

module.exports = Service;
