/**
 * @overview
 * @author cisong
 * @date 3/23/16
 */

const items = [
    {
        id: 1001,
        sessionId: '2001',
        uid: 111,
        fromUid: 233,
        fromUserName: '挖财君',
        fromUserHead: 'http://s1.wacdn.com/wis/6/17e07e5b741ef142_70x70.png',
        message: '恭喜您中奖啦!',
        createTime: '3-16',
        unread: 1
    },
    {
        id: 1002,
        sessionId: '2002',
        uid: 111,
        fromUid: 233,
        fromUserName: '呆马',
        fromUserHead: 'http://avatar.wacdn.com/9af7933f2bc5ea48b88a972f11fce9b.jpg',
        message: '吃了吗?',
        createTime: '3-16',
        unread: 1
    },
    {
        id: 1003,
        sessionId: '2003',
        uid: 111,
        fromUid: 233,
        fromUserName: '猴小猴',
        fromUserHead: 'http://avatar.wacdn.com/e10ba4adc6d7711930c18f4751e8819.jpg',
        message: '春天把十万块埋土里，秋天就有二十万了, 你说对不对啊',
        createTime: '3-16',
        unread: 0
    }
];

module.exports = function () {
    return {
        $$delay: 300,
        code: 0,
        // data: Array.apply(null, {length: 14}).map(function () {
        //     return items[0];
        // }),
        data: items
    };
};
