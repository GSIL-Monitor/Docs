require('./index.less');

import url from 'url';
import request from 'request';
import { throttle } from 'lodash';
import Toast from '@wac/toast';

import UserTpl from './tpl/user.html?tpl';

const userListEl = $('.js-user-container');

class APP {
    constructor() {
        const parsed = url.parse(location.href, true);
        const lastIndexId = $('.hot-user').last().data('index');

        this.state = {
            lastIndexId: lastIndexId,
            tagId: parsed.query.tagId
        };

        this.init();
    }

    init() {
        this.bindScroll();
        this.bindEvents();
    }

    loadUsers() {
        if (this.loading || this.done) {
            return;
        }

        this.loading = true;

        const spinner = $('<div class="icon-spinner"></div>');

        spinner.appendTo(userListEl);

        const state = this.state;
        const { tagId, lastIndexId } = state;

        request({
            url: '/tag/member_list',
            data: {
                tagId,
                lastIndexId
            }
        }).then((ret) => {
            const data = ret.data || [];

            if (data.length > 0) {
                state.lastIndexId = data.slice(-1)[0].indexId;

                userListEl.append(UserTpl.render({
                    users: data
                }));
            }

            if (data.length == 0) {
                this.done = true;
                userListEl.append('<div class="m-no-more">没有更多了</div>');
            }

            // 触发懒加载
            window.lazyLoad();
        }).finally(() => {
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
                this.loadUsers();
            }

            lastScrollTop = scrollTop;
        }, 200));
    }

    bindEvents() {
        const el = $(document);

        const EVENTS = {
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

                        if (!hasFollowed) {
                            Toast('您将在“关注页”了解Ta的动态');
                        }
                    }).catch((err) => {
                        console.error(err);
                    });
                }
            },
        };

        $.each(EVENTS, (selector, events) => {
            $.each(events, (type, handler) => {
                el.on(type, selector, handler.bind(this));
            });
        });
    }

}
new APP();
