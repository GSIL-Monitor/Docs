export default {
	// 1.格式化相关
	leadingZero: function(num) {
		return (num < 10 ? '0' : '') + num;
	},

	randomRange: function(low, high) {
		return (Math.random() * (high - low)) + low;
	},

	// 格式化时间
	formatTime: function(data, format) {
		return new Date(Date.parse(data.replace(/-/g, "/"))).format(format);
	},

	// 格式化手机号
	maskMobile: function(phone) {
		return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
	},

	// 小数点格式化
	round: function(value, places) {
		var multiplier = Math.pow(10, places || 2);
		return (Math.round(value * multiplier) / multiplier);
	},

	// 字符串转时间
	str2Date: function(s) {
		return new Date(Date.parse(s.replace(/-/g, "/")));
	},

	normByFormat: function(date) {
		return {
			'yyyy': date.getFullYear(),
			'yy': date.getFullYear().toString().slice(-2),
			'MM': date.getMonth() + 1,
			'dd': date.getDate(),
			'hh': date.getHours(),
			'mm': date.getMinutes(),
			'ss': date.getSeconds()
		}
	},
	// 日期格式化,第一个参数为日期类型，第二个参数为yyy，yy,MM,dd,hh,mm,ss的组合
	formatDate: function(date, type) {
		var norm = this.normByFormat(this.str2Date(date));
		return type.replace(/([a-z]+)/ig, function(n) {
			return (typeof norm[n] != "undefined" ? (norm[n] < 10 ? '0' + norm[n] : norm[n]) : n);
		});
	},

	// 数值格式化
	/*
	 * 1.小于1万，显示xxx人
	 * 2.超过1万，显示 单位 w，留1位小数点
	 */
	number2W: function(amount) {
		if (amount < 0) {
			return 0;
		} else if (amount < 10000) {
			return amount
		} else {
			return this.round(amount / 10000,1) + "万"
		}

		return amount;
	},

	friendlyTime: function(time) {
		let date = (typeof time === 'number') ? new Date(time) : this.str2Date(time);
		let diff = (((new Date()).getTime() - date.getTime()) / 1000);
		let dayDiff = Math.floor(diff / 86400);

		let isValidDate = typeof date === 'object' && !isNaN(date.getTime())

		if (!isValidDate) {
			console.error('not a valid date')
		}
		const formatDate = function(date) {
			let today = new Date(date)
			let year = today.getFullYear()
			let month = ('0' + (today.getMonth() + 1)).slice(-2)
			let day = ('0' + today.getDate()).slice(-2)
			let hour = today.getHours()
			let minute = today.getMinutes()
			let second = today.getSeconds()
			return `${year}-${month}-${day}`
		}

		if (isNaN(dayDiff) || dayDiff < 0 || dayDiff >= 31) {
			return formatDate(date)
		}

		return dayDiff === 0 && (
				diff < 60 && '刚刚' ||
				diff < 120 && '1分钟前' ||
				diff < 3600 && Math.floor(diff / 60) + '分钟前' ||
				diff < 7200 && '1小时前' ||
				diff < 86400 && Math.floor(diff / 3600) + '小时前') ||
			dayDiff === 1 && '昨天' ||
			dayDiff < 7 && dayDiff + '天前' ||
			dayDiff < 31 && Math.ceil(dayDiff / 7) + '周前'
	}
}