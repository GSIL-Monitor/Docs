import './index.less';
import pktTpl from './tpl/new-year.html?tpl';

const newYear = {
    showEntrance() {

        const startTime = 1485478800000; //2017年1月27日 9:00
        const endTime = 1485565200000;//2017年1月28日 9:00
        const now = new Date().getTime();
        if (now < startTime || now > endTime) {
            return;
        }
        $(document.body).append(pktTpl.render());
        $('.winter-lottery').removeClass('hide');
        $('.winter-lottery').addClass('show');
        setTimeout(()=>{
            $('.winter-lottery').removeClass('show');
        }, 6000);
        this.bindEvents();
    },
    select() {
        let page;
        switch(location.pathname) {
            case '/app/recommend':
                page = 'recommend';
                break;
            case '/app/thread':
                page = 'thread';
                break;
            default:
                return false;
        }
        return page;
    },
    bindEvents() {
        const el = $(document);
        var that = this;
        const EVENTS = {
            '.winter-lottery': {
                click: (e) => {
                    var page = this.select()

                    if(e.currentTarget.className === 'winter-lottery show'){
                        location.href = 'https://site.wacai.com/page/2269?popup=1&wacaiClientNav=0';
                        if(page == 'recommend') {
                            Stat.send('stat', {
                                evt: 'tj_redenv'
                            });
                        }else if(page == 'thread'){
                            Stat.send('stat', {
                                evt: 'threaddetail_redenv'
                            });
                        }
                    } else {
                        e.currentTarget.className = 'winter-lottery show';
                        if(page == 'recommend') {
                            Stat.send('stat', {
                                evt: 'tj_redenv_half'
                            });
                        }else if(page == 'thread'){
                            Stat.send('stat', {
                                evt: 'threaddetail_redenv_half'
                            });
                        }

                        setTimeout(()=>{
                            $('.winter-lottery').removeClass('show');
                        }, 6000);
                    }
                }
            }
        };
        $.each(EVENTS, (selector, events) => {
            $.each(events, (type, handler) => {
                el.on(type, selector, handler.bind(this));
            });
        });
    }


};

export default newYear;
