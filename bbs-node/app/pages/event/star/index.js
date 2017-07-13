require('./index.less');
import request from 'request';
import Toast from '@wac/toast';

class APP {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        const el = $(document);

        const EVENTS = {
            //关注
            '.js-follow': {
                click: (e) => {
                	e.preventDefault();
                    const target = $(e.currentTarget);
                    const uid = target.attr("uid");
                    const hasFollowed = target.hasClass('isFollowed');

                    request({
                        method: 'post',
                        data: { uid },
                        url: hasFollowed ? '/member/unfollow' : '/member/follow'
                    }).then(() => {
                        target.toggleClass('isFollowed');
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