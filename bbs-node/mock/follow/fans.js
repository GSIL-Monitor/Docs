module.exports = function(req){
	return {
    "code": 0,//code为0成功、其他失败
    "data": [
        {
            "avatarUrl": "//avatar.wacdn.com/e792393f1aea4668934277d334d0ca11.jpg?imageView2/1/w/120/h/120",//头像地址
            "fansNum": 575,//粉丝数
            "followerNum": 1373,//关注数
            "verify":true,
            "homePage": "//bbs.wacai.com/m/profile?uid=4365299&popup=1&need_zinfo=1",//个人主页地址
            "mutual": -1,//和当前登录用户的关注状态
            "uid": 4365299,//uid
            "username": "沙与墨"//昵称
        },
        {
            "avatarUrl": "//avatar.wacdn.com/e10ba4adc6d7711930c18f4751e8819.jpg?imageView2/1/w/120/h/120",
            "fansNum": 2629,
            "followerNum": 836,
            "homePage": "//bbs.wacai.com/m/profile?uid=4348379&popup=1&need_zinfo=1",
            "mutual": 1,
            "uid": 4348379,
            "username": "精灵宝戒"
        }
    ]
}
}