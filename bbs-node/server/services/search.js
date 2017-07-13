/**
 * @overview 搜索服务
 * @author cisong
 * @date 3/23/16
 */

'use strict';

function Service(ctx) {
    const state = ctx.state;

    this.api = state.api;
    this.request = state.request;
}

Object.setPrototypeOf(Service.prototype, {
    // 获取最近搜索历史
    queryHistory() {
        return this.request({
            url: this.api['search/query_history']
        });
    },

    // 清除搜索历史
    clearHistory() {
        return this.request({
            url: this.api['search/clear_history']
        });
    },

    // 查询默认(用户 + 帖子)
    searchDefault(keyword) {
        return this.request({
            url: this.api['search/search_default'],
            form: {
                keyword
            }
        });
    },

    // 搜索用户
    searchUser(keyword, currPage) {
        return this.request({
            url: this.api['search/search_user'],
            form: {
                keyword, currPage
            }
        });
    },

    // 搜索帖子
    searchPost(keyword, currPage) {
        return this.request({
            url: this.api['search/search_post'],
            form: {
                keyword, currPage
            }
        });
    },

    // 根据关键词搜贴子V1
    searchPostV1(keyword, currPage) {
        return this.request({
            url: this.api['search/search_post_v1'],
            form: {
                keyword, currPage
            }
        });
    },

    // 根据关键词搜用户V1
    searchUserV1(keyword, currPage) {
        return this.request({
            url: this.api['search/search_user_v1'],
            form: {
                keyword, currPage
            }
        });
    }
});

module.exports = Service;
