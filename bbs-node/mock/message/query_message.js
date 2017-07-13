/**
 * @overview
 * @author cisong
 * @date 3/23/16
 */

module.exports = function (req) {
    const form = req.body;

    const messages = Array.apply(null, {
        length: 0
    }).map(() => {
        return {
            id: 0,
            sessionId: '10001',
            uid: 2230550,
            message: 'Hello?',
            time: '2015-3-2',
            timestamp: Date.now()
        };
    });

    return {
        code: 0,
        data: {
            messages: messages.concat([
                {
                    id: 1,
                    sessionId: '10001',
                    uid: 2230550,
                    message: '在  <script></script> "" “” * ( )  （）吗',
                    time: '2016-03-03',
                    timestamp: Date.now()
                },
                {
                    id: 1,
                    sessionId: '10001',
                    uid: 111,
                    message: '恭喜您, 您的帖子<a href="nt://app/message">帖子链接</a> 被顶置了!',
                    time: '2016-03-03',
                    timestamp: Date.now()
                },
                {
                    id: 2,
                    sessionId: '10001',
                    uid: 233,
                    message: '有事吗',
                    time: '03-06',
                    timestamp: Date.now()
                }
            ]),
            members: [
                form.targetUid == 111 ? {
                    uid: 2230550,
                    userName: '挖财君',
                    publicUser: true,
                    userHead: 'http://s1.wacdn.com/wis/6/17e07e5b741ef142_70x70.png'
                } : {
                    uid: 2230550,
                    userName: '猴小猴',
                    publicUser: false,
                    userHead: 'http://avatar.wacdn.com/e10ba4adc6d7711930c18f4751e8819.jpg'
                },
                {
                    uid: 233,
                    userName: '呆马',
                    publicUser: false,
                    userHead: 'http://avatar.wacdn.com/9af7933f2bc5ea48b88a972f11fce9b.jpg'
                }
            ],
            currentUid: 233
        }
    };
};
