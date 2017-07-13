/**
 * @overview 消息首页
 * @author cisong
 * @date 3/18/16
 */

import './index.less';

import request from 'request';

import ItemTpl from './tpl/item.html?nunjucks';

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
        const count = parseInt(listEl.data('count'), 10);

        $(document).on('click', '.js-reply', (e) => {
            const tagName = e.target.tagName.toLowerCase();
            const target = $(e.currentTarget);
            const replyUrl = target.data('reply-url');

            if (tagName !== 'a' && tagName !== 'p') {
                location.href = replyUrl;
            }
        });

        if (count !== 15) {
            return;
        }

        let done = false;
        let loading = false;

        $(document).on('scroll touchmove touchend', (e) => {
            if (!done && !loading && body.scrollTop + window.innerHeight > body.scrollHeight - 50) {
                loading = true;

                const loadingEl = $('<div class="loading"><i class="icon icon-spinner"></i>正在加载...</div>');

                loadingEl.appendTo(listEl);

                // fix loading el visible
                body.scrollTop = body.scrollHeight;

                request({
                    url: '/message/query_like',
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
