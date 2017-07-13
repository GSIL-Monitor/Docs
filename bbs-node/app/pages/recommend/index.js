import './index.less';
import 'swiper/dist/css/swiper.css';

import Swiper from 'swiper';
import { throttle } from 'lodash';
import PostTpl from './tpl/post.html?tpl';
import request from 'request';
import reqwest from 'reqwest';
import url from 'url';

// 红包活动开关
import lottery from 'event/lottery';

const recommendListEL = $('#js-normal-recommend');

class APP {
    constructor() {
        const INIT_STATE = window.__INIT_DATA__;
        this.state = {
            ...INIT_STATE,
            recommendOpts: {
                lastTime: INIT_STATE.lastRecommendTime,
                pageSize: 20
            }
        };
        this.init();
    }

    init() {
        this.bindScroll();
        this.loadSlider();
        // this.cutPostContent();
        this.bindEvents();

        this.configEvts();

        // this.showEntrance();
        // 
        this.getMiscData();

        // 如果存在小红包
        if(lottery) {
            const parsed = url.parse(location.href,true,true);
            const platform = window.__INIT_DATA__.platform || parsed.query.platform || 70;
            lottery.showEntrance(platform);
        }
    }

    // 获取消息数量
    getMiscData () {
        request({
            url: '/recommend/get_misc_data'
        }).then((ret) => {
            if (ret.code == 0 && ret.data.notifyNum !== 0) {
                $('#J_miscData').show();
                $('#J_miscData > .main').text(`${ret.data.notifyNum}` + (ret.data.notifyNum === '99+' ? `` : `条`)  + `新消息`);
                $('#J_miscData').css('height', '4.55rem');
            }
        });
    }
    loadSlider() {
        if ($('.banners-container').length) {
            new Swiper('.banners-container', {
                speed: 500,
                loop: true,
                autoplay: 5000,
                lazyLoading: true,
                preloadImages: false,
                lazyLoadingInPrevNext: true,
                lazyLoadingInPrevNextAmount: 2,
                lazyLoadingOnTransitionStart: true,
                autoplayDisableOnInteraction: false,
                pagination: '.swiper-pagination'
            });
        }
    }

    //判断标题高度，截断内容摘要
    cutPostContent(page) {
        const cutEl = page ? $(".js-post-page" + page) : $(".recommend-post");
        cutEl.each(function(i, item) {
            if ($(item).find(".post-title").height() > 30) {
                $(item).find(".post-abstract").css("-webkit-line-clamp", "1");
            } else {
                $(item).find(".post-abstract").css("-webkit-line-clamp", "2");
            }
        })
    }

    loadRecommend(callback) {
        if (this.loading || this.done) {
            return;
        }

        this.loading = true;

        const recommendOpts = this.state.recommendOpts;
        const spinner = $('<div class="icon-spinner"></div>');

        const recommendIds = this.state.recommendIds;

        spinner.appendTo(recommendListEL);

        request({
            url: '/recommend/recommend_list',
            data: recommendOpts
        }).then((ret) => {
            const data = ret.data;
            if (data.length > 0) {
                recommendOpts.lastTime = data.slice(-1)[0].time;
                //去掉跟个性化推荐重复的帖子
                const list = data.filter((recommend) => {
                    return recommendIds.indexOf(recommend.tid) == -1;
                }).map((item) => {
                    if (item.picture || item.title.length > 18) {
                        item.lineClamp = 1;
                    } else {
                        item.lineClamp = 2;
                    }

                    return item;
                });

                recommendIds.push.apply(recommendIds, list.map((item) => {
                    return item.tid;
                }));

                recommendListEL.append(PostTpl.render({
                    items: list,
                    page: recommendOpts.lastTime
                }));

                // 触发懒加载
                window.lazyLoad();
            }

            if (data.length == 0) {
                this.done = true;
            }

            callback && callback();
        }).finally((err) => {
            spinner.remove();
            this.loading = false;
        });
    }

    bindScroll() {
        let lastScrollTop;

        const el = $(document);
        const body = document.body;

        el.on('scroll touchend', throttle((e) => {
            const scrollTop = body.scrollTop;

            if (scrollTop - lastScrollTop >= 0 &&
                scrollTop + window.innerHeight * 4 >= body.scrollHeight) {
                this.loadRecommend();
            }

            lastScrollTop = scrollTop;
        }, 200));
    }

    bindEvents() {
        const el = $(document);

        const EVENTS = {
            // 点击非猜你喜欢按钮区域隐藏弹出
            '#js-normal-recommend': {
                click: (e) => {
                    const target = $(e.target);

                    if (!target.hasClass('js-disinclination')) {
                        $('.js-disinclination').hide();
                    }
                }
            },

            //猜你喜欢
            '.js-personal-recommend': {
                click: (e) => {
                    e.stopPropagation();
                    const target = $(e.target);
                    $(target).next(".js-disinclination").toggle();
                }
            },
            //不感兴趣
            ".js-disinclination": {
                click: (e) => {
                    const target = $(e.target);
                    const post = target.parents(".js-recommend-post");

                    request({
                        url: "/recommend/disinclination",
                        data: { tid: target.data().tid }
                    });

                    post.next('.line').remove();
                    post.remove();
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
            },

            '.js-new-message': {
                click: (e) => {
                    e.preventDefault();

                    const href = e.currentTarget.href;

                    reqwest({
                        url: "/app/api/recommend/msg_clear"
                    }).then(() => {
                        location.href = href;
                    });

                    $(".js-new-message").remove();


                }
            },

            '.swiper-slide a': {
                click: (e) => {
                    const target = $(e.currentTarget);
                    const url = target.attr('href');
                    Stat.send('stat', {
                        targeturl: url
                    });
                }
            },

            '.qiantang-sdk': {
                click: (e) => {
                    Stat.send('stat', {
                        evt: 'sdk_homepage_ad',
                        platform: window.__INIT_DATA__.platform
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

    configEvts() {
        var that = this;
    }

}

window.wacClient_callback = () => {
    request({
        url: '/recommend/get_misc_data'
    }).then((ret) => {
        if (ret.code == 0 && ret.data.notifyNum !== 0) {
            $('#J_miscData > .main').text(`${ret.data.notifyNum}` + (ret.data.notifyNum === '99+' ? `` : `条`)  + `新消息`);
        } else {
            $('#J_miscData').hide();
            $('#J_miscData').css('height', 0);
        }
    });
};
new APP();
