/**
 * @overview
 * @author cisong
 * @date 3/2/16
 */

import './index.less';

import request from 'request';

import ItemTpl from './tpl/item.html?tpl';

const listEl = $('.js-list');

class App {
    constructor() {
        this.pageNo = 2;
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        const body = document.body;
        const el = $(document);

        const EVENTS = {
            // 重置消息未读
            '.js-message': {
                click: (e) => {
                    const target = $(e.currentTarget);
                    const dot = target.find('.icon-dot');

                    if (dot.length) {
                        dot.remove();
                    }
                }
            },

            // 重置消息数量
            '.js-item': {
                click: (e) => {
                    const target = $(e.currentTarget);
                    const type = target.attr('data-type');
                    const count = target.find('.count');

                    if (!count.length) {
                        return;
                    }

                    if (!type) {
                        return count.remove();
                    }

                    count.hide();

                    // request({
                    //     method: 'POST',
                    //     url: '/message/reset_follow'
                    // }).then((res) => {
                    //     if (res.code == 0 && res.data) {
                    //         count.remove();
                    //     } else {
                    //         return Promise.reject();
                    //     }
                    // }).catch(() => {
                    //     count.show();
                    // });
                }
            },

            // 加载更多
            '.js-more': {
                click: (e) => {
                    let target = $(e.currentTarget);
                    let postList = $('.js-post-list');

                    let keyword = this.keyword;
                    let currPage = this.currPage;

                    target.text('正在加载...');

                    request({
                        url: '/search/search_post',
                        data: {
                            keyword: keyword,
                            currPage: currPage + 1
                        }
                    }).then((res) => {
                        this.currPage++;

                        let data = res.data || [];

                        if (data.length < 15) {
                            target.hide();
                        } else {
                            target.html('加载更多<i class="icon icon-arrow"></i>');
                        }

                        if (data.length) {
                            const html = PostTpl.render({
                                posts: data
                            });

                            postList.append(html);
                        }
                    });
                }
            }
        };

        $.each(EVENTS, (selector, events) => {
            $.each(events, (type, handler) => {
                el.on(type, selector, handler.bind(this));
            });
        });

        const count = parseInt(listEl.data('count'), 10);

        if (count !== 15) {
            return;
        }

        let done = false;
        let loading = false;

        $(document).on('scroll touchend', (e) => {
            if (!done && !loading && body.scrollTop + window.innerHeight > body.scrollHeight - 50) {
                loading = true;

                const loadingEl = $('<div class="loading"><i class="icon icon-spinner"></i>正在加载...</div>');

                loadingEl.appendTo(listEl);

                // fix loading el visible
                body.scrollTop = body.scrollHeight;

                request({
                    url: '/message/query_inbox',
                    data: {
                        pageNo: this.pageNo
                    }
                }).then((res) => {
                    this.pageNo++;

                    let data = res.data || [];

                    loadingEl.remove();

                    if (data.length < 15) {
                        done = true;
                    }

                    if (data.length) {
                        listEl.append(ItemTpl.render({
                            items: data
                        }));
                    }

                    // 触发懒加载
                    window.lazyLoad();
                }).finally(() => {
                    loading = false;
                });
            }
        });
    }
}

new App();
