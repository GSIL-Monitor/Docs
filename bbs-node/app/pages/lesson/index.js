import './index.less';
import 'swiper/dist/css/swiper.css';
import Swiper from 'swiper';
import request from 'request';

class APP{
	constructor() {
        this.init();
    }
    init() {
        this.bindEvents();
        this.loadSlider();
    }
    loadSlider() {
        if ($('.banners-container').length) {
            const isLoop = !!$('.swiper-pagination').length;
            new Swiper('.banners-container', {
                speed: 500,
                loop: isLoop,
                autoplay: 5000,
                lazyLoading: true,
                preloadImages: false,
                lazyLoadingInPrevNext: true,
                lazyLoadingInPrevNextAmount: 2,
                lazyLoadingOnTransitionStart: true,
                autoplayDisableOnInteraction: false,
                pagination: '.swiper-pagination'
            });
        }
    }

    bindEvents() {
        const el = $(document);

        const EVENTS = {
            '.swiper-slide a': {
                click: (e) => {
                    const target = $(e.currentTarget);
                    const key = target.data('key');
                    Stat.send('stat', {
                        evt: 'lesson_banner',
                        index: key
                    });
                }
            },
            '.les-item': {
                click: (e) => {
                    const target = $(e.currentTarget);
                    const cid = target.data('cid');
                    Stat.send('stat', {
                        evt: 'lesson_class',
                        classID: cid
                    });
                }
            },
            '.lessonListItem' : {
                click : (e) => {
                    const target = $(e.currentTarget);
                    const cid = target.data('cid');
                    const index = target.data('index');

                    Stat.send('stat', {
                        evt : 'lesson_sort_course',
                        classID: cid,
                        index
                    })
                }
            },
            '.more-lesson': {
                click: (e) => {
                    const target = $(e.currentTarget);
                    const cid = target.data('cid');

                    Stat.send('stat', {
                        evt : 'lesson_sort_more',
                        classID: cid,
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