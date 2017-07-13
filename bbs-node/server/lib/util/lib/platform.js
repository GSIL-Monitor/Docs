
const constants = require('./constants');
const Version = require('./version');

exports.isApp = function (platform, name) {
	if (name) {
		return constants[name + 'App'].indexOf(Number(platform)) >= 0;
	} else {
		var all = constants.financeApp
			.concat(constants.bkkApp)
			.concat(constants.moneyApp)
			.concat(constants.loanApp)
			.concat(constants.creditApp)
			.concat(constants.stockApp)
			.concat(constants.fundApp)
			.concat(constants.bbsApp)
			.concat(constants.daiKuanApp);

		return all.indexOf(Number(platform)) >= 0;
	}
};

exports.getPlatform = function (ctx) {

	const userAgent = ctx.headers['user-agent'] || 'unknown';
    const xPlatform = ctx.headers['x-platform'];

	const platform = /platform\/([\S]*)/i.test(userAgent) ? +RegExp.$1 : (xPlatform ? xPlatform : '');

	return platform;
};

exports.isQiantangApp = function(ctx){
	const version = Version.getVersion(ctx) || ctx.query.version;
	const platform = exports.getPlatform(ctx) || ctx.query.platform;

	const isQianTangApp = !!version && Version.versionCompare(version,'2.0.0') != -1 && exports.isApp(platform, 'bbs');

	return isQianTangApp;
}

exports.isBBSApp = function(ctx){
	const platform = exports.getPlatform(ctx) || ctx.query.platform;
	const isBBSApp = exports.isApp(platform, 'bbs');
	return isBBSApp;
}

/**
 * 是否钱堂sdk
 * @ctx  koa上下文对象
 */
exports.isQiantangSdk = function(ctx){
	const bbsWaxVersion = ctx.query.bbsWaxVersion || '';
	return bbsWaxVersion;
}
/**
 * 是否钱堂sdk
 * @ctx  koa上下文对象
 * 包括钱堂app和钱堂sdk
 */
exports.isQiantang = function(ctx){
	return !!(this.isQiantangApp(ctx) || this.isQiantangSdk(ctx));
}

