/**
 * @overview 帖子详情
 * @author cisong
 * @date 6/3/16
 */

'use strict';

var isMobile = require('ismobilejs');
const PostService = require('services/post');
const MemberService = require('services/member');
const RecommendService = require('services/recommend')
const urlParse = require('url').parse;
const util = require('lib/util');
const sdks = require('store/sdk');

const _APPS = {
            // 挖财记账理财 Android: 2, IOS: 3, IOS91越狱版: 8
            'bkk': [2, 3, 8],
            // 钱管家 IOS: 30, Android: 31
            'money': [30, 31],
            // 挖财宝 IOS: 40, Andorid: 41
            'finance': [40, 41],
            // 信用卡管家 Android: 20, IOS: 21
            'credit': [20, 21],
            // 快贷 Android: 61, IOS: 60
            'loan': [60, 61],
            // 挖财股神 Android: 81, IOS: 80
            'stock': [80, 81],
            // 挖财社区 Android: 71, IOS: 70
            'bbs': [70, 71]
        };

 /* 判定是否为某APP */

function testApp(name,platform){
    return name && _APPS[name.toLowerCase()].indexOf(+platform) > -1;
}

module.exports = function*() {
    const tid = this.query.tid;
    const pid = this.query.pid;
    const isShared = !!(this.query.source || this.query.from);

    const deviceid = this.headers['x-deviceid'] || '';

    const isProd = ['staging', 'production'].indexOf(this.app.env) > -1;  
    const platform = util.getPlatform(this);
    const userAgent = this.headers['user-agent'] || 'unkown';

    // 访问页面路径
    const parsed = urlParse(this.href, true, true);

    // 判断是否在app内部打开
    const isApp = util.isApp(platform) || (this.query.sdk == '1');
   
    const isBBSApp = util.isBBSApp(this);

    // 非 mobile 请求转向 PC 页面
    // 允许百度爬虫访问
    if (!isMobile(userAgent).any && !userAgent.match(/baiduspider/i) && !isApp) {
        const wacaiHost = `bbs.${isProd ? 'wacai' : 'wacaiyun'}.com`;
        return this.redirect(`http://${wacaiHost}/thread-${tid}-1-1.html`);
    };

    const isQianTangApp = util.isQiantangApp(this);
    const data = yield Promise.resolve().then(() => {
        if (!tid) {
            return Promise.reject();
        }

        const postService = new PostService(this);
        const memberService = new MemberService(this);
        const recommendService = new RecommendService(this);

        // 分页查询帖子点赞数量
        const pageSize = 7;
        const lastId = 0;

        // 只在外部分享页面调用理财优惠券接口
        const callFinanceCoupon = () => {
            if(isApp) return Promise.resolve();
            return postService.getLicaiCoupon().then((ret) => {
                return ret.data;
            });
        };

        // 只在app内部帖子详情页调用点赞列表
        const callLikerList = () => {
            return postService.getlikeList(tid, lastId, pageSize).then((ret) => {
                return ret.data
            })
        }

        // 只在app外部帖子详情页调用推荐帖子列表(bid)
        const callPostRecomendList = () => {
            if(isApp) return Promise.resolve();
            const bid = '16112';
            return postService.getRecommendPosts(bid, 5).then((ret) => {
                return ret.data
            })
        }
        /**
         * sdk导流
         */
        const callSDKUpdate = (platform) => {
            if(isQianTangApp) return Promise.resolve();
            return recommendService.sdkUpdate(platform).then((ret) => {
                return ret.data
            })
        }

        return Promise.props({
            post: postService.getPostDetail((() => {
                if (isApp) {
                    return {
                        tid: tid,
                        needTag: 1,
                        needLike: 1,
                        needFav: 1,
                        needFollow: 1,
                        needVote: 1,
                        from: 0
                    }
                } else {
                    return {
                        tid: tid,
                        needLike: 1,
                        from: 1
                    }
                }
            })()).then((ret) => {
                const data = ret.data;
                // merge post
                Object.assign(data, data.post);

                return data;
            }),
            // 帖子状态数据
            stats: postService.getPostStat(tid).then((ret) => {
                return ret.data;
            }),
            // 热门评论
            hotReplies: postService.queryHotReply(tid).then((ret) => {
                return ret.data || [];
            }).catch((e) => {
                this.log.error(e);
            }),
            // 普通评论
            replies: postService.queryReply({tid, orderasc:1}).then(ret => {
                return ret.data
            }).catch((e) => {
                this.log.error(e);
            }),
            // 获取单条评论
            singleReply: pid ? postService.querySingleReply({
                tid: tid,
                pid: pid
            }).then((ret) => {
                return ret.data;
            }) : Promise.resolve(),

            recommendPosts: callPostRecomendList(),

            // 获取理财优惠券
            licaiCouponCount: callFinanceCoupon(),

            // 获取点赞用户列表
            likeList: callLikerList(),

            // sdk
            sdk: callSDKUpdate(platform)
        });
    }).then((ret) => { 
        // 去重对象临时变量
        let replyListObjTmp = {};

        // 异常处理
        ret.hotReplies = ret.hotReplies || [];

        // 异常处理
        ret.replies = ret.replies || [];

        const post = ret.post;

        // 是否是微博
        ret.isWeibo = post.fid === 16735;
        // 页面标题
        ret.pageTitle = post.subject;
        // 前登录用户为帖子作者
        ret.isSelf = post.isSelf;

        // 推荐小组
        if(post.tag) {
            post.tag.subscribeCount = util.number2W(post.tag.subscribeCount);
            post.tag.threadCount = util.number2W(post.tag.threadCount);
            post.tag.digestCount = util.number2W(post.tag.digestCount)
        }

        // 热门回复优先取hotReply,如果取不到，就获取回复列表倒数两条
        if(ret.hotReplies.length){
            ret.hotReplies.forEach(reply => {
                replyListObjTmp[reply.pid] = true;
            })
        }

        // 普通回复去重处理
        let replies = ret.replies.filter(reply => {
            if(!replyListObjTmp[reply.pid]){
                return true;
            }

            return false;
        }).slice(0, 2)

        // 汇总后的回复列表
        ret.replyList = ret.hotReplies.concat(replies);

        // 推荐帖子
        if(ret.recommendPosts) {
            ret.recommendPosts.forEach(recommend => {

                if (recommend.picUrl || recommend.title.length > 18) {
                    recommend.lineClamp = 1;
                } else {
                    recommend.lineClamp = 2;
                }

                recommend.likeCount = util.number2W(recommend.likeCount)
                recommend.replyCount = util.number2W(recommend.replyCount)
            })
        }

        let likeList = [];

        if (Array.isArray(ret.likeList) && ret.likeList.length) {
            likeList = ret.likeList.map((user) => {
                return {
                    avatarUrl: user.avatarUrl,
                    uid: user.uid
                };
            })
        }

        // sdk入口开关
        if(ret.sdk) {
            ret.sdk = Object.assign({}, ret.sdk, {
                content:sdks.thread[Math.floor(Math.random() * sdks.thread.length)]
            })
        }
        
        // 初始化标记
        ret.stats.fav = ret.post.fav;
        ret.stats.like = ret.post.like;
        ret.stats.follow = ret.post.follow;
        ret.stats.self = ret.post.self;
        ret.stats.bannerUrl = `//s1.wacdn.com/bbs/bbs-doc/static/img/banner/${tid%5}.png`;
        ret.stats.platform = platform;
        ret.stats.path = encodeURIComponent(parsed.path);
        
        ret.INIT_STATE = {
            tid: tid,
            pid: pid,
            post: post,
            deviceid: deviceid,
            stats: ret.stats,
            fid: post.fid,
            likeList: likeList,
            isBBSApp: isBBSApp,
            isQianTang: isQianTangApp,
        };
        return ret;
    });

    // 是否在挖财客户端中
    if (isApp) {
        yield this.render('item/index', data);
    } else {
        const downLoadUrl = '//www.wacai.com/app/download?key=wacaicommunity_00000001';
        const logoClass = 'bbs';
        data.downLoadUrl = downLoadUrl;
        data.logoClass = logoClass;
        data.title ="钱堂";

        data.INIT_STATE.downLoadUrl = downLoadUrl;

        data.pageTitle = `钱堂 | ${data.pageTitle}`

        yield this.render('item-view-opt/index', data);
    }
};

