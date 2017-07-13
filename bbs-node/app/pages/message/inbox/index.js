/**
 * @overview 消息首页
 * @author cisong
 * @date 3/18/16
 */

import './index.less';

import Toast from '@wac/toast';
import moment from 'moment';
import request from 'request';
import escape from 'escape-html';

import ItemTpl from './tpl/item.html?tpl';

const body = document.body;
const initEl = $('#js-init-data');
const textEl = $('#js-text');
const sendEl = $('#js-send');
const listEl = $('.js-message');

if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'){
     const vconsole = require('vconsole');
}

class App {
    constructor() {
        this.init();
    }

    init() {
        // scroll bottom
        body.scrollTop = body.scrollHeight;

        this.initData = JSON.parse(initEl.val());

        this.bindEvents();

        setTimeout(() => {
            // $('.m-message-warning').addClass('m-message-warning-hide');
        }, 5000);
    }

    bindEvents() {
        const el = $(document);

        const EVENTS = {
            '#js-text': {
                'keydown paste': (e) => {
                    const key = e.which;
                    const target = e.target;
                    const text = target.innerText;

                    if (key != 8 && key != 46 && text.length > 250) {
                        e.preventDefault();
                    }
                },

                'input': (e) => {
                    const target = e.target;

                    if (!target.textContent) {
                        sendEl.addClass('disabled');
                    } else {
                        sendEl.removeClass('disabled');
                    }
                },
                'focusin': (e) => {
                    setTimeout(() => {
                        document.body.scrollTop = document.body.scrollHeight;
                    }, 300);
                }
            },

            '#js-send': {
                click: () => {
                    const initData = this.initData;
                    const lastMessage = initData.messages.slice(-1)[0] || {};
                    const currentUser = initData.users[initData.currentUid];
                    const targetUid = initData.targetUid;

                    const message = textEl[0].innerText.trim();

                    if (message.length > 250) {
                        return Toast('输入超出250个字符!');
                    }

                    if (message.length == 0) {
                        return Toast('输入内容不能为空');
                    }

                    sendEl.addClass('disabled');

                    request({
                        method: 'post',
                        url: '/message/send_message',
                        data: {
                            targetUid, message
                        }
                    }).then((ret) => {
                        textEl.text('');

                        const time = moment().format('MM-DD');
                        const messageItem = Object.assign({}, currentUser, {
                            time: time,
                            message: escape(message),
                            hideTime: time == lastMessage.time
                        });

                        initData.messages.push(messageItem);

                        const html = ItemTpl.render(Object.assign({}, initData, {
                            messages: [messageItem]
                        }));

                        listEl.append(html);

                        body.scrollTop = body.scrollHeight;
                    }).catch((err) => {
                        console.error(err);
                    }).finally(() => {
                        sendEl.removeClass('disabled');
                    });
                }
            }
        };

        $.each(EVENTS, (selector, events) => {
            $.each(events, (type, handler) => {
                el.on(type, selector, handler.bind(this));
            });
        });

        const initData = this.initData;
        const count = parseInt(listEl.data('count'), 10) || 0;

        if (count !== 15) {
            return;
        }

        let done = false;
        let loading = false;

        $(document).on('scroll touchend', (e) => {
            if (!done && !loading && body.scrollTop < 50) {
                loading = true;

                const firstMessage = initData.messages[0];
                const loadingEl = $('<div class="loading"><i class="icon icon-spinner"></i>正在加载...</div>');

                loadingEl.prependTo(listEl);

                request({
                    url: '/message/query_message',
                    data: {
                        dataPoint: -1,
                        targetUid: initData.targetUid,
                        msgTime: firstMessage.timestamp
                    }
                }).then((ret) => {
                    const data = ret.data;
                    const messages = data.messages;

                    if (messages.length < 15) {
                        done = true;
                    }

                    if (messages.length) {
                        listEl.prepend(ItemTpl.render(data));
                        initData.messages = messages.concat(initData.messages);
                    }

                    // 触发懒加载
                    window.lazyLoad();
                }).finally(() => {
                    loading = false;
                    loadingEl.remove();
                });
            }
        });
    }
}

new App();
