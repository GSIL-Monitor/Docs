/**
 * @overview
 * @author cisong
 * @date 6/1/16
 */

import './index.less';

import url from 'url';
import request from 'reqwest';
import Toast from '@wac/toast';

const reasonsList = $('.js-reason');

class App {
    constructor() {
        this.init();
    }

    init() {
        this.initJsBridge();
        this.bindEvents();
    }

    doReport() {
        const query = url.parse(location.href, true).query;
        const data = {
            tid: query.tid,
            pid: query.pid,
            api: 'MobileUserReport',
            message: $('.selected').text()
        };

        request({
            type: 'json',
            method: 'post',
            url: '/api/services/index.php',
            data: data
        }).then((ret) => {
            Toast('提交成功', 500, () => {
                location.href = 'wacai://close';
            });
        }).catch((err) => {
            console.error(err);
        });
    }

    initJsBridge() {
        new Promise((resolve) => {
            if (window.WebViewJavascriptBridge) {
                resolve(WebViewJavascriptBridge);
            } else {
                document.addEventListener('WebViewJavascriptBridgeReady', function () {
                    resolve(WebViewJavascriptBridge)
                }, false);
            }
        }).then((bridge) => {
            bridge.init((message, sendResponse) => {
                const data = JSON.parse(message);

                if (data.action === 'report') {
                    if ($('.selected').length) {
                        this.doReport();
                    }
                }
            });

            const menuJson = {
                action: 'customClientNavButton',
                params: {
                    data: [{
                        text: '提交',
                        message: {
                            action: 'report'
                        }
                    }]
                }
            };

            bridge.send(JSON.stringify(menuJson));

            return bridge;
        }).catch((err) => {
            return Promise.resolve();
        });
    }

    bindEvents() {
        const el = $(document);

        const EVENTS = {
            // 选中原因
            '.js-reason': {
                click: (e) => {
                    const target = $(e.currentTarget);

                    reasonsList.removeClass('selected');
                    target.addClass('selected');
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
