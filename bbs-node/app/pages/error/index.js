/**
 * @overview
 * @author cisong
 * @date 4/26/16
 */

class App {
    constructor() {
        const state = this.state = window.__INIT_DATA__ || {};

        try {
            Stat.send('error', state);
        } catch (e) {}

        this.init();
    }

    init() {
        const { type } = this.state;
        const loginUrl = this.getLoginUrl();
        const userAgent = navigator.userAgent.toLowerCase();

        // 非需要登录错误
        if (type !== 'login') {
            return;
        }

        // 浏览器端跳转到 h5 登录
        if (!/wacai/i.test(userAgent)) {
            return location.href = loginUrl;
        }

        // jsbridge 登录
        new Promise((resolve) => {
            if (window.WebViewJavascriptBridge) {
                resolve(WebViewJavascriptBridge);
            } else {
                document.addEventListener('WebViewJavascriptBridgeReady', function(e) {
                    resolve(window.WebViewJavascriptBridge);
                }, false);
            }
        }).timeout(5000).then((bridge) => {
            bridge.send(JSON.stringify({
                action: 'doLogin'
            }));
        }).catch(() => {
            location.href = 'wacai://login';
        });
    }

    getLoginUrl() {
        const { type, referrer } = this.state;
        const isProd = ['staging', 'production'].includes(process.env.NODE_ENV);
        const protocol = isProd ? 'https:' : 'http:';
        const host = isProd ? 'wacai.com' : 'wacaiyun.com';
        const redirectUrl = type === 'login' && referrer || location.href;

        return `${protocol}//user.${host}/h5_login?popup=1&need_login=1&url=${redirectUrl}`;
    }
}

new App();
