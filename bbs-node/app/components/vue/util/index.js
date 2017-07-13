var extend =  require('object-assign');

var util = {
	// 1.格式化相关
	leadingZero : function(num){
        return (num < 10 ? '0' : '') + num;
    },

    randomRange:function(low, high){
		return Math.floor(Math.random() * (high - low)) + low;
	},

    //格式化时间
    formatTime : function(data,format){
        var that = this;
        return that.formatDate(new Date(Date.parse(data.replace(/-/g,  "/"))),format);
    },

    //字符串转时间
    str2Date : function(s){
        return new Date(Date.parse(s.replace(/-/g,  "/")));  
    },

    //接收时间戳转时间
    buildDate : function(time,format){
      var that = this,date = new Date(time),data;

      Y = date.getFullYear() + '-';
      M = (date.getMonth()+1) + '-';
      D = date.getDate() + ' ';
      h = date.getHours() + ':';
      m = date.getMinutes() + ':';
      s = date.getSeconds(); 

      data = (Y+M+D+h+m+s);

      return that.formatTime(data,format);
    },

    // 格式化银行卡
	formatBankCard : function(card){  
		var val = card,
			out = val.match(/\d{1,4}/g);
		out = out ? out.join(' ') : '';
		return out;
	},
	// 格式化个人身份证号
	formatPersonCard : function (text){
		// 身份证格式处理
		var out = text.replace(/\s*/g, '').match(/^(\d{1,6})(\d{1,8})?(\d{1,4}|\d{1,3}X|\d{1,3}x)?$/);
		// 处理格式化的数据
		out = out ? out.slice(1).join(' ') : '';
		// 去除空格
		out = out.replace(/(^\s*)|(\s*$)/g, '');

		return out;
	},
	// 格式化手机号
	formatTel : function (num){
		var out = String(num).match(/^(\d{1,3})(\d{1,4})(\d{1,4})$/);
		// 处理格式化的数据
		out = out ? out.slice(1).join(' ') : '';
		return out;
	},
	
	normByFormat : function(date){
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
	//日期格式化,第一个参数为日期类型，第二个参数为yyy，yy,MM,dd,hh,mm,ss的组合
	formatDate : function(date,type){
		var norm = this.normByFormat(date);
	    return type.replace(/([a-z]+)/ig, function(n){
	        return (typeof norm[n] !="undefined" ? (norm[n] < 10 ? '0' + norm[n] : norm[n]) : n);
	    });
	},
	
  debounce : function (func, threshold, execAsap) {
      var timeout;
      return function debounced () {
          var obj = this, args = arguments;
          function delayed () {
              if (!execAsap)
                  func.apply(obj, args);
              timeout = null;
          };

          if (timeout)
              clearTimeout(timeout);
          else if (execAsap)      
              func.apply(obj, args);

          timeout = setTimeout(delayed, threshold || 100);
      };
    },

    count : function(oCount,t,callback){
       var timer = null;

       var countdown = function () { 
            if (t <= 0) {                   //倒计时结束
                clearInterval(timer);
                if(callback){callback();}
            } else {
                oCount.html(t);   
            }
            t--;
        };
        countdown();
        timer = setInterval(countdown, 1000); 
    },
  //4.uri操作
  //updateQueryString('http://www.wacai.com/xxx.action?class_id=3&id=2','class_id',11);
    updateQueryString : function (uri, key, value) {
          var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
          var separator = uri.indexOf('?') !== -1 ? "&" : "?";
          if (uri.match(re)) {
            return uri.replace(re, '$1' + key + "=" + value + '$2');
          }
          else {
            return uri + separator + key + "=" + value;
          }
    },
    
    removeURLParameter : function(url, parameter) {
        var urlparts= url.split('?');   
        if (urlparts.length>=2) {

            var prefix= encodeURIComponent(parameter)+'=';
            var pars= urlparts[1].split(/[&;]/g);

            //反向遍历
            for (var i= pars.length; i-- > 0;) {    
                // string.startsWith
                if (pars[i].lastIndexOf(prefix, 0) !== -1) {  
                    pars.splice(i, 1);
                }
            }

            url= urlparts[0]+'?'+pars.join('&');
            return url;
        } else {
            return url;
        }
    },

    getQuery : function(name){
        var result = location.search.match(new RegExp("[\?\&]" + name+ "=([^\&]+)","i"));
        if(result == null || result.length < 1){
            return "";
        }
        return result[1];
    },
    
    serialize : function (data) {
        if (!Object.keys) Object.keys = function(o) {
          if (o !== Object(o))
            throw new TypeError('Object.keys called on a non-object');
          var k=[],p;
          for (p in o) if (Object.prototype.hasOwnProperty.call(o,p)) k.push(p);
          return k;
        }
		return Object.keys(data).map(function (key) {
			return key + '=' + data[key];
		}).join('&');
	},
  getStyle: function(elem, style) {
    return window.getComputedStyle(elem, null).getPropertyValue(style);
  },
 uuid:function(){
    return Math.random().toString(36).substring(3, 8)
 }
};

export default util;