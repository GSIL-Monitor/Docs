/**
 * @overview 推荐页
 * @author longyun
 * @date 7/22/16
 */

'use strict';

const url = require('url');
const request = require('co-request');

function Service(ctx) {
    const state = ctx.state;
    this.headers = ctx.headers;
    this.api = state.api;
    this.request = state.request;
    this.env = state.env;
}

Object.setPrototypeOf(Service.prototype, {
    //获取banner服务不一样，单独处理
    getBanners(platform) {
        const uri = this.api['recommend/get_banners'];

        const proxyHost = url.parse(uri).host;
        // 后端接口(nginx层)会对请求进行host验证
        const headers = Object.assign({}, this.headers, {
            host: proxyHost
        });
        const type = {
            "dev": "24",
            "test": "24",
            "staging": "23",
            "production": "23"
        }
        const opt = {
            json: true,
            gzip: true,
            headers: headers,
            url: uri,
            method: 'GET',
            qs: { type: type[this.env], platform: platform }
        };


        // !很重要!
        // 删除原请求 content-length,  让 request 重新计算
        delete headers['content-length'];

        return request(opt).then((res) => {
            return res.body;
        }).then((ret) => {
            const banners = ret.banners || [];

            ret.banners = banners.map((item) => {
                const imgUrl = item.iconUrl;

                if (imgUrl) {
                    item.iconUrl = url.resolve(imgUrl, '?imageView2/0/w/640/interlace/1');
                }

                return item;
            });

            return ret;
        });
    },

    getTopics(platform, width, options={}) {

        // v2不请求话题接口
        if(options.v2) return Promise.reject();
        return this.request({
            url: this.api["recommend/get_topics"],
            timeout: 2000,
            form: { platform }
        }).then((ret) => {
            const data = ret.data || [];

            ret.data = data.map((item) => {
                const imgUrl = item.backgroundUrl;

                if (imgUrl) {
                    item.backgroundUrl = url.resolve(imgUrl, `?imageView2/0/w/${width || 480}/interlace/1`);
                }

                return item;
            });

            return ret;
        });
    },

    getFollowUpdateNum() {
        const uri = this.api['recommend/get_followUpdateNum'];
        const proxyHost = url.parse(uri).host;
        // 后端接口(nginx层)会对请求进行host验证
        const headers = Object.assign({}, this.headers, {
            host: proxyHost
        });
        const opt = {
            json: true,
            gzip: true,
            url: uri,
            headers: headers,
            method: 'GET',
            timeout: 2000,
            qs: { mod: 'spacecp', ac: 'follow', op: 'checkfeed', rand: new Date().getTime(), from: "recommend" }
        };
        return request(opt).then((res) => {
            return res.body;
        });
    },

    clearMsg() {
        const uri = this.api['recommend/get_followUpdateNum'];
        const proxyHost = url.parse(uri).host;
        // 后端接口(nginx层)会对请求进行host验证
        const headers = Object.assign({}, this.headers, {
            host: proxyHost
        });
        const opt = {
            json: true,
            gzip: true,
            url: uri,
            headers: headers,
            method: 'GET',
            qs: { mod: 'spacecp', ac: 'follow', op: 'checkfeed', rand: new Date().getTime(), from: "recommend", act: "clear" }
        };
        return request(opt).then((res) => {
            return res.body;
        });
    },

    getRecommendList(query) {

        const mc = this.headers['x-mc'] || '';
        const form = Object.assign({}, query, {mc})

        return this.request({
            url: this.api["recommend/get_recommend"],
            form
        }).then((ret) => {
            const data = ret.data || [];

            ret.data = data.map((item) => {
                const imgUrl = item.picture;

                if (imgUrl) {
                    item.picture = url.resolve(imgUrl, '?imageView2/0/w/160/interlace/1');
                }

                const author = item.author || {};
                const headImgUrl = author.headImgUrl;

                if (headImgUrl) {
                    author.headImgUrl = headImgUrl;
                }

                return item;
            });

            return ret;
        });
    },

    getBiRecommend() {
        return this.request({
            url: this.api["recommend/get_birecommend"],
            timeout: 2000
        }).then((ret) => {
            const data = ret.data || [];

            ret.data = data.map((item) => {
                const imgUrl = item.picture;

                if (imgUrl) {
                    item.picture = url.resolve(imgUrl, '?imageView2/0/w/160/interlace/1');
                }

                const author = item.author || {};
                const headImgUrl = author.headImgUrl;

                if (headImgUrl) {
                    author.headImgUrl = headImgUrl;
                }

                return item;
            });

            return ret;
        });
    },

    getEditorRecommend() {
        return this.request({
            url: this.api["recommend/getEditor"],
            timeout: 2000
        }).then((ret) => {
            const data = ret.data || [];

            ret.data = data.map((item) => {
                const imgUrl = item.picture;

                if (imgUrl) {
                    item.picture = url.resolve(imgUrl, '?imageView2/0/w/160/interlace/1');
                }

                const author = item.author || {};
                const headImgUrl = author.headImgUrl;

                if (headImgUrl) {
                    author.headImgUrl = headImgUrl;
                }

                return item;
            });

            return ret;
        });
    },

    biFeedBack(query) {
        return this.request({
            url: this.api["recommend/feedback"],
            form: query
        })
    },

    getHotUsers(options = {}) {
        // v2不请求话题接口
        if(options.v2) return Promise.reject();
        return this.request({
            url: this.api['recommend/hot_users'],
            timeout: 2000,
            form: { from: "recommend" }
        });
    },
    // 获取消息数量
    getMiscData() {
        return this.request({
            url: this.api['recommend/get_misc_data']
        }).then((ret) => {
            if (ret.data.notifyNum > 99) {
                ret.data.notifyNum = '99+'
            }
            return ret;
        });
    },

    // sdk导流
    sdkUpdate(platform) {
        return this.request({
            url: this.api['sdk/update'],
            form: {appPlat: platform}
        })
    }
});

module.exports = Service;
