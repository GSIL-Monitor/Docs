/**
 * @overview
 * @author cisong
 * @date 3/2/16
 */

import './index.less';

import 'babel-polyfill';
import Promise from 'bluebird';
import FastClick from 'fastclick';
import lazyLoad from 'lazyload';
import Stat from '@wac/lotus-stat';

// if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'){
//      const vconsole = require('vconsole');
// }

Promise.config({
    warnings: false,
    longStackTraces: true
});

require('babel-runtime/core-js/promise').default = Promise;

window.Promise = Promise;
window.$ = $;
window.Stat = Stat;
window.lazyLoad = lazyLoad();

FastClick.attach(document.body);

function insertScript(src) {
    var hm = document.createElement("script");
    hm.async = true;
    hm.src = src;
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
}

// debug log， 仅仅支持开发环境和测试环境打印log信息
const DEBUG_MODE = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
const log = DEBUG_MODE ? console.log.bind(console) : function () {};
window.log = log;

// 莲子埋点初始化
Stat.init({
    APP_KEY: 'Q0xMQh7P5M8Jdkcq2Sv8'
});
// 自定义莲子埋点
$(document).on('click', '[data-stat]', (e) => {
    const target = $(e.currentTarget);
    const eventCode = target.data('stat');

    Stat.send('stat', {
        evt: eventCode
    });
});


//老的php埋点统计
const phpStat = require('./php-stat');
phpStat.sendStat();

// 百度埋点
window._hmt = window._hmt ||[];
insertScript('//hm.baidu.com/hm.js?bc65f2f4ddfe3a1cda888f512e73f7f1');

// 腾讯埋点
insertScript('//tajs.qq.com/stats?sId=9694862');
