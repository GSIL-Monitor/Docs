/**
 * @overview
 * @author cisong
 * @date 6/1/16
 */

import './index.less';

import url from 'url';
import request from 'request';
import isMobile from 'ismobilejs';

import ReplyTpl from '../item/tpl/reply.html?tpl';
import RecommendTpl from './tpl/recommend.html?tpl';
import RecommendPostTpl from './tpl/post.html?tpl';

import wxShare from '@wac/wechat-share';
import openApp from 'openApp';

const postWrap = $('.js-post-wrap');
const replyListEL = $('#js-normal-reply');

const openUrl = `wacaiforum://webview?url=${location.href}`

class App {
    constructor() {
        const INIT_STATE = window.__INIT_DATA__;
        const tid = INIT_STATE.tid;

        this.state = {
            ...INIT_STATE,
            replyOpts: {
                tid,
                pageSize: 20,
                orderAsc: 0
            }
        };

        this.init();

        const ua = navigator.userAgent.toLowerCase();
        const keys = ['micromessenger', 'qq', 'weibo'];

        const isBlocked = keys.some((key) => {
            const match = ua.match(new RegExp('\\b' + key + '\\b'));
            return match && match[0] === key;
        });

        this.isBlocked = isBlocked;

        if (!isBlocked) {
            openApp(openUrl, (isOpen) => {
                console.log(`isOpen`);
            })
            // this.openApp();
        }

        // 不超过三屏, 去掉超出截断限制
        if ($('.js-post-content').height() > 1500) {
            postWrap.addClass('post-overflow');
        }
    }

    init() {
        this.loadReply();
        this.initRecommend();
        this.initWxShare();
        this.initRecommendPosts();
        this.bindEvents();
        this.requestRecommendStats();
        this.confitEvts();
    }

    confitEvts() {
        const state = this.state;
        Stat.send('stat', {
            tid: state.tid
        });
    }

    requestRecommendStats() {
        request({
            url: '/item/add_licai_num'
        }).then((ret) => {
        }).catch((err) => {
            console.error(err);
        })
    }

    // 加载评论
    loadReply() {
        const replyOpts = this.state.replyOpts;
        const spinner = replyListEL.find('.js-spinner');

        request({
            url: '/item/reply_list',
            data: replyOpts
        }).then((ret) => {
            const data = ret.data;

            if (data.length > 0) {
                replyListEL.append(ReplyTpl.render({
                    page: 'view',
                    items: data.slice(0, 3)
                }));
            }
        }).finally((err) => {
            spinner.remove();
        });
    }

    // 加载推荐广告
    initRecommend() {
        request({
            url: '/common/recommend_bonus'
        }).then((ret) => {
            const data = ret.data || [];
            const bonus = data[0] || {};
            if (!bonus.url || !bonus.pic) {
                return;
            }

            // 处理 sites.wacai.com 地址
            const parsed = url.parse(bonus.url, true, true);

            if (parsed.host === 'sites.wacai.com') {
                parsed.protocol = 'http:';
            }

            bonus.url = parsed.format();

            $('#js-recommend').html(RecommendTpl.render(bonus));
        }).catch((err) => {
            console.error(err);
        });
    }

    // 微信分享定制
    initWxShare() {
        const agent = navigator.userAgent.toLowerCase();

        if (!agent.match(/MicroMessenger/i)) {
            return;
        }

        let imgUrl = 'https://s1.wacdn.com/wis/118/2f199d7341ca5fe7_100x100.png';

        // 微博没有标题, 取微博内容作为标题
        const contentEl = $('.post-content');
        const content = contentEl.text().slice(0, 50);
        const title = $('.post-title').text() || content;
        const detailImg = contentEl.find('img');

        if (detailImg.length > 0) {
            const imgEl = $(detailImg[0]);
            imgUrl = imgEl.attr('src') || imgEl.attr('data-src');
        }

        // 处理 img url 为 // 开始的协议
        const parsed = url.parse(imgUrl, true, true);

        parsed.protocol = location.protocol;

        imgUrl = parsed.format();

        const shareData = {
            link: location.href,
            title: title,
            desc: content,
            imgUrl: imgUrl
        };

        wxShare.register(shareData);
    }

    // 加载推荐帖子
    initRecommendPosts() {
        request({
            url: '/item/recommend_posts'
        }).then((ret) => {
            const data = ret.data || [];
            const postsEl = $('.js-recommend-posts');

            if (data.length == 0) {
                return;
            }

            postsEl.append(RecommendPostTpl.render({
                posts: data
            })).show();
        }).catch((err) => {
            console.error(err);
        });
    }

    // 尝试打开挖财社区/钱堂 APP
    openApp() {
        console.log(`openapp`)
        openApp(openUrl, (isOpen) => {
            console.log(`isOpen`);
        })

        return;

        const delay = 3000;
        const start = Date.now();
        const { tid, downLoadUrl } = this.state;
        const detailUrl = `wacaiforum://bbs/bbsService/detail.page?tid=${tid}`;

        // 调用 scheme 协议, location 方式 和 iframe 方式
        const iframe = document.createElement('iframe');

        iframe.style.display = 'none';
        iframe.src = detailUrl;

        // iOS 设备设置 location.href
        if (isMobile.apple.device) {
            location.href = detailUrl;
        } else {
            document.body.appendChild(iframe);
        }

        // setTimeout(() => {
        //     if (Date.now() - start < delay + 100) {
        //         location.href = downLoadUrl;
        //     }
        // }, delay);
    }

    bindEvents() {
        const el = $(document);

        const EVENTS = {
            // 点赞
            '.js-like-anchor': {
                click: (e) => {
                    e.preventDefault();

                    const state = this.state;

                    const target = $(e.currentTarget);
                    const countEl = $('.js-like-count');
                    const count = parseInt(countEl.text(), 10) || 0;

                    request({
                        method: 'post',
                        url: '/item/like_opt',
                        data: {
                            tid: state.tid
                        }
                    }).then(() => {
                        target.addClass('liked');
                        countEl.text(count + 1);
                    });
                }
            },

            // 打开挖财社区/钱堂 APP
            '.js-app-open': {
                click: (e) => {
                    if (this.isBlocked) {
                        return $('<div>', {
                            'class': 'm-browser-open'
                        }).appendTo('body');
                    }

                    this.openApp();
                }
            },

            // 微信提示分享遮罩
            '.m-browser-open': {
                click: (e) => {
                    $(e.currentTarget).remove();
                }
            },

            // 展示全文
            '.js-more': {
                click: (e) => {
                    postWrap.removeClass('post-overflow');
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

new App();
