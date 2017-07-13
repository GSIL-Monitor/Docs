var user = {
    nickName: '<em>呆</em>马',
    uid: 1001,
    headImgUrl: 'http://bbs.wacai.com/uc_server/avatar.php?uid=329007',
    homePageUrl: 'http://bbs.wacai.com/m/profile?uid=329007&popup=1',
    fansNum: 123,
    postNum: 234
};

module.exports = function () {
    return {
        "code": 0,
        "error": "搜索异常",
        "data": Array.apply(null, {length: 15}).map(function () {
            return user;
        })
    };
};
