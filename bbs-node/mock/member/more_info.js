/**
 * @overview
 * @author cisong
 * @date 4/8/16
 */

module.exports = function (req) {
    return {
        $$header: {
            'set-cookie': 'token=f7daf78ds78a; expires=Wed, 23-Nov-2016 05:40:34 GMT; path=/; domain=.wacaiyun.com;'
        },
        code: 0,
        data: {
            'fansCount': 233, // 粉丝数
            'followCount': 40, // 关注数
            'verifyUrl': 'http://bbsimg.wacdn.com/common/eb/common_120160126069212_verify_icon.png',
            'headImgUrl': 'http://avatar.wacdn.com/e10ba4adc6d7711930c18f4751e8819.jpg', // 头像
            'homePageUrl': 'http://bbs.staging.wacai.com/m/profile?uid=3680667&popup=1&need_zinfo=1', // 个人主页
            'isSign': true, // 今天是否签到
            'nickName': '猴小猴', // 昵称
            'signCount': 4, // 连续签到次数
            'taolunCount': 3, // 发帖数
            'uid': 3680667,
            'wcUid': 45909198,
            'copperCount': 1024,
            'msgCount': 100
        }
    };
};
