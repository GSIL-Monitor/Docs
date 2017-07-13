exports.getVersion = function(ctx) {
	const version = ctx.headers['x-appver'];
	return version;
};

exports.versionFormat = function(ver) {
	var version = ver.split('.');

	return {
		full: ver,
		major: parseInt(version[0], 10),
		minor: parseInt(version[1], 10),
		patch: parseInt(version[2], 10),
		extra: version[3] ? parseInt(version[3], 10) : null
	};
};

/**
 * 版本号比较
 * @param  {String} a 版本号 a
 * @param  {String} b 版本后 b
 * @return {Number}   0: a == b， 1：a > b, -1: a < b
 */
exports.versionCompare = function(a, b) {
	
	if (a === b) return 0;

	a = a.split('.');
	b = b.split('.');
	var alen = a.length, blen = b.length;
	var countLen = (alen <= blen ? alen : blen);

	for (var i = 0; i < countLen; i++) {
		a[i] = parseInt(a[i], 10);
		b[i] = parseInt(b[i], 10);

		if (a[i] > b[i]) return 1;
		else if (a[i] < b[i]) return -1;
		else {
			if (i == countLen - 1) {
				if (a[countLen]) {
					return a[countLen] == '0' ? 0 : 1
				}
				if (b[countLen]) {
					return b[countLen] == '0' ? 0 : -1
				}
			}
		}
	}
};