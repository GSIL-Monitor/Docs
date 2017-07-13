import './index.less';
import { throttle } from 'lodash';
import request from 'request';
import PostTpl from './tpl/post.html?tpl';
const lessonsContainerEL = $('#lessons-container');

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
                this.loadLessonList();           
            }

            lastScrollTop = scrollTop;
        }, 200));
    }
    loadLessonList() {
        if (this.loading || this.done) {
            return;
        }
        this.loading = true;
        this.state.page++;
        const spinner = $('<div class="spinner-wrap"><div class="icon icon-spinner"></div></div>');
        spinner.appendTo(lessonsContainerEL);
        request({
            url: '/lesson/get_list',
            data: this.state
        }).then((ret) => {
            const lessonList = ret.data.lessonList;       
            if (lessonList.length == 0) {
                this.done = true;
                lessonsContainerEL.append('<div class="lesson-bottom"><span>触底，该反弹了！</span></div>');
                return;
            }
            //将拉取的数据插入dom中 
            lessonsContainerEL.append(PostTpl.render({
                posts: lessonList
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
            '.lessonListItem' : {
                click : (e) => {
                    const target = $(e.currentTarget);

                    Stat.send('stat', {
                        evt : 'lesson_course',
                        classID: that.state.cid,
                        index: $('#lessons-container .lessonListItem').index(target)
                    })
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

new APP();