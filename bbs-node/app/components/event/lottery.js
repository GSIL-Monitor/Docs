import './index.less';
import request from 'request';
import Cookie from 'cookie';
import pktTpl from './tpl/piaodai.html?tpl';

if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'){
     const vconsole = require('vconsole');
}

const lottery = {

    showEntrance(platform) {
 
        request({
            url: '/piaodai/get_active',
            data: {
                type:0,
                platform
            }
        }).then((ret) => {
            if(ret.code == 0) {
                $(document.body).append(pktTpl.render(ret));
                $('#redPacket').addClass('show');

            }
        })
        .catch((err, msg) => {
            console.log(err);
        });

        this.bindEvents();
    },
  
  
    bindEvents() {
        const el = $(document);
        var that = this;
        const EVENTS = {
            // 点击关闭红包，cookie有效期到第二天凌晨
            '#hidePacket': {
                click: (e) => {
                    e.preventDefault();
                    
                    // 点击关闭发送埋点
                    Stat.send('stat', {
                        evt: 'operation_ad_close',
                        page: location.pathname
                    });

                    $('.packet').removeClass('show');
                }
            },
            '.packetPic' : {
                click: () => {
                    // 点击链接发送埋点
                    Stat.send('stat', {
                        evt: 'operation_ad_click',
                        page: location.pathname
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
};

export default lottery;
