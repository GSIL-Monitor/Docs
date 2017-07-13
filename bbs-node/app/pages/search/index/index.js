/**
 * @overview
 * @author cisong
 * @date 3/2/16
 */

import './index.less';

import request from 'request';

import StatusTpl from 'status';
import PostTpl from '../common/post.html?tpl';
import SearchTpl from '../common/search.html?tpl';
import HistoryTpl from '../common/history.html?tpl';

import formatter from 'formatter';

const closeIcon = $('.js-close');
const searchIpt = $('.js-search-input');
const searchForm = $('.js-search-form');
const popupHistory = $('.js-popup-history');
const searchResult = $('.js-search-result');
const notfoundElt = $('.js-not-found');

const isQiantang = window.__INIT_DATA__.isQianTang;

class App {
    constructor() {
        this.currPage = 1;
        this.keyword = '';

        this.init();
    }

    init() {
        this.bindEvents();
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

                    setTimeout(function() {
                        popupHistory.hide();
                        notfoundElt.hide();
                    });

                    activeEl && activeEl.blur();

                    this.keyword = keyword;



                    searchResult.html(StatusTpl.render({
                        type: 'loading'
                    }));

                    request({
                        url: '/search/search_default',
                        data: {
                            keyword: keyword
                        }
                    }).then((res) => {
                        const data = res.data;
                        const users = data.searchUserV1List || [];
                        let posts = data.searchPostV1List || [];

                        if (posts.length) {
                            posts.forEach((ele) => {
                                ele.replies = formatter.number2W(ele.replies);
                                ele.likes = formatter.number2W(ele.likes);
                            })
                        }

                        searchResult.html(SearchTpl.render({
                            users: users,
                            posts: posts,
                            keyword: keyword,
                            isQiantang,
                        }));

                        //搜索结果为空展示
                        if (users.length == 0 && posts.length == 0) {
                            notfoundElt.show();
                        }
                        // 触发懒加载
                        window.lazyLoad();

                    }).catch((err) => {
                        let errMsg = '';
                        if (err instanceof XMLHttpRequest && err.readyState === 4) {
                             if (err.status !== 200) {
                                errMsg = '啊哦，网络有点不给力'
                            }
                        }
                        
                        searchResult.html(StatusTpl.render({
                            error: errMsg || err,
                            type: 'error'
                        }));
                    });
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

                        if (data.length) {
                            data.forEach((ele) => {
                                ele.replies = formatter.number2W(ele.replies);
                                ele.likes = formatter.number2W(ele.likes);
                            })
                        }

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
                        let data = res.data || [];

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