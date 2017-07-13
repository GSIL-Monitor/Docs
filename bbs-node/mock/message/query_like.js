/**
 * @overview
 * @author cisong
 * @date 3/23/16
 */

const items = [
    {
        uid: 222,
        fromUserNick: '猴小猴',
        fromUserId: '2223',
        fromUserHead: 'http://avatar.wacdn.com/e10ba4adc6d7711930c18f4751e8819.jpg',
        subject: '4月8日开始，海淘商品价格，将出现很大变化',
        tid: 1001,
        pid: 1002,
        weibo: false,
        time: '3-16'
    },
    {
        uid: 223,
        fromUserNick: '呆马',
        fromUserId: '2223',
        fromUserHead: 'http://avatar.wacdn.com/9af7933f2bc5ea48b88a972f11fce9b.jpg',
        subject: '本次活动获奖名单奖励会以微信/短信的方式发放给各位获奖用户',
        tid: 1002,
        pid: 1002,
        weibo: true,
        time: '3-16'
    },
    {
        uid: 222,
        fromUserNick: '猴小猴',
        fromUserId: '2223',
        fromUserHead: 'http://avatar.wacdn.com/e10ba4adc6d7711930c18f4751e8819.jpg',
        subject: '本次活动获奖名单奖励会以微信/短信的方式发放给各位获奖用户',
        tid: 1003,
        pid: 1002,
        weibo: false,
        time: '3-16'
    }
];

module.exports = function () {
    return {
        $$delay: 300,
        code: 0,
        data: Array.apply(null, {length: 15}).map(function () {
            return items[0];
        })
    };
};
