/**
 * @overview 签到未登录页面
 * @author cisong
 * @date 10/24/16
 */

import './intro.less';

import { doLogin } from 'login';

class App {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        const el = $(document);

        const EVENTS = {
            '.js-login': {
                click: doLogin
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
