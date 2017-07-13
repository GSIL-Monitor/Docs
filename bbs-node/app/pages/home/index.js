import './index.less';

import Fmover from 'finger-mover'
import simulationScrollX from 'simulation-scroll-x'
import request from 'request';
import util from '@finance/util';
import formatter from 'formatter';
import { throttle } from 'lodash';
import PostTpl from './tpl/post.html?tpl';
if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'){
     const vconsole = require('vconsole');
}
import {
  connect
} from '@wac/bridge-utils';

class APP {
	constructor() {

		const INIT_STATE = window.__INIT_DATA__;

        this.state = {
            ...INIT_STATE,
            postOpts: {
                uid: util.getUrlQuery('uid'),
                lastPostTime: INIT_STATE.lastPostTime,
                pageSize: 20
            }
        };

        this.init();

        window.lazyLoad()
	}

    init() {
        //this.initBridge();
        this.scroller()
        this.bindScroll()
        this.bindEvents();
	}

    initBridge() {
        connect(bridge => {
            bridge.isSupport('setNavBar')
                .then(isSupport => {
                    console.log(`isSupport bridge ${isSupport}`)
                    bridge.setNavBar({
                        theme: 'white',
                        backgroundColor: '#e2d3cd'
                    })
                })
                .catch(err => {
                    console.log(err);
                });
        });   
    }

	bindScroll() {
        if(!$('#js-postListView').length) return;

        let lastScrollTop;

        const el = $(document);
        const body = document.body;

        el.on('scroll', throttle((e) => {
            const scrollTop = body.scrollTop;

            if (scrollTop - lastScrollTop >= 0 &&
                scrollTop + window.innerHeight * 4 >= body.scrollHeight) {
                this.loadPosts();
            }

            lastScrollTop = scrollTop;
        }, 200));
    }

    loadPosts(callback) {
        if (this.loading || this.done) {
            return;
        }

        this.loading = true;

        const postListView = $('#js-postListView');

        const postOpts = this.state.postOpts;
        const spinner = $('<div class="icon-spinner"></div>');

        spinner.appendTo(postListView);

        request({
            url: '/home/more_post',
            data: postOpts
        }).then((ret) => {
            const data = ret.data;

            if (data.length > 0) {
                postOpts.lastPostTime = data.slice(-1)[0].postTime;
                
                const list = data.map((post) => {
                    post.friendTime = formatter.friendlyTime(post.postTime * 1000);

                    post.likes = formatter.number2W(post.likes);
                    post.replies = formatter.number2W(post.replies);

                    // 区分无标题和有标题展示区别
                    if (!post.subject) {
                        post.lineClamp = 2;
                    } else {
                        post.lineClamp = 1;
                    }

                    return post;
                })

                postListView.append(PostTpl.render({
                    items: list,
                    page: postOpts.lastPostTime
                }));

                // 触发懒加载
                window.lazyLoad();
            }else if (data.length == 0) {
                // 数据已加载完毕
                this.done = true;

                postListView.append(PostTpl.render({
                    items: []
                }));
            }
        }).finally((err) => {
            spinner.remove();
            this.loading = false;
        });
    }

	scroller() {

		if(!$('#groupContent').length) return;

		const len = $('#Scroller .figure').length;
		const fItem = $('#Scroller .figure').first();
		const iW = fItem.outerWidth(true);

		const mw =  $('#Scroller .more').length ? 
					$('#Scroller .more').outerWidth(true) : 0

        const ww = len * iW + mw;
		$('#Scroller').css({
			width: ww + 10
		});

        let fm = new Fmover({
            el: '#Scroller',
            plugins: [
                simulationScrollX({
                    scrollBar: false
                }),
            ]
        })
	}

    bindEvents() {
        const el = $(document);

        const EVENTS = {
            // 关注
            '.js-follow': {
                click: (e) => {
                    e.preventDefault();
                    const target = $(e.currentTarget);

                    Stat.send('stat', {
                        evt: 'myprofile_hishome_click_attention'
                    });
                    // if(target.hasClass('flag')) return;
                    // target.addClass('flag');

                    const uid = target.attr("uid");
                    const hasFollowed = target.hasClass('isFollowed');

                    request({
                        method: 'post',
                        data: { uid },
                        url: hasFollowed ? '/member/unfollow' : '/member/follow'
                    }).then(() => {
                        target.toggleClass('isFollowed');
                        target.removeClass('flag');
                    }).catch((err) => {
                        target.removeClass('flag');
                        console.error(err);
                    });
                }
            },
            '#js-new-post': {
                click: (e) => {
                    e.preventDefault();

                    Stat.send('stat', {
                        evt: 'myprofile_myhome_guide_post'
                    });

                    connect(bridge => {
                        bridge.isSupport('bbsForumDiscuss')
                            .then(isSupport => {
                                console.log(isSupport);
                                bridge.bbsForumDiscuss({
                                    type: 3,
                                    plateID: ''
                                });
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    });
                }
            },

            // 浏览用户头像大图
            '#js-view-avatar': {
                click: (e) => {
                    const img = e.currentTarget;

                    Stat.send('stat', {
                        evt: 'myprofile_large_portrait'
                    });

                    connect(bridge => {
                        bridge.isSupport('browseImage')
                            .then(isSupport => {
                                var avatarOrig = $(img).attr('data-img');

                                if(avatarOrig.indexOf('http') == '-1'){
                                    avatarOrig = (document.location.protocol+avatarOrig);
                                }

                                const urlList = [];
                                urlList.push(avatarOrig);
                                const current = 0;                                
                                bridge.browseImage({
                                    urlList,
                                    current
                                });
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    });
                }
            },

            '.figure': {
                'click': (e) => {
                    const target = $(e.currentTarget);
                    const index = target.data('index')
                    const id = target.attr('id');

                    Stat.send('stat', {
                        evt: 'myprofile_group',
                        index: index,
                        tagId: id
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

new APP();