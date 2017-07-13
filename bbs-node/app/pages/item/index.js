/**
 * @overview
 * @author cisong
 * @date 6/1/16
 */

import './index.less';

import qs from 'querystring';
import request from 'request';
import {throttle} from 'lodash';
import Toast from '@wac/toast';


import ReplyTpl from './tpl/reply.html?tpl';
import MenuTpl from './tpl/menu.html?tpl';
import PopoverTpl from './tpl/popover.html?tpl';
import TagListTpl from './tpl/tag-list.html?tpl';
import {
  connect
} from '@wac/bridge-utils';

import url from 'url';
// 红包活动开关
import lottery from 'event/lottery';

// 点赞及收藏
import postHandle from './js/postHandle.js';
//投票
import React from 'react'
import { render } from 'react-dom'
import Vote from './js/vote.js';


const postEl = $('#js-post');
const replySumEl = $('#js-reply-sum');
const hotReplyEl = $('#js-hot-reply');
const replyListEL = $('#js-normal-reply');
const tagListEL = $('#J_tagList');
const shareIcon = location.protocol + require('./img/share.png');
const moreIcon = location.protocol + require('./img/more.png');
const bbsLogoSrc = location.protocol + require('./img/wacai-bbs-logo.png');

let lockFollow = false;
class App {
    constructor() {
        const INIT_STATE = window.__INIT_DATA__;
        const tid = INIT_STATE.tid;

        this.state = {
            ...INIT_STATE,
            replyOpts: {
                tid,
                orderasc: 0
            }
        };

        this.init();

        // 触发懒加载计算
        window.lazyLoad();
    }

    init() {
        const state = this.state;

        //渲染投票组件
        if(document.getElementById('vote-area')){
            render(
                <Vote 
                    InitData={this.state.post.vote} />,
                    document.getElementById('vote-area')
            );
        }

        this.initJsBridge();

        if (!this.state.pid) {
            this.bindScroll();

            if (state.stats.replies !== 0) {
                this.loadReply();
            }
        }

        this.bindEvents();

        // 如果存在小红包
        if(lottery) {
            const parsed = url.parse(location.href,true,true);
            const platform = window.__INIT_DATA__.stats.platform || parsed.query.platform || 70;
            lottery.showEntrance(platform);
        }
    
        // 配置信息
        this.confitEvts();

        this.bridgePromise.then((bridge) => {
            bridge.send(JSON.stringify({
                action: 'isSupport',
                params: {
                    method: 'browseImage'
                }
            }), (isSupport) => {
                this.isSupportBrowseImage = isSupport === 'true';
            });
        });

        this.bridgePromise.then((bridge) => {
            bridge.send(JSON.stringify({
                action: 'isSupport',
                params: {
                    method: 'forumDiscuss'
                }
            }), (isSupport) => {
                this.isSupportForumDiscuss = isSupport === 'true';
            });
        });
    }

    confitEvts() {
        const state = this.state;
        Stat.send('stat', {
            tid: state.tid
        });
    }

    loadReply(callback) {
        const stats = this.state.stats;

        if (this.loading || this.done || stats.replies === 0) {
            return;
        }

        this.loading = true;

        const replyOpts = this.state.replyOpts;
        const spinner = $('<div class="icon-spinner"></div>');

        if (!('lastpid' in replyOpts)) {
            replyListEL.html('');
        }

        spinner.appendTo(replyListEL);

        request({
            url: '/item/reply_list',
            data: replyOpts
        }).then((ret) => {
            const data = ret.data;

            if (data.length > 0) {
                replyOpts.lastpid = data.slice(-1)[0].pid;
                replyOpts.lastPostTimeMillis = data.slice(-1)[0].postTimeMillis;
                replyListEL.append(ReplyTpl.render({
                    items: data
                }));
            }

            if (data.length == 0) {
                this.done = true;
                replyListEL.append('<div class="m-no-more">没有更多了</div>');
            }

            // 触发懒加载计算
            window.lazyLoad();

            callback && callback();
        }).finally((err) => {
            spinner.remove();
            this.loading = false;
        });
    }

    // 分享成功回调
    // 任务类型code，1-新人礼，2-发帖，3-分享帖子
    shareCallback(){
        request({
            method: 'post',
            url: '/member/do_copper_task',
            data: {
                taskType: 3,
                deviceid: window.__INIT_DATA__.deviceid
            }
        }).then((ret) => {
            // if(ret.code == 0){
            //     if(ret.data.first){
            //         Toast('领取分享任务铜钱成功');
            //     } else {
            //         Toast('您已经领过了');
            //     }
            //     return;
            // }
            
            // Toast(ret.error || '网络错误，请稍后重试');            
        }).catch(err => console.error(err))
    }

    doShare() {
        this.bridgePromise.then((bridge) => {
            const subject = ($('.post-title').text() || postEl.find('.post-content').text()).slice(0, 40);
            const description = postEl.find('.post-content').text().slice(0, 50);
            const ua = navigator.userAgent.toLowerCase();
            const platform = /platform\/([\S]*)/i.test(ua) ? +RegExp.$1 : getQueryString('platform');
            const parsed = url.parse(location.href, true, true);

            const query = parsed.query;
            query.popup = 1;
            query.need_zinfo = 1;
            query.source = 'share';

            // 写死分享文案
            query.bbs_panelHint = '分享可得10铜钱，每日限1次';

            parsed.query.platform = platform;
            delete parsed.search;

            const shareLink = parsed.format();

            let shareImgSrc = bbsLogoSrc;

            const postImg = postEl.find('img').first();

            if (postImg[0]) {
                shareImgSrc = postImg.attr('src') || postImg.attr('data-src');
            }

            // 处理 img url 为 // 开始的协议
            const parsedShare = url.parse(shareImgSrc, true, true);

            parsedShare.protocol = location.protocol;

            shareImgSrc = parsedShare.format();

            shareImgSrc = url.resolve(shareImgSrc, '?imageView2/0/w/120/interlace/1');

            return new Promise((resolve, reject) => {
                window.w = bridge;
                if (bridge.isV2) {
                    bridge.share({
                        type: 0,
                        url: shareLink,
                        title: subject,
                        description: description,
                        iconUrl: shareImgSrc
                    }, { timeout: 0 })
                    return resolve();
                } 

                bridge.send(JSON.stringify({
                    action: 'isSupport',
                    params: {
                        method: 'share'
                    }
                }), function (isSupport) {
                    if (isSupport === 'true') {
                        resolve();
                    } else {
                        reject();
                    }
                });
            }).then(() => {

                if (bridge.isV2) {
                    // ios不支持分享成功回调
                    this.shareCallback();
                    return false;
                }

                return new Promise((resolve, reject) => {
                    const action = {
                        action: 'share',
                        params: {
                            shareType: 0,
                            url: shareLink,
                            title: subject,
                            description: description,
                            sharestyle: 1,
                            imgurl: shareImgSrc
                        }
                    };

                    // ios不支持分享成功回调
                    this.shareCallback();

                    bridge.send(JSON.stringify(action), (ret) => {
                        ret = JSON.parse(ret);

                        if (ret.code == 0) {
                            //this.shareCallback(ret);
                            return resolve();
                        }

                        reject(ret);
                    });
                });
            }, () => {
                const iframe = document.createElement('iframe');
                const paramsString = qs.stringify({
                    type: 0,
                    url: shareLink,
                    title: subject,
                    description: description,
                    sharestyle: 1,
                    imgurl: shareImgSrc
                });

                iframe.style.display = 'none';
                iframe.src = 'wacai://share?' + paramsString;

                document.body.appendChild(iframe);
            });
        });
    }

    renderMoreMenu() {
        const state = this.state;
        const stats = state.stats;
        const replyOpts = state.replyOpts;

        const menuEl = $('#js-more-menu');

        menuEl.html(MenuTpl.render({
            fav: stats.fav,
            tid: state.tid,
            orderasc: replyOpts.orderasc,
            isQianTang: window.__INIT_DATA__.isQianTang
        }));
    }

    toggleMoreMenu() {
        const menuEl = $('#js-more-menu');

        this.renderMoreMenu();

        menuEl.removeClass('more-menu-hide');

        return setTimeout(() => {
            menuEl.toggleClass('more-menu-show');
        }, 20);
    }

    initJsBridge() {
        this.bridgePromise = new Promise((resolve) => {
            if (window.WebViewJavascriptBridge) {
                resolve(WebViewJavascriptBridge);
            } else {
                document.addEventListener('WebViewJavascriptBridgeReady', function (e) {
                    resolve(e.bridge);
                }, false);
            }
        }).then((bridge) => {
            bridge.init((message, sendResponse) => {

                const data = JSON.parse(message);
                const tid = url.parse(location.href, true, true).query.tid;

                // 同步前端点赞信息
                if (data.action === 'onLikeClick' && typeof data.isLike != 'undefined') {
                    postHandle.postState.like = data.isLike;
                    !!data.isLike ? postHandle.postState['likes']++ :  postHandle.postState['likes']--;
                    postHandle.reqCurrentUser(data.isLike);
                }

                if (data.action === 'share') {
                    return this.doShare();
                }

                if (data.action === 'more') {
                    Stat.send('stat', {
                        evt: 'threaddetail_operating',
                        tid: tid
                    });

                    return this.toggleMoreMenu();
                }
            });

            this.callBridge(bridge);

            return bridge;
        });
    }

    isSupportBottomShare(bsCallback) {
        // 检测是否支持bar分享功能
        this.bridgePromise.then((bridge) => {
            bridge.send(JSON.stringify({
                action: 'isSupport',
                params: {
                    method: 'detailLikeClicked'
                }
            }), (isSupport) => {
                this.isSupportBarShareButton = isSupport === 'true';
                bsCallback && bsCallback.call(this, this.isSupportBarShareButton)
            });
        });
    }

    showBottomShareFeature(like) {
        this.bridgePromise.then((bridge) => {
            bridge.send(JSON.stringify({
                action: 'detailLikeClicked',
                params: {
                    isLike: like
                }
            }), (ret) => {
                console.log(ret);
            });
        });
    }

    callBridge(bridge) {
        const shareObj = [{
            iconUrl: shareIcon,
            message: {
                action: 'share'
            }
        }, {
            iconUrl: moreIcon,
            message: {
                action: 'more'
            }
        }];

        // 右上角展示更多和分享
        const menuJson = {
            action: 'customClientNavButton',
            params: {
                data: shareObj
            }
        };

        // 右上角只展示更多
        const moreJson = {
            action: 'customClientNavButton',
            params: {
                data: [shareObj[1]]
            }
        };

        // 下方展示分享及赞
        const featureJson = {
            action: 'detailLikeClicked',
            params: {
                data: [shareObj[0]]
            }
        };

        // test feature
        this.isSupportBottomShare( (isSupport) => {
            if (isSupport) {
                //bridge.send(JSON.stringify(featureJson));
                bridge.send(JSON.stringify(moreJson));
            } else {
                bridge.send(JSON.stringify(menuJson));
            }
        })
    }

    bindScroll() {
        let lastScrollTop;

        const el = $(document);
        const body = document.body;

        el.on('scroll touchmove', throttle((e) => {
            const scrollTop = body.scrollTop;

            if (scrollTop - lastScrollTop >= 0 &&
                scrollTop + window.innerHeight * 4 >= body.scrollHeight) {
                this.loadReply();
            }

            lastScrollTop = scrollTop;
        }, 200));
    };

    bindEvents() {
        const el = $(document);

        const EVENTS = {
            // 关闭 more-menu
            '.js-mask': {
                touchmove: (e) => {
                    e.preventDefault();
                },

                click: () => {
                    this.toggleMoreMenu();
                }
            },

            // 更多菜单动画
            '#js-more-menu': {
                'transitionend webkittransitionend': () => {
                    const menuEl = $('#js-more-menu');

                    if (!menuEl.hasClass('more-menu-show')) {
                        menuEl.addClass('more-menu-hide');
                    }
                }
            },

            // 查看完整帖子
            '.js-more-content': {
                click: (e) => {
                    postEl.removeClass('post-overflow');
                }
            },

            // 加载完整评论
            '.js-load-more': {
                click: (e) => {
                    const target = $(e.currentTarget);

                    target.parent().remove();

                    hotReplyEl.removeClass('list-hidden');

                    this.bindScroll();
                    this.loadReply();
                }
            },
            // 关闭推荐关注
            '#J_tagList > .bg': {
                touchmove: (e) => {
                    e.preventDefault();
                },
                click: () => {
                    $('#J_tagList').hide();
                    $('#J_tagList').html('');
                }
            },
            // 关注
            '.js-follow': {
                click: (e) => {
                    const target = $(e.currentTarget);
                    const uid = target.attr('data-uid');
                    const hasFollowed = target.hasClass("followed");
                    request({
                        method: 'post',
                        data: {uid},
                        url: hasFollowed ? '/member/unfollow' : '/member/follow'
                    }).then(() => {
                        target.toggleClass('followed');
                        if (!hasFollowed && !target.hasClass('recommend') && !lockFollow) {
                            return request({
                                method: 'post',
                                url: '/member/get_tag_list'
                            }).then((ret) => {
                                if (ret.code == 0) {
                                    if (ret.data.length === 0) {
                                        Toast('您将在“关注页”了解Ta的动态');
                                        return;
                                    }
                                    tagListEL.show();
                                    lockFollow = true;
                                    tagListEL.css('height', (4 + 6.5 * ret.data.length) + 'rem');
                                    tagListEL.css('opacity', 1);
                                    tagListEL.append(TagListTpl.render({
                                        data: ret.data
                                    }));
                                }
                            })
                        } else if(!hasFollowed){
                            Toast('您将在“关注页”了解Ta的动态');
                        }
                    }).catch((err) => {
                        console.error(err);
                    });
                }
            },

            // 收藏或取消
            '.js-fav': {
                click: (e) => {
                    const state = this.state;
                    const tid = state.tid;
                    const isFav = state.stats.fav;

                    Stat.send('stat', {
                        evt: 'threaddetail_operating_collect'
                    });

                    request({
                        method: 'post',
                        data: {tid},
                        url: '/item/fav_opt'
                    }).then(() => {
                        state.stats.fav = !isFav;

                        // 更新h5收藏状态
                        postHandle.postState.fav = state.stats.fav;

                        this.renderMoreMenu();

                        return Promise.delay(200);
                    }).then(() => {
                        this.toggleMoreMenu();
                    });
                }
            },

            // 评论查看顺序
            '.js-order': {
                click: (e) => {
                    const state = this.state;
                    const replyOpts = state.replyOpts;
                    const orderasc = replyOpts.orderasc;

                    delete replyOpts.lastpid;
                    replyOpts.orderasc = orderasc == 0 ? 1 : 0;

                    const loadMoreEl = $('.js-load-more');

                    if (loadMoreEl.length) {
                        loadMoreEl.trigger('click');
                    }

                    return Promise.resolve()
                        .then(() => {
                            this.renderMoreMenu();

                            let scrollTop;

                            if (hotReplyEl.length) {
                                scrollTop = hotReplyEl.offset().top + 24;
                            } else {
                                scrollTop = replySumEl.offset().top;
                            }

                            document.body.scrollTop = scrollTop;

                            this.done = false;
                            this.loadReply(() => {
                                document.body.scrollTop = scrollTop;
                            });

                            return Promise.delay(200);
                        })
                        .then(() => {
                            this.toggleMoreMenu();
                        });
                }
            },

            // 回复及举报弹窗
            '.js-reply .content': {
                click: (e) => {
                    const originTarget = e.target;
                    const target = $(e.currentTarget);
                    const pid = target.data('pid');
                    const contentEl = target.find('.message');
                    const tid = this.state.tid;

                    const tagName = originTarget.tagName.toLowerCase();
                    const className = originTarget.className;
                    const isActive = target.hasClass('item-active');

                    $('.js-popover').remove();
                    $('.item-active').removeClass('item-active');

                    if (tagName === 'a' || className.match(/img|cover/) || isActive) {
                        return;
                    }

                    target.addClass('item-active');

                    const popover = $(PopoverTpl.render({
                        tid: tid,
                        pid: pid
                    }));

                    popover.appendTo(contentEl);

                    popover.css({
                        top: -popover.height(),
                        left: (contentEl.width() - popover.width()) / 2
                    });
                }
            },

            // 浏览大图
            '.js-view-large': {
                click: (e) => {
                    if (!this.isSupportBrowseImage) {
                        return;
                    }

                    e.preventDefault();

                    const img = e.currentTarget;
                    const images = $('.js-view-large').toArray();
                    const current = images.indexOf(img);

                    this.bridgePromise.then((bridge) => {
                        const urls = images.map((img) => {
                            const imgUrl = $(img).attr('data-img');
                            const parsed = url.parse(imgUrl, true, true);

                            parsed.protocol = location.protocol;

                            return parsed.format();
                        });

                        const action = {
                            action: 'browseImage',
                            params: {
                                urls: urls,
                                current: current
                            }
                        };

                        bridge.send(JSON.stringify(action));
                    });
                }
            },

            // 意见反馈
            '.js-btn-discuss': {
                click: (e) => {
                    e.preventDefault();
                    const plateName = $('.post-forum .name').text();
                    // 进到发帖页面
                    // if (this.isSupportForumDiscuss) {
                    //     this.bridgePromise.then((bridge) => {
                    //         const action = {
                    //             action: 'forumDiscuss',
                    //             params: {
                    //                 type: 3,
                    //                 plateID: 16830
                    //             }
                    //         };

                    //         bridge.send(JSON.stringify(action));
                    //     });
                    // } else {
                    //     location.href = 'wacai://forumdiscuss?type=3&at=&plateID=16830';
                    // }
                    const targetUid = process.env.NODE_ENV == 'production' ? '4821537':'2230550';
                    location.href = `/app/message/inbox?popup=1&need_login=1&targetUid=${targetUid}&navTitle=堂妹`
                }
            },
            '.sdk-content': {
                click: (e) => {
                    Stat.send('stat', {
                        evt: 'sdk_landingpage_ad',
                        platform: window.__INIT_DATA__.stats.platform
                    });
                }
            }
        };

        $.each(EVENTS, (selector, events) => {
            $.each(events, (type, handler) => {
                el.on(type, selector, handler.bind(this));
            });
        });
    }
}

window.wacClient_callback = () => {
    $('.js-btn').removeClass('flag');
}

export default new App();
