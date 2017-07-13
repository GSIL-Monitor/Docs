'use strict';

const url = require('url');
const request = require('co-request');

function Service(ctx) {
    const state = ctx.state;
    this.api = state.api;
    this.headers = ctx.headers;
    this.request = state.request;
    this.env = state.env;
}

Object.setPrototypeOf(Service.prototype, {
    //查询每个分类下的课程数量
    getFindList(){
        return this.request({
            url: this.api['lesson/get_find_list']
        }).then((ret) => {
            return ret;
        });
    },
    //公开课banner接口
    getBanners(platform,type){

        const uri = this.api['lesson/get_banners'];
        const proxyHost = url.parse(uri).host;
        // 后端接口(nginx层)会对请求进行host验证
        const headers = Object.assign({}, this.headers, {
            host: proxyHost
        });
        
        const opt = {
            json: true,
            gzip: true,
            headers: headers,
            url: uri,
            method: 'GET',
            timeout: 500,
            qs: { type: type, platform: platform }
        };

        // !很重要!
        // 删除原请求 content-length,  让 request 重新计算
        delete headers['content-length'];

        return request(opt).then((ret) => {
            return ret.body;
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
        })
    },
    //公开课列表页接口
    getList(query) {
        return this.request({
            url: this.api['lesson/get_list'],
            form: query
        }).then((ret) => {
            return ret;
        });
    },
    // 公开课首页接口
    getIndexList(num) {
        return this.request({
            url: this.api['lesson/get_index_list'],
            form: {num:num}
        }).then((ret) => {
            return ret;
        });
    }
});

module.exports = Service;