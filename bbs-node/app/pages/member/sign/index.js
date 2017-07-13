/**
 * @overview
 * @author cisong
 * @date 3/2/16
 */

import './index.less';

import url from 'url';
import qs from 'querystring';
import request from 'request';
import Toast from '@wac/toast';
import wxShare from '@wac/wechat-share';

import DialogTpl from './tpl/dialog.html?tpl';
import RankingTpl from './tpl/rank.html?tpl';

// preload background image
// new Image().src = require('./img/background.png');
var weChatTips = require('./img/wxtip.png');
// new Image().src = weChatTips;

const shareCopper = $('[name=shareCopper]').val();

class App {
    constructor() {
        this.state = {};
        this.init();
    }

    init() {
        this.initRecommend();
        this.initRanking();
        this.initJsBridge();

        this.bindEvents();
    }

    initRecommend() {
        this.recommendPromise = request({
            url: '/common/recommend_post'
        }).then((ret) => {
            const data = ret.data;
            const parsed = url.parse(data.url, true, true);
            const query = parsed.query;

            query.popup = 1;
            query.need_zinfo = 1;
            query.source = 'qiandao';

            parsed.protocol = location.protocol;

            delete parsed.search;

            data.url = parsed.format();

            return ret.data;
        }).catch((err) => {
            console.error(err);
        });
    }

    initRanking() {
        const rankingEl = $('#js-ranking');

        request({
            url: '/member/sign_ranking'
        }).then((ret) => {
            const data = ret.data;

            data.forEach((item, index) => {
                index++;
                item.rankingText = (index < 10 ? '0' : '') + index;
            });

            rankingEl.html(RankingTpl.render({
                items: data
            }));
        }).catch((err) => {
            console.error(err);
        });
    }

    initJsBridge() {
        this.bridgePromise = new Promise((resolve) => {
            if (window.WebViewJavascriptBridge) {
                resolve(WebViewJavascriptBridge);
            } else {
                document.addEventListener('WebViewJavascriptBridgeReady', function () {
                    resolve(WebViewJavascriptBridge)
                }, false);
            }
        }).then((bridge) => {
            bridge.init(function (data, sendResponse) {
                console.log('message form client');
            });

            return bridge;
        }).catch((err) => {
            return Promise.resolve();
        });
    }

    showRecommendDialog(options) {
        const shareEl = $('.js-recommend');
        const isShare = shareEl.attr('data-share') == 'true';

        this.recommendPromise.then((post) => {
            $(DialogTpl.render({
                ...post,
                ...options,
                isShare,
                shareCopper
            })).appendTo('body');
        });
    }

    sharePost() {
        const agent = window.navigator.userAgent.toLowerCase();

        // 微信分享处理
        if(agent.match(/MicroMessenger/i)){
            $('.m-dialog').remove();
            return this.recommendPromise.then((post) => {
                return new Promise((resolve, reject) => {
                    const parsed = url.parse(post.url, true, true);

                    // 处理地址协议为 //
                    parsed.protocol = location.protocol;

                    const shareData = {
                        link: parsed.format(),
                        title: post.title,
                        desc: post.summary,
                        wechatTips: weChatTips,
                        imgUrl: 'https://s1.wacdn.com/wis/118/2f199d7341ca5fe7_100x100.png',
                        success: resolve
                    };

                    wxShare.share(shareData);
                });
            });
        }

        return Promise.all([this.recommendPromise, this.bridgePromise]).then(([post, bridge]) => {
            return new Promise((resolve, reject) => {
                // 不支持 jsbridge
                if (!bridge) {
                    return reject();
                }

                bridge.send(JSON.stringify({
                    action: 'isSupport',
                    params: {
                        method: 'share'
                    }
                }), function (isSupportShare) {
                    if (isSupportShare === 'true') {
                        resolve();
                    } else {
                        reject();
                    }
                });
            }).then(() => {
                return new Promise((resolve, reject) => {
                    const action = {
                        action: 'share',
                        params: {
                            shareType: 2,
                            url: post.url,
                            title: post.title,
                            description: post.summary,
                            sharestyle: 1,
                            imgurl: 'https://s1.wacdn.com/wis/118/2f199d7341ca5fe7_100x100.png'
                        }
                    };

                    bridge.send(JSON.stringify(action), (ret) => {
                        ret = JSON.parse(ret);

                        if (ret.code == 0) {
                            return resolve();
                        }

                        reject(ret);
                    });
                });
            }, () => {
                const iframe = document.createElement('iframe');
                const paramsString = qs.stringify({
                    type: 2,
                    url: post.url,
                    title: post.title,
                    description: post.summary,
                    imgurl: 'https://s1.wacdn.com/wis/118/2f199d7341ca5fe7_100x100.png'
                });

                iframe.style.display = 'none';
                iframe.src = 'wacai://share?' + paramsString;

                document.body.appendChild(iframe);

                return Promise.resolve().delay(2000);
            });
        });
    }

    bindEvents() {
        const body = document.body;
        const el = $(document);

        const EVENTS = {
            // tabs
            '.js-tab': {
                click: (e) => {
                    const target = $(e.currentTarget);
                    const tabSelector = target.data('to');

                    $('.tab').removeClass('active');
                    target.addClass('active');

                    $('.tab-content').hide();
                    $(tabSelector).show();

                    // 触发懒加载
                    window.lazyLoad();
                }
            },

            // 签到
            '.js-sign-btn': {
                click: (e) => {
                    const target = $(e.currentTarget);

                    request({
                        method: 'post',
                        url: '/member/sign'
                    }).then((ret) => {
                        target.addClass('disabled');

                        const increase = ret.data || 0;
                        const creditEl = $('#js-credit');
                        const current = parseInt(creditEl.text(), 10);

                        creditEl.text(current + increase);

                        $('.current').addClass('active');

                        $('.js-next-sign').removeClass('hide');
                        $('.js-current-sign').addClass('hide');

                        this.showRecommendDialog({increase});
                    });
                }
            },

            // 分享到朋友圈
            '.js-share-btn': {
                click: (e) => {
                    const shareEl = $('.js-recommend');
                    const isShare = shareEl.attr('data-share') == 'true';

                    this.sharePost().then(() => {
                        $('.m-dialog').remove();

                        if (isShare) {
                            return;
                        }

                        request({
                            method: 'post',
                            url: '/member/share_post'
                        }).then((ret) => {
                            const increase = ret.data || 0;

                            if (increase == 0) {
                                return;
                            }

                            const creditEl = $('#js-credit');
                            const current = parseInt(creditEl.text(), 10);

                            creditEl.text(current + increase);

                            Toast(`分享成功！获得 ${increase} 铜钱`);

                            shareEl.attr('data-share', true);
                        }).catch((err) => {
                            console.error(err);
                        });
                    }).catch((ret) => {
                        Toast(ret.error || '分享失败');
                    });
                }
            },

            // 点击今日推荐
            '.js-recommend': {
                click: (e) => {
                    this.showRecommendDialog();
                }
            },

            // 关闭弹窗
            '.js-close': {
                click: (e) => {
                    $('.m-dialog').remove();
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
