/**
 * 推荐页数据model
 * @author qingtong
 * @date 1/12/17
 */

'use strict';

const url = require('url');
const request = require('co-request');
const urlParse = require('url').parse;
const urlResolve = require('url').resolve;
const CommonService = require('services/common');
const RecommendService = require('services/recommend');
const JinnangService = require('services/jinnang');
const _ = require('lodash');

function* Service(ctx, platform, options = {}) {
    const commonService = new CommonService(ctx);

    const data = yield Promise.resolve().then(() => {
        const recommendService = new RecommendService(ctx);
        const jinnangService = new JinnangService(ctx);

        const mc = ctx.headers['x-mc'] || '';

        return Promise.props({
            banners: recommendService.getBanners(platform).then((ret) => {
                return ret.banners;
            }).catch((e) => {
                ctx.log.error(e);
            }),

            topics: recommendService.getTopics(platform, 200, options).then((ret) => {
                return ret.data;
            }).catch((e) => {
                ctx.log.error(e);
            }),
            // followUpdateNum: recommendService.getFollowUpdateNum((ret) => {
            //     return ret;
            // }).catch((e) => {
            //     ctx.log.error(e);
            // }),

            recommendList: recommendService.getRecommendList({mc, pageSize: 20}).then((ret) => {
                return ret.data || [];
            }).catch((e) => {
                ctx.log.error(e);
                return [];
            }),

            // 2.2废弃
            // editorRecommends: recommendService.getEditorRecommend().then((ret) => {
            //     return ret.data || [];
            // }).catch((e) => {
            //     ctx.log.error(e);
            //     return [];
            // }),

            biRecommends: recommendService.getBiRecommend().then((ret) => {
                return ret.data || [];
            }).catch((e) => {
                ctx.log.error(e);
                return [];
            }),

            hotUsers: recommendService.getHotUsers(options).then((ret) => {
                return ret.data;
            }).catch((e) => {
                ctx.log.error(e);
            }),

            sdkUpdate: recommendService.sdkUpdate(platform).then((ret) => {
                return ret.data
            }),

            jinnangList: jinnangService.getRecommendQuestion(options.jinnangSize).then(ret => ret.data)

        });
    }).then((ret) => {
        let recommendListObjTmp = {};
        let recommendIds = [];
        let biRecommendIds = [];
        let editorRecommendIds = [];


        function recommendModify(recommend){
            recommend.titleLen = recommend.title.replace(/[^\x00-\xff]/g, "01").length;
            const imgUrl = recommend.picture;

            if (imgUrl || recommend.title.length > 18) {
                recommend.lineClamp = 1;
            } else {
                recommend.lineClamp = 2;
            }
        }

        // 编辑推荐ids 2.2废弃
        // ret.editorRecommends.forEach((recommend) => {
        //     recommendModify(recommend);
        //     recommendListObjTmp[recommend.tid] = true;
        //     editorRecommendIds.push(recommend.tid);
        //     recommendIds.push(recommend.tid);
        // });

        // 个性化推荐
        ret.biRecommends.forEach((recommend) => {
            recommendModify(recommend);
            recommendListObjTmp[recommend.tid] = true;
            biRecommendIds.push(recommend.tid);
            recommendIds.push(recommend.tid);
        });

        // 过滤掉个性化推荐和推荐列表重复的帖子
        ret.recommendList = ret.recommendList.filter((recommend) => {
            if (!recommendListObjTmp[recommend.tid]) {
                recommendModify(recommend);
                recommendIds.push(recommend.tid);
                return true;
            }
            return false;
        });

        // 取前五条banner
        if (ret.banners && ret.banners.length > 5) {
            ret.banners = ret.banners.slice(0, 5).map((banner) => {
                // 统一添加 popup=1
                const parsed = urlParse(banner.url, true, true);

                if (parsed.host === 'sites.wacai.com') {
                    parsed.protocol = 'http';
                }

                parsed.query.popup = 1;
                delete parsed.search;

                banner.url = parsed.format();

                return banner;
            });
        }

        //  前两条话题
        if (ret.topics && ret.topics.length > 2) {
            ret.topics = ret.topics.slice(0, 2);
        }

        // 前两条红人
        if (ret.hotUsers && ret.hotUsers.length > 2) {

            ret.hotUsers = _.sampleSize(ret.hotUsers, 2);

        }

        const lastRecommend = ret.recommendList.slice(-1)[0] || {};

        ret.INIT_STATE = {
            lastRecommendTime: lastRecommend.time || 0,
            biRecommendIds: biRecommendIds,
            recommendIds: recommendIds
        };

        return ret;
    });

    return {
        code: 0,
        data: data
    }

};

module.exports = Service;
