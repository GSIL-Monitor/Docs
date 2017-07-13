/**
 * @overview
 * @author cisong
 * @date 4/18/16
 */

module.exports = function (req) {
    return {
        code: 0,
        data: {
            uid: 233,
            todayCopper: 10,
            tomorrowCopper: 20,
            continueSignDay: 9999, // 连续签到天数
            signCredit: 233, // 签到累计铜钱
            copperCount: 233, // 铜钱总数
            ranking: 345, // 铜钱排名
            isShare: false, // 今天是否分享
            isSign: false, // 今天是否签到
            signDays: [1, 3, 4, 5, 6, 7, 12, 15, 18], // 本月签到天数
            headImgUrl: 'http://avatar.wacdn.com/e10ba4adc6d7711930c18f4751e8819.jpg',
            shareCopper: 10 // 分享获得铜钱数量
        }
    };
};
