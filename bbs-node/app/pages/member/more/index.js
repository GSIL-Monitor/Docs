/**
 * @overview 消息首页
 * @author cisong
 * @date 3/18/16
 */

import './index.less';

import url from 'url';
import qs from 'querystring';

const searchIcon = require('./img/search.png');

class App {
    constructor() {
        this.init();
    }

    init() {
        this.isLogin = !!$('[name=uid]').val();

        this.initJsBridge();
        this.bindEvents();

        // 返回到更多页面强制刷新
        window.wacClient_callback = () => {
            location.reload();
        }
    }

    initJsBridge() {
        this.bridgePromise = new Promise((resolve) => {
            if (window.WebViewJavascriptBridge) {
                resolve(WebViewJavascriptBridge);
            } else {
                document.addEventListener('WebViewJavascriptBridgeReady', function () {
                    resolve(WebViewJavascriptBridge)
                }, false);
            }
        }).then((bridge) => {
            bridge.init(function (message, sendResponse) {
                var data = JSON.parse(message);

                if (data.action == 'search') {
                    location.href = '/app/search/?popup=1';
                }
            });

            var menuJson = {
                action: 'customClientNavButton',
                params: {
                    data: [{
                        iconUrl: location.protocol + searchIcon,
                        message: {
                            action: 'search'
                        }
                    }]
                }
            };

            bridge.send(JSON.stringify(menuJson));

            return bridge;
        }).catch((err) => {
            return Promise.reject();
        });
    }

    bindEvents() {
        const el = $(document);

        const EVENTS = {
            'a': {
                click: (e) => {
                    const href = e.currentTarget.href;
                    const query = url.parse(href, true).query;
                    const uid = $('[name=uid]').val();

                    if (!('need_login' in query) || uid) {
                        return;
                    }

                    e.preventDefault();

                    this.bridgePromise.then((bridge) => {
                        bridge.send(JSON.stringify({
                            action: 'isSupport',
                            params: {
                                method: 'doLogin'
                            }
                        }), (response) => {
                            if (response == 'true') {
                                return bridge.send(JSON.stringify({
                                    action: 'doLogin'
                                }));
                            }

                            location.href = href;
                        });
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
}

new App();
