/**
 * 客户端检测
 */
export default () => {
  return {
    userAgent: navigator.userAgent.toLowerCase(),
    isAndroid: Boolean(navigator.userAgent.match(/android/ig)),
    isIOS: Boolean(navigator.userAgent.match(/iphone|ipod|ipad/ig)),
    isIpad: Boolean(navigator.userAgent.match(/ipad/ig)),
    isWeixin: Boolean(navigator.userAgent.match(/MicroMessenger/ig)),
  }
}