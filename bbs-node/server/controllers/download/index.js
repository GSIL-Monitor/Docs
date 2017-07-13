/**
 * @overview 下载页面
 * @author qingtong
 * @date 4/26/17
 */

module.exports = function*() {
	const userAgent = this.headers['user-agent'] || 'unkown';

	isWechat = /MicroMessenger/.test(userAgent);

    yield this.render('download/index', {isWechat});
};

