/**
 * @overview
 * @author cisong
 * @date 3/23/16
 */

'use strict';

const url = require('url');
const cookie = require('cookie');
const request = require('co-request');

module.exports = function (ctx) {
    return function (opts) {
        const uri = opts.url;
        const proxyHost = url.parse(uri).host;

        // 后端接口(nginx层)会对请求进行host验证
        const headers = Object.assign({}, ctx.headers, {
            host: proxyHost
        });

        // !很重要!
        // 删除原请求 content-length,  让 request 重新计算
        delete headers['content-length'];

        // 处理同名 cookie
        const cookie = headers.cookie || '';
        let cookieArr =  cookie.split(/; */);
        if (ctx.cookies.get('access_token')) {
            cookieArr.push('wctk=' + ctx.cookies.get('access_token'))
        }
        headers.cookie = cookieArr.reverse().join('; ');

        return request(Object.assign({
            json: true,
            gzip: true,
            method: 'POST',
            headers: headers
        }, opts)).then((res) => {
            const ret = res.body || {};
            const headers = res.headers;
            const cookies = headers['set-cookie'] || [];
            
            // 写入后端返回的的 cookie
            cookies.forEach((cookieString) => {
                ctx.set('Set-Cookie', cookieString);
            });
            if (ret.code != 0) {
                return Promise.reject(ret);
            }

            return ret;
        });
    };
};
