/**
 * @overview 锦囊服务
 * @author qingtong
 * @date 4/11/16
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
        const uri = this.api['jinnang/get_banners'];

        const proxyHost = url.parse(uri).host;
        // 后端接口(nginx层)会对请求进行host验证
        const headers = Object.assign({}, this.headers, {
            host: proxyHost
        });
        const type = {
            "dev": "34",
            "test": "34",
            "staging": "29",
            "production": "29"
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
                return item;
            });

            return ret;
        });
    },

    getRecommendQuestion(pageSize=3){
        return this.request({
            url: this.api['qa/get_recommend_question'],
            form: {pageSize: pageSize}
        }).then((ret) => {
            return ret;
        });
    }
});

module.exports = Service;
