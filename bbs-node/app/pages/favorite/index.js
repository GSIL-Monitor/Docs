import './index.less';
import { throttle } from 'lodash';
import request from 'request';
import PostTpl from './tpl/post.html?tpl';
import EmptyTpl from './tpl/empty.html?tpl';
const favoriteContainerEL = $('#favorite-container');

class APP{
	constructor() {
        const INIT_STATE = window.__INIT_DATA__;
        this.state = INIT_STATE;
        this.init();
    }
    init() {
        this.bindScroll();
        this.bindEvents();
    }
    bindScroll() {
        let lastScrollTop;
        const el = $(document);
        const body = document.body;       
        el.on('scroll touchend', throttle((e) => {
            const scrollTop = body.scrollTop;           
            if (scrollTop - lastScrollTop >= 0 &&
                scrollTop + window.innerHeight * 4 >= body.scrollHeight) {
                this.loadFavList();           
            }

            lastScrollTop = scrollTop;
        }, 200));
    }
    loadFavList() {
        if (this.loading || this.done) {
            return;
        }
        this.loading = true;
        this.state.page++;
        const spinner = $('<div class="spinner-wrap"><div class="icon icon-spinner"></div></div>');
        spinner.appendTo(favoriteContainerEL);
        request({
            url: '/favorite/get_my_favlist',
            data: this.state
        }).then((ret) => {
            const favList = ret.data;
            if (favList.length == 0) {
                this.done = true;
                favoriteContainerEL.append('<div class="listViewDone"><span class="wux-divider"><span>我是有底线的</span></span></div>');
                return;
            }
            //将拉取的数据插入dom中 
            favoriteContainerEL.append(PostTpl.render({
                posts: favList
            }));
            // 触发懒加载
            window.lazyLoad();           
        }).finally((err) => {
            spinner.remove();
            this.loading = false;
        });
    }

    bindEvents() {
        const el = $(document);
        const that = this;

        const EVENTS = {
         
        };

        $.each(EVENTS, (selector, events) => {
            $.each(events, (type, handler) => {
                el.on(type, selector, handler.bind(this));
            });
        });
    }  
}

new APP();