module.exports = function(env) {
    const testUsers = [{
        userName: "我挖测试一号",
        uid: 2230070,
        desc: "有事发公告，没事看大门",
        verify: 1,
        avatarUrl: '//s1.wacdn.com/wis/10/19c97fd2544447a2_120x120.png'
    }, {
        userName: "寒号鸟",
        uid: 2300052,
        desc: "财商biu的一下提高了",
        verify: 2,
        avatarUrl: '//s1.wacdn.com/wis/10/2f97c402b47acd31_120x120.jpg'
    }, {
        userName: "求告知",
        uid: 2059669,
        desc: "把理财高手交出来",
        verify: 2,
        avatarUrl: '//s1.wacdn.com/wis/10/b0014b264be57ff0_110x110.png'
    }, {
        userName: "隔壁老王",
        uid: 1618935,
        desc: "干货不过时",
        verify: 2,
        avatarUrl: '//s1.wacdn.com/wis/10/7e573cb27d8d669c_110x110.png'
    }, {
        userName: "CKneiku",
        uid: 2230294,
        desc: "只是因为在人群多赚了一点",
        verify: 2,
        avatarUrl: '//s1.wacdn.com/wis/10/cecab661c409ef28_120x120.png'
    }];

    const prodUsers = [{
        userName: "小猫钱钱",
        uid: 1257516,
        desc: "财商biu的一下提高了",
        verify: 2,
        avatarUrl: '//s1.wacdn.com/wis/10/2f97c402b47acd31_120x120.jpg'
    }, {
        userName: "挖红人",
        uid: 5720564,
        desc: "把理财高手交出来",
        verify: 2,
        avatarUrl: '//s1.wacdn.com/wis/10/b0014b264be57ff0_110x110.png'
    }, {
        userName: "挖好帖",
        uid: 4832439,
        desc: "干货不过时",
        verify: 2,
        avatarUrl: '//s1.wacdn.com/wis/10/23fce8d878fc4b14_120x120.png'
    }, {
        userName: "金钱故事会",
        uid: 5720587,
        desc: "只是因为在人群多赚了一点",
        verify: 2,
        avatarUrl: '//s1.wacdn.com/wis/10/cecab661c409ef28_120x120.png'
    }];

    return env == 'production' || env === 'staging' ? prodUsers : testUsers;
};
