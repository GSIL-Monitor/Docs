//老的php埋点统计
var _APPS = {
	// 挖财记账理财 Android: 2, IOS: 3, IOS91越狱版: 8
	'bkk': [2, 3, 8],
	// 钱管家 IOS: 30, Android: 31
	'money': [30, 31],
	// 挖财宝 IOS: 40, Andorid: 41
	'finance': [40, 41],
	// 信用卡管家 Android: 20, IOS: 21
	'credit': [20, 21],
	// 快贷 Android: 61, IOS: 60
	'loan': [60, 61],
	// 挖财股神 Android: 81, IOS: 80
	'stock': [80, 81],
	// 挖财社区/钱堂 Android: 71, IOS: 70
	'bbs': [70, 71]
};
/* 链接上获取参数 */
function getQueryString(name) {
	var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");

	return reg.test(location.href) ? decodeURIComponent(RegExp.$2.replace(/\+/g, " ")) : "";
}
var ua = navigator.userAgent.toLowerCase();
var platform = /platform\/([\S]*)/i.test(ua) ? +RegExp.$1 : getQueryString('platform');
var url = "/api/services/index.php";
var data = {
	api: "UserVisiteLog",
	tid: window.__INIT_DATA__ ? window.__INIT_DATA__.tid : "",
	fid: window.__INIT_DATA__ ? window.__INIT_DATA__.fid : "",
	platform: platform || "",
	currentUrl: encodeURIComponent(window.location.href),
	prevUrl: encodeURIComponent(document.referrer) || ""
}


module.exports = {
	sendStat: function(){
		$.get(url, data)
	}
}