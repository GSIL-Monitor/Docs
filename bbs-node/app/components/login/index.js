/**
 * @overview 登录组件
 * @author cisong
 * @date 10/24/16
 */

const ua = navigator.userAgent.toLowerCase();
const href = encodeURIComponent(location.href);
const isProd = ['staging', 'production'].indexOf(process.env.NODE_ENV) > -1;
const protocol = isProd ? 'https:' : 'http:';
const host = isProd ? 'wacai.com' : 'wacaiyun.com';
const loginUrl = `${protocol}//user.${host}/h5_login?popup=1&need_login=1&url=${href}`;

const bridgePromise = new Promise((resolve) => {
    if (window.WebViewJavascriptBridge) {
        resolve(WebViewJavascriptBridge);
    } else {
        document.addEventListener('WebViewJavascriptBridgeReady', function(e) {
            resolve(e.bridge);
        }, false);
    }
});

export function doLogin() {
    // 去登录
    if (/wacai/i.test(ua)) {
        bridgePromise.then((bridge) => {
            bridge.send(JSON.stringify({
                action: 'doLogin'
            }));
        });
    } else {
        location.href = loginUrl;
    }
}
