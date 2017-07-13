/**
 * @overview 公共服务
 * @author cisong
 * @date 4/18/16
 */

'use strict';

const url = require('url');
const fileType = require('file-type');
const request = require('co-request');

function Service(ctx) {
    const state = ctx.state;

    this.api = state.api;
    this.request = state.request;
}

Object.setPrototypeOf(Service.prototype, {
    // 获取推荐帖子
    getRecommendPost() {
        return this.request({
            url: this.api['common/recommend_post']
        });
    },

    // 获取帖子推荐理财
    getRecommendBonus() {
        return this.request({
            url: this.api['common/recommend_bonus'],
            form: { adPositionId: 16005 }
        });
    },

    requestImageData(imgUrl) {
        const parsed = url.parse(imgUrl, true, true);

        parsed.protocol = 'http:';

        imgUrl = parsed.format();

        return request({
            url: imgUrl,
            encoding: null
        }).then((res) => {
            const body = res.body;

            if (!Buffer.isBuffer(body)) {
                return Promise.reject('image load failed');
            }

            const mime = fileType(body).mime;

            return `data:${mime};base64,${body.toString('base64')}`;
        });
    },

    encodeImageBase64(opts) {
        const banners = opts.banners;
        const topics = opts.topics;

        return Promise.props({
            banners: Promise.map(banners, (item, index) => {
                if (index > 0) {
                    return item;
                }

                return this.requestImageData(item.iconUrl).then((imgBase64) => {
                    item.iconUrl = imgBase64;
                    return item;
                });
            }).catch(() => {
                return banners;
            }),

            topics: Promise.map(topics, (item) => {
                return this.requestImageData(item.backgroundUrl).then((imgBase64) => {
                    item.backgroundUrl = imgBase64;
                    return item;
                });
            }).catch(() => {
                return topics;
            })
        });
    }
});

module.exports = Service;
