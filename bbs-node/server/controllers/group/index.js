/**
 * @overview 标签详情
 * @author cisong
 * @date 9/13/16
 */
'use strict';

const TagService = require('../../services/tag');
const RecommendService = require('../../services/recommend');
const util = require('lib/util');
const semver = require('semver')

module.exports = function*() {
    const tagId = parseInt(this.query.tagId, 10);
    const tabType = this.query.tabType || 'new';

    const platform = util.getPlatform(this);
    const isWacai = util.isApp(platform) || (this.query.sdk == '1')

    const isQianTang = util.isQiantang(this);

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
            //小组详情页基本信息
            pageInfo:tagService.getPageInfo({
                tagId: tagId
            }).then((ret) => {
                return ret.data || [];
            }),

            // 重置readCount
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
        tag.parsedName = encodeURIComponent(tag.name)
        ret.downLoadUrl = downLoadUrl;

        if (tabType !== 'new' && tabType !== 'digest') {
            ret.tabType = 'new';
        } else {
            ret.tabType = tabType;
        }

        if(ret.posts.length){
            ret.posts.forEach((ele) => {
                ele.likes = util.number2W(ele.likes);
                ele.replies = util.number2W(ele.replies);
            })
        }

        ret.INIT_DATA = {
            tagId: tagId,
            posts: ret.posts,
            pageTitle: ret.pageTitle,
            // hotUsers: hotUsers,
            tabType: ret.tabType,
            pageInfo: ret.pageInfo,
            downLoadUrl: downLoadUrl
        };
        //背景图片的随机ID
        ret.bg_id=tagId % 5;
        //小组订阅人数数据按规则显示
        const subscribeCount=ret.tagInfo.tag.subscribeCount;
        if(subscribeCount.toString().length>4){
            ret.tagInfo.tag.subscribeCount=subscribeCount.toString()[0]+'.';
            if(subscribeCount.toString()[2]>=5){
                ret.tagInfo.tag.subscribeCount+=(Number(subscribeCount.toString()[1])+Number(1))+'万';
            }else{
                ret.tagInfo.tag.subscribeCount+=subscribeCount.toString()[1]+'万';
            }
        }
        return ret;
    });

    
    if(isQianTang){
        yield this.render('group/index', data);
    }else{
        yield this.render('tag/index', data);
    }
    
};

