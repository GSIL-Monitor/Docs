require('./index.less');
const urlParse = require('url').parse;

if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'){
     const vconsole = require('vconsole');
}

var agent = navigator.userAgent,
	isAndroid = /Android/.test(agent),
	isIOS = /iPhone|iPad/.test(agent),
	isWechat = /MicroMessenger/.test(agent),
	isIOSSafari = isIOS && /Safari/.test(agent),
	isWeibo = /Weibo/.test(agent),
	isDesktop = !/Android|iPhone|iPad/i.test(agent),
	isDouban = /douban/.test(agent);


const documentElement = window.document.documentElement;

// 外部分享APP
const shareApp = isWechat || isWeibo || isDouban;
/**
 * 当外部分享app里面或者ios safari打开，出现arrow导航条
 */
const showArrow = shareApp || isIOSSafari;

// parse url
const parsed = urlParse(location.href, true, true);

function showDownloadArrow() {
	if (showArrow) {
		documentElement.dataset.layout = "showOpenGuide";
		var t = document.querySelector("#guideText");
		isIOSSafari ? t.textContent = "请下拉页面点击「打开」" : isIOS ? t.textContent = "请点击右上角用「Safari」打开" : t.textContent = "请点击右上角用浏览器打开"
	}
};

function downloadLink() {
	var t = document.querySelector("#downloadLink");
	if(!t) return;
	isWechat ? t.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.zhihu.android&g_f=991703" :  t.href = "http://www.wacai.com/app/download?key=wacaicommunity_00000001";
};

// 如果不在分享app里面打开, 并且不是在桌面打开
if( !(shareApp || isDesktop)) {
	const targetUrl = parsed.query.target || '';
	location.href = "wacaiForum:/" + decodeURIComponent(targetUrl);
}

showDownloadArrow();
downloadLink();



