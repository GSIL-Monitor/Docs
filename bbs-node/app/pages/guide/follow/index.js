import './index.less';

import request from 'request';

class App {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();

        localStorage.setItem('INIT_FOLLOW', true);
    }

    bindEvents() {
        const el = $(document);

        const EVENTS = {
            // 关注、取消关注
            '.js-follow': {
                click: (e) => {
                    $(e.currentTarget).toggleClass('followed');
                }
            },
            '.js-btn': {
                click: (e) => {
                    const uidsArr = [];
                    $('.js-follow').each((e, follow) => {
                        if(follow.className.indexOf('followed') !== -1) {
                            uidsArr.push(follow.getAttribute('data-uid'));
                        }
                    });
                    const uids = uidsArr.join(',');
                    request({
                        method: 'post',
                        data: {uids},
                        url: '/member/batch_follow'
                    }).then(() => {
                        location.href = 'wacai://close';
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
