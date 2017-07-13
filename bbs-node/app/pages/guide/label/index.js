import './index.less';

import request from 'request';

class App {
    constructor() {
        this.initFids = $('.checked').toArray().map((el) => {
            return $(el).data('fid');
        });

        this.init();
    }

    init() {
        this.bindEvents();

        // TODO
        // 修复返回当前页面客户端缓存
        // 从其他页面点击过来正常, 从关注页面返回则刷新
        const isFollow = localStorage.getItem('INIT_FOLLOW');

        if (isFollow === 'true') {
            location.reload();
            localStorage.removeItem('INIT_FOLLOW')
        }
    }

    bindEvents() {
        const el = $(document);

        const EVENTS = {
            // 选中取消版块
            '.js-block': {
                click: (e) => {
                    const target = $(e.currentTarget);

                    target.toggleClass('checked');
                }
            },

            '.js-btn': {
                click: () => {
                    const initFids = this.initFids;
                    const fids = $('.checked').toArray().map((el) => {
                        return $(el).data('fid');
                    });

                    // 增量
                    const add_fids = fids.filter((fid) => {
                        return initFids.indexOf(fid) == -1;
                    });

                    // 移除
                    const cancel_fids = initFids.filter((fid) => {
                        return fids.indexOf(fid) == -1;
                    });

                    request({
                        method: 'post',
                        data: {
                            fids: add_fids.join(','),
                            canel_tags : cancel_fids.join(',')
                        },
                        url: '/tag/save_tags'
                    }).then(() => {
                        location.href = '/app/guide/follow/?need_login=1&navTitle=关注几个好友';
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
