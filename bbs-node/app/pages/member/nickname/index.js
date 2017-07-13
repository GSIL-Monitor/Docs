/**
 * @overview 消息首页
 * @author cisong
 * @date 3/18/16
 */

import './index.less';

import request from 'request';
import Toast from '@wac/toast';

function validate(val) {
    const chineseReg = /[\u4e00-\u9fa5]/;
    const mustContainReg = /[\u4e00-\u9fa5a-zA-Z]/;
    const nickNameReg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;

    // 中文, 英文字母, 数字, _
    if (!nickNameReg.test(val)) {
        return '仅支持汉字、英文、数字及“_”';
    }

    // 需含英文或汉字
    if (!mustContainReg.test(val)) {
        return '需含英文或汉字';
    }

    // 总字符数 [4-20], 中文算两个字符
    const len = val.split('').reduce((a, b) => {
        return a + (chineseReg.test(b) ? 2 : 1);
    }, 0);

    if (len < 4 || len > 20) {
        return '昵称需 4-20 字符，汉字占两个字符';
    }

    return true;
}

const tipEl = $('.js-tip');
const errEl = $('.js-error');
const nickEl = $('.js-nickname');

class App {
    constructor() {
        this.initVal = nickEl.val();
        this.bridgePromise = new Promise((resolve, reject) => {
            if (window.WebViewJavascriptBridge) {
                resolve(WebViewJavascriptBridge);
            } else {
                document.addEventListener('WebViewJavascriptBridgeReady', function () {
                    resolve(WebViewJavascriptBridge)
                }, false);
            }

            window.onload = () => {
                setTimeout(() => {
                    if (!window.WebViewJavascriptBridge) {
                        reject();
                    }
                }, 0);
            }
        }).then((bridge) => {
            bridge.init(function (message, sendResponse) {
            });

            return bridge;
        }).catch((err) => {
            return Promise.reject();
        });

        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        const el = $(document);

        const EVENTS = {
            // 提交修改
            '.js-form': {
                submit: (e) => {
                    e.preventDefault();

                    const val = nickEl.val();
                    const initVal = this.initVal;

                    if (!val || val === initVal) {
                        return Toast('请填写新昵称');
                    }

                    const ret = validate(val);

                    if (ret !== true) {
                        tipEl.hide();
                        errEl.text(ret).show();
                        return;
                    }

                    request({
                        method: 'post',
                        url: '/member/save_name',
                        data: {
                            newName: val
                        }
                    }).then((ret) => {
                        Toast('修改成功');

                        return Promise.delay(500);
                    }).then(() => {
                        return this.bridgePromise.then((bridge) => {
                            var data = {
                                "action": "closeWebView",
                                "params": {
                                    "message": {
                                        "action": "nicknameEdit"
                                    }
                                }
                            };

                            bridge.send(JSON.stringify(data));
                        }).catch(() => {
                            location.href = 'wacai://close';
                        })
                    }).catch(() => {

                    });
                }
            },

            // 输入昵称
            '.js-nickname': {
                input: (e) => {
                    tipEl.show();
                    errEl.hide();
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
