/**
 * @overview 标签详情
 * @author cisong
 * @date 9/13/16
 */
'use strict';

const TagService = require('services/tag');
const RecommendService = require('services/recommend');
const util = require('lib/util');

module.exports = function*() {
    const tagId = parseInt(this.query.tagId, 10);
    const tabType = this.query.tabType || 'new';
    const platform = util.getPlatform(this);
    const isWacai = util.isApp(platform) || (this.query.sdk == '1');

    const data = yield Promise.resolve().then(() => {
        if (!tagId) {
            return Promise.reject('标签不存在');
        }

        const tagService = new TagService(this);
        // const recommendService = new RecommendService(this);

        return Promise.props({
            // 标签信息
            tagInfo: tagService.getTagInfo(tagId).then((ret) => {
                return ret.data || {};
            }),

            // 订阅用户
            members: tagService.queryTagSubscriber({
                from: 'tag_page',
                pageSize: 5,
                tagId: tagId
            }).then((ret) => {
                // 反转处理订阅用户
                const members = ret.data || [];
                return members.slice(0, 5).reverse();
            }),

            // 首屏帖子
            posts: tagService.queryPostList({
                type: tabType,
                pageSize: 20,
                tagId: tagId
            }).then((ret) => {
                return ret.data || [];
            }),

            readCount: tagService.updatReadCount(tagId).then((ret) => {
                return ret.data || {};
            })

            // 禁用热门用户
            // hotUsers: recommendService.getHotUsers().then((ret) => {
            //     return ret.data || [];
            // }).catch((e) => {
            //     this.log.error(e);
            //     return [];
            // })
        });
    }).then((ret) => {
        const tag = ret.tagInfo.tag || {};
        const downLoadUrl = '//www.wacai.com/app/download?key=wacaishequ_00a00015';
        // const hotUsers = ret.hotUsers.slice(0, 2);

        ret.isWacai = isWacai;
        ret.pageTitle = tag.name;
        ret.downLoadUrl = downLoadUrl;

        if (tabType !== 'new' && tabType !== 'digest') {
            ret.tabType = 'new';
        } else {
            ret.tabType = tabType;
        }

        ret.INIT_DATA = {
            tagId: tagId,
            posts: ret.posts,
            // hotUsers: hotUsers,
            tabType: ret.tabType,
            downLoadUrl: downLoadUrl
        };

        return ret;
    });

    yield this.render('tag/index', data);
};