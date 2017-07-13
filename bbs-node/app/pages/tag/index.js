import './index.less';

import Toast from '@wac/toast';
import {throttle} from 'lodash';
import request from 'request';
import isMobile from 'ismobilejs';

import PostTpl from './tpl/post.html?tpl';
import EmptyTpl from './tpl/empty.html?tpl';
import HotUsersTpl from './tpl/hot-user.html?tpl';
import Quotes from './shit.json';

import url from 'url';

const sortTypeEl = $('.js-sort-type');
const postsListEl = $('.m-post-list');

class App {
    constructor() {
        const initData = window.__INIT_DATA__ || {};
        const { tagId, tabType, hotUsers, downLoadUrl }  = initData;
        const initPosts = (initData.posts || []).concat();

        const state = {
            tagId: tagId,
            tabType: tabType,
            hotUsers: hotUsers,
            sortType: 'post',
            downLoadUrl: downLoadUrl,
            posts: {
                'new_post': [],
                'new_reply': [],
                'digest': []
            }
        };

        // 初始化帖子数据及当前数据指向
        if (tabType === 'new') {
            state.posts.new_post = initPosts;
            state.postsCursor = 'new_post';
        } else {
            state.posts.digest = initPosts;
            state.postsCursor = 'digest';
        }

        this.state = state;

        this.init();

        if (initPosts.length === 0) {
            initPosts._done = true;
            this.reloadList();
        }

        // 触发懒加载
        window.lazyLoad();
        // 禁用活跃用户
        // this.insertHotUsers();

        const ua = navigator.userAgent.toLowerCase();
        const keys = ['micromessenger', 'qq', 'weibo'];

        const isBlocked = keys.some((key) => {
            const match = ua.match(new RegExp('\\b' + key + '\\b'));
            return match && match[0] === key;
        });

        this.isBlocked = isBlocked;

        // 分享版打开自动触发打开客户端
        if (!isBlocked && $('.js-app-open').length) {
            this.openApp();
        }
    }

    init() {
        this.bindScroll();
        this.bindEvents();
        this.initJsBridge();
        this.sendParam();//提取url参数上传
    }

    sendParam() {
        const fid = url.parse(location.href, true, true).query.fid;
        const tagId = url.parse(location.href, true, true).query.tagId;

        if(fid){
            Stat.send('stat', {
                fid: fid
            });
        }

        if(tagId){
            Stat.send('stat', {
                tagId: tagId
            });
        }
    }

    initJsBridge() {
        this.bridgePromise = new Promise((resolve) => {
            if (window.WebViewJavascriptBridge) {
                resolve(WebViewJavascriptBridge);
            } else {
                document.addEventListener('WebViewJavascriptBridgeReady', function() {
                    resolve(WebViewJavascriptBridge)
                }, false);
            }
        }).then((bridge) => {
            bridge.init((message, sendResponse) => {
                console.log(message);
            });

            bridge.send(JSON.stringify({
                action: 'isSupport',
                params: {
                    method: 'forumDiscuss'
                }
            }), (isSupport) => {
                this.isSupportForumDiscuss = isSupport === 'true';
            });

            return bridge;
        });
    }

    // 刷新列表
    reloadList() {
        const {
            tagId,
            tabType,
            sortType,
            posts,
            postsCursor
        } = this.state;

        const curPosts = posts[postsCursor];

        // 再次加载
        if (curPosts.length > 0) {
            const content = PostTpl.render({
                posts: curPosts
            });

            postsListEl.html(content);

            // 禁用活跃用户
            // this.insertHotUsers();

            // 触发懒加载
            window.lazyLoad();
            return;
        }

        // 列表为空
        if (curPosts._done) {
            const rnd = Math.floor(Math.random() * Quotes.length);
            const data = Object.assign({
                type: tabType
            }, Quotes[rnd]);

            postsListEl.html(EmptyTpl.render(data));

            return;
        }

        postsListEl.html('');

        // 首次加载
        this.loadPosts().then(() => {
            if (curPosts.length === 0) {
                curPosts._done = true;
                this.reloadList();
            }

            // 禁用活跃用户
            // this.insertHotUsers();
        });
    }

    // 加载帖子列表
    loadPosts() {
        const {
            tagId,
            tabType,
            sortType,
            posts,
            postsCursor
        } = this.state;

        const curPosts = posts[postsCursor];
        const lastPost = curPosts[curPosts.length - 1] || {};

        if (this.loading || curPosts._done) {
            return Promise.resolve();
        }

        const spinner = $('<div class="m-spinner icon-spinner"></div>');

        postsListEl.after(spinner);

        this.loading = true;

        const query = {};
        const orderMap = {
            post: 'postTime',
            reply: 'lastReplyTime'
        };

        if (tabType === 'new') {
            const lastTimeKey = orderMap[sortType];

            query.orderBy = lastTimeKey;
            query.lastTime = lastPost[lastTimeKey];
        }

        if (tabType === 'digest') {
            query.lastTime = lastPost.postTime;
        }

        return request({
            url: '/tag/post_list',
            data: Object.assign({
                tagId: tagId,
                tabType: tabType
            }, query)
        }).then((ret) => {
            const data = ret.data || [];

            if (data.length == 0) {
                curPosts._done = true;
                postsListEl.append('<div class="m-no-more">没有更多了</div>');
                return;
            }

            [].push.apply(curPosts, data);

            postsListEl.append(PostTpl.render({
                posts: data
            }));

            // 触发懒加载
            window.lazyLoad();
        }).finally(() => {
            spinner.remove();
            this.loading = false;
        });
    }

    // 插入热门用户推荐
    insertHotUsers() {
        const { posts, postsCursor, hotUsers } = this.state;
        const curPosts = posts[postsCursor];

        if (curPosts.length < 10) {
            return;
        }

        const siblingEl = $(postsListEl.children().get(9));

        if (siblingEl && siblingEl.length) {
            siblingEl.after(HotUsersTpl.render({ hotUsers }));
        }
    }

    // 尝试打开挖财社区/钱堂 APP
    openApp() {
        const delay = 3000;
        const start = Date.now();
        const { downLoadUrl } = this.state;
        const detailUrl = `wacaiforum://`;

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

        setTimeout(() => {
            if (Date.now() - start < delay + 100) {
                location.href = downLoadUrl;
            }
        }, delay);
    }

    bindScroll() {
        let lastScrollTop;

        const el = $(document);
        const body = document.body;

        el.on('scroll touchend', throttle((e) => {
            const scrollTop = body.scrollTop;

            if (scrollTop - lastScrollTop > 0 &&
                scrollTop + window.innerHeight * 4 >= body.scrollHeight) {
                this.loadPosts();
            }

            lastScrollTop = scrollTop;
        }, 200));
    }

    bindEvents() {
        const el = $(document);

        const EVENTS = {
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

            // 监听排序弹窗隐藏
            'body': {
                click: (e) => {
                    const className = e.target.className;

                    if (/\bsort\b/.test(className)) {
                        return;
                    }

                    sortTypeEl.removeClass('active');
                }
            },

            // 订阅及取消订阅标签
            '.js-subscribe': {
                click: (e) => {
                    const {tagId} = this.state;
                    const target = $(e.currentTarget);

                    const data = {};
                    const isSubscribed = target.hasClass('subscribed');

                    if (!isSubscribed) {
                        data.fids = tagId;
                    } else {
                        data.canel_tags = tagId
                    }

                    request({
                        method: 'post',
                        data: data,
                        url: '/tag/save_tags'
                    }).then(() => {
                        target.toggleClass('subscribed');

                        if (!isSubscribed) {
                            Toast('订阅成功');
                        }
                    });
                }
            },

            // 唤起切换排序类型弹窗
            '.js-sort-type': {
                click: (e) => {
                    const target = $(e.currentTarget);

                    target.toggleClass('active');
                }
            },

            // 切换排序类型
            '.js-sort-item': {
                click: (e) => {
                    const target = $(e.currentTarget);
                    const type = target.data('type');

                    sortTypeEl.removeClass('sort-post sort-reply active');
                    sortTypeEl.addClass(`sort-${type}`);

                    const oldType = this.state.sortType;

                    if (oldType !== type) {
                        this.state.sortType = type;
                        this.state.postsCursor = `new_${type}`;

                        this.reloadList();
                    }
                }
            },

            // 切换最新和精华
            '.js-tab-anchor': {
                click: (e) => {
                    const target = $(e.currentTarget);
                    const type = target.data('type');
                    const sortType = this.state.sortType;

                    $('.js-tab-anchor').removeClass('active');
                    target.addClass('active');

                    this.state.tabType = type;

                    if (type === 'digest') {
                        sortTypeEl.addClass('hide');
                        this.state.postsCursor = 'digest';
                    } else {
                        sortTypeEl.removeClass('hide');
                        this.state.postsCursor = `new_${sortType}`;
                    }

                    this.reloadList();
                }
            },

            // 新发帖
            '.js-new-post': {
                click: (e) => {
                    e.preventDefault();
                    const { tagId } = this.state;

                    // 进到发帖页面
                    if (this.isSupportForumDiscuss) {
                        this.bridgePromise.then((bridge) => {
                            const action = {
                                action: 'forumDiscuss',
                                params: {
                                    type: 3,
                                    plateID: parseInt(tagId, 10)
                                }
                            };

                            bridge.send(JSON.stringify(action));
                        });
                    } else {
                        location.href = `wacai://forumdiscuss?type=3&at=&plateID=${ tagId }`;
                    }
                }
            },

            //关注
            '.js-follow': {
                click: (e) => {
                    const target = $(e.currentTarget);
                    const uid = target.data().uid;
                    const hasFollowed = target.hasClass("followed");

                    request({
                        method: 'post',
                        data: { uid },
                        url: hasFollowed ? '/member/unfollow' : '/member/follow'
                    }).then(() => {
                        target.toggleClass('followed');
                    }).catch((err) => {
                        console.error(err);
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

new App();
