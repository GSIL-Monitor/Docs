/**
 * 常量管理模块
 * @module constants
 */

/**
 * 挖财记账理财 Android: 2, iOS: 3, iOS91越狱版: 8
 * 钱管家 iOS: 30, Android: 31
 * 挖财宝 iOS: 40, Andorid: 41
 * 信用卡管家 Android: 20, iOS: 21
 * 快贷 Android: 61, iOS: 60
 * 挖财股神 Android: 81, iOS: 80
 * 挖财社区 Android: 71, iOS: 70
 */

/**
 * 挖财宝平台号集合
 * @constant
 * @type {Array}
 */
exports.financeApp = [ 40, 41 ];

/**
 * 钱管家平台号集合
 * @constant
 * @type {Array}
 */
exports.moneyApp = [ 30, 31 ];

/**
 * 理财记账平台号集合
 * @constant
 * @type {Array}
 */
exports.bkkApp = [ 2, 3, 8 ];

/**
 * 信用管家平台号集合
 * @constant
 * @type {Array}
 */
exports.creditApp = [ 20, 21 ];

/**
 * 快贷平台号集合
 * @constant
 * @type {Array}
 */
exports.loanApp = [ 60, 61 ];

/**
 * 股神平台号集合
 * @constant
 * @type {Array}
 */
exports.stockApp = [ 80, 81 ];

/**
 * 挖财社区平台号集合
 * @constant
 * @type {Array}
 */
exports.bbsApp = [ 70, 71 ];


/**
 * 挖财基金平台号集合
 * @constant
 * @type {Array}
 */
exports.fundApp = [ 120, 121 ];

/**
 * 贷款吧
 * @constant
 * @type {Array}
 */
exports.daiKuanApp = [ 72, 73 ];

/**
 * 登录串字段集合
 * @constant
 * @type {Array}
 */
exports.accountKeys = [
	'account',
	'uid',
	'userId',
	'ts',
	'sign',
	'mc',
	'version',
	'platform',
	'access_token'
];