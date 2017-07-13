require('./index.less');

import { throttle } from 'lodash';
import UserTpl from './tpl/user.html?tpl';
import request from 'request';
import Toast from '@wac/toast';

const userListEl = $(".js-user-container");
const nomoreEl = $(".no-more");

class APP {
    constructor() {
        this.page = 1;
        this.init();
    }

    init() {
        this.state = window.__INIT_DATA__;
        this.bindScroll();
        this.bindEvents();
        if (this.state.uids.length == 0) {
            this.done = true;
        }
    }

    loadHotUsers() {
        if (this.loading || this.done) {
            return;
        }
        this.loading = true;
        const spinner = $('<div class="icon-spinner"></div>');

        const self = this;

        spinner.appendTo(userListEl);

        request({
            url: '/hotusers/userlist',
            data: { page: ++this.page }
        }).then((ret) => {

            const data = ret.data;
            let users;
            if (data.length > 0) {
                users = data.filter(function(user) {
                    return self.state.uids.indexOf(user.uid) == -1;
                });

                userListEl.append(UserTpl.render({
                    users: users
                }));

                // 触发懒加载
                window.lazyLoad();
            }
            if (data.length == 0) {
                nomoreEl.show();
                this.done = true;
            }
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
                this.loadHotUsers();
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
