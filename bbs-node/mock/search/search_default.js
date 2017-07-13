var user = {
    nickName: '<em>呆</em>马',
    uid: 1001,
    headImgUrl: 'http://bbs.wacai.com/uc_server/avatar.php?uid=329007',
    homePageUrl: 'http://bbs.wacai.com/m/profile?uid=329007&popup=1&need_login',
    fansNum: 123,
    postNum: 234
};
var post = {
    tid: 2001,
    subject: '外面<em>呆</em>在再久，也少了点家的感觉',
    message: '在外面<em>呆</em>久了，你还真的觉得只有重庆这块地是宝地的感觉！可能就是大家都说的“金窝银窝不如自己的狗窝',
    postUrl: 'http://bbs.wacai.com/forum.php?mod=viewthread&tid=2599940&popup=1'
};

module.exports = function () {
    return {
        $$delay: 100,
        "code": 0,
        "data": {
            "searchUserVOList": Array.apply(null, {length: 3}).map(function () {
                return user;
            }),
            "searchPostVOList": Array.apply(null, {length: 15}).map(function () {
                return post;
            })
        }
    };
};
