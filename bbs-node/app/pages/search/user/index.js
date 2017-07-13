/**
 * @overview
 * @author cisong
 * @date 3/2/16
 */

import '../index/index.less';

import qs from 'querystring';
import request from 'request';

import StatusTpl from 'status';
import UserTpl from '../common/user.html?tpl';
import SearchTpl from '../common/search.html?tpl';
import HistoryTpl from '../common/history.html?tpl';

const closeIcon = $('.js-close');
const searchIpt = $('.js-search-input');
const searchForm = $('.js-search-form');
const popupHistory = $('.js-popup-history');
const searchResult = $('.js-search-result');
const notfoundElt = $('.js-not-found');

class App {
    constructor() {
        this.currPage = 1;
        this.keyword = '';

        this.init();
    }

    init() {
        this.bindEvents();

        var query = qs.parse(location.search.slice(1));

        this.keyword = query.keyword || '';

        if (query.keyword) {
            closeIcon.show();
        } else {
            searchIpt.trigger('focusin');
        }
    }

    bindEvents() {
        const el = $(document);
        const EVENTS = {
            // 删除搜索关键字
            '.js-close': {
                click: (e) => {
                    closeIcon.hide();
                    searchIpt.val('');
                    searchResult.empty();
                    notfoundElt.hide();
                }
            },

            // 提交搜索
            '.js-search-form': {
                submit: (e) => {
                    e.preventDefault();

                    let activeEl = document.activeElement;
                    let keyword = encodeURIComponent(searchIpt.val().trim());

                    if (!keyword) {
                        return;
                    }

                    keyword = keyword.slice(0, 100);

                    setTimeout(function () {
                        popupHistory.hide();
                    });
                    activeEl && activeEl.blur();

                    this.keyword = keyword;

                    searchResult.html(StatusTpl.render({
                        type: 'loading'
                    }));

                    request({
                        url: '/search/search_user',
                        data: {
                            keyword: keyword
                        }
                    }).then((res) => {
                        searchResult.html(SearchTpl.render({
                            posts: [],
                            page: 'user',
                            users: res.data || [],
                        }));
                        //搜索结果为空展示
                        if(res.data.length==0){
                            notfoundElt.show();
                        }else{
                            notfoundElt.hide();
                        }
                        // 触发懒加载
                        window.lazyLoad();
                    }).catch((err) => {
                        searchResult.html(StatusTpl.render({
                            error: err,
                            type: 'error'
                        }));
                    });
                }
            },

            // 加载更多
            '.js-more': {
                click: (e) => {
                    let target = $(e.currentTarget);
                    let userList = $('.js-user-list');

                    let keyword = this.keyword;
                    let currPage = this.currPage;

                    target.text('正在加载...');

                    request({
                        url: '/search/search_user',
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
                            var html = UserTpl.render({
                                users: data,
                            });

                            userList.append(html);
                        }

                        // 触发懒加载
                        window.lazyLoad();
                    });
                }
            },

            // 展示搜索历史
            '.js-search-input': {
                keydown: (e) => {
                    let keyword = e.target.value;

                    if (keyword.length > 100) {
                        e.preventDefault();
                    }
                },

                input: (e) => {
                    let keyword = e.target.value;

                    if (!keyword) {
                        searchIpt.trigger('focusin');
                        searchResult.empty();
                    }

                    closeIcon.toggle(!!keyword);
                },

                focusin: (e) => {
                    let keyword = searchIpt.val().trim();

                    if (keyword) {
                        return;
                    }

                    request({
                        url: '/search/query_history'
                    }).then((res) => {
                        let data = res.data;

                        if (data.length) {
                            popupHistory.html(HistoryTpl.render({
                                history: data
                            }));
                            popupHistory.show();
                        }
                    });
                }
            },

            // 清除搜索历史
            '.js-clear': {
                click: (e) => {
                    popupHistory.hide();

                    request({
                        method: 'post',
                        url: '/search/clear_history'
                    });
                }
            },

            // 选中关键词
            '.js-keyword': {
                click: (e) => {
                    let target = $(e.currentTarget);

                    searchIpt.val(target.text());
                    searchIpt.trigger('input');

                    searchForm.submit();
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
