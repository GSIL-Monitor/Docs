/**
 * @overview
 * @author cisong
 * @date 6/3/16
 */

module.exports = function () {
    const items = [
        {
            "fansCount": 4,
            "follow": false,
            'self': true,
            "headImgUrl": "//avatar.wacdn.com/static/image/noavatar.gif?imageView2/1/w/120/h/120",
            "homePageUrl": "//bbs.wacaiyun.com/m/profile?uid=2300022&popup=1&need_zinfo=1",
            "indexId": 112,
            "lastThread": "图片贴咿呀",
            "nickName": "WWWWWWWWWWWWWWWWWWWW",
            "uid": 2300022
        },
        {
            "fansCount": 2,
            "follow": true,
            "headImgUrl": "http://avatar.wacdn.com/bd2e5ad74e304588ad3f57baa630635c.jpg?imageView2/1/w/120/h/120",
            "homePageUrl": "//bbs.wacaiyun.com/m/profile?uid=2300083&popup=1&need_zinfo=1",
            "indexId": 82,
            "lastThread": "周一",
            "nickName": "财主571889889",
            "uid": 2300083
        },
        {
            "fansCount": 3,
            "follow": true,
            'self': true,
            "headImgUrl": "//avatar.wacdn.com/static/image/noavatar.gif?imageView2/1/w/120/h/120",
            "homePageUrl": "//bbs.wacaiyun.com/m/profile?uid=2300056&popup=1&need_zinfo=1",
            "indexId": 23,
            "lastThread": "发个帖-回复bug回归",
            "nickName": "股神欧巴",
            "uid": 2300056
        },
        {
            "fansCount": 0,
            "follow": false,
            "headImgUrl": "//avatar.wacdn.com/static/image/noavatar.gif?imageView2/1/w/120/h/120",
            "homePageUrl": "//bbs.wacaiyun.com/m/profile?uid=2230648&popup=1&need_zinfo=1",
            "indexId": 19,
            "nickName": "签到测试",
            "uid": 2230648
        }
    ];

    return {
        $$delay: 30,
        "code": 0,
        "data": Array.from({length: 20}, () => {
            return items[Math.floor(Math.random() * items.length)]
        })
    };
};
